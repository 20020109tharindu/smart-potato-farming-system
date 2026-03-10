# PyTorch sprout length model: heatmap keypoint -> base/tip -> ratio -> class (none/short/medium/long)
# Matches Colab notebook: sprout_length_hrnet_keypoint_training.ipynb

import math
import os
import numpy as np
import cv2
import torch
import torch.nn as nn
import torch.nn.functional as F
from torchvision.models import resnet34, ResNet34_Weights

INPUT_SIZE = 256
HEATMAP_SIZE = 64
NUM_KEYPOINTS = 2  # base, tip


def heatmap_to_point(heatmap):
    """heatmap [H,W] -> (x, y) in heatmap coords."""
    idx = np.argmax(heatmap)
    y, x = np.unravel_index(idx, heatmap.shape)
    return float(x), float(y)


def euclidean_distance(p1, p2):
    return math.sqrt((p2[0] - p1[0]) ** 2 + (p2[1] - p1[1]) ** 2)


def classify_sprout_ratio(sprout_ratio):
    """Map ratio to label. Matches Colab thresholds."""
    if sprout_ratio < 0.05:
        return "none"
    elif sprout_ratio < 0.20:
        return "short"
    elif sprout_ratio < 0.45:
        return "medium"
    else:
        return "long"


class HeatmapKeypointNet(nn.Module):
    """ResNet34 backbone + decoder -> 2 heatmaps (base, tip). Matches Colab export."""

    def __init__(self, num_keypoints=2):
        super().__init__()
        backbone = resnet34(weights=ResNet34_Weights.DEFAULT)
        self.stem = nn.Sequential(
            backbone.conv1,
            backbone.bn1,
            backbone.relu,
        )
        self.maxpool = backbone.maxpool
        self.layer1 = backbone.layer1
        self.layer2 = backbone.layer2
        self.layer3 = backbone.layer3
        self.layer4 = backbone.layer4

        self.up1 = nn.Sequential(
            nn.ConvTranspose2d(512, 256, kernel_size=2, stride=2),
            nn.BatchNorm2d(256),
            nn.ReLU(inplace=True),
        )
        self.up2 = nn.Sequential(
            nn.ConvTranspose2d(256, 128, kernel_size=2, stride=2),
            nn.BatchNorm2d(128),
            nn.ReLU(inplace=True),
        )
        self.up3 = nn.Sequential(
            nn.ConvTranspose2d(128, 64, kernel_size=2, stride=2),
            nn.BatchNorm2d(64),
            nn.ReLU(inplace=True),
        )
        self.up4 = nn.Sequential(
            nn.ConvTranspose2d(64, 64, kernel_size=2, stride=2),
            nn.BatchNorm2d(64),
            nn.ReLU(inplace=True),
        )
        self.head = nn.Sequential(
            nn.Conv2d(64, 64, kernel_size=3, padding=1),
            nn.ReLU(inplace=True),
            nn.Conv2d(64, num_keypoints, kernel_size=1),
        )

    def forward(self, x):
        x = self.stem(x)
        x = self.maxpool(x)
        x = self.layer1(x)
        x = self.layer2(x)
        x = self.layer3(x)
        x = self.layer4(x)
        x = self.up1(x)
        x = self.up2(x)
        x = self.up3(x)
        x = self.up4(x)
        x = F.interpolate(x, size=(HEATMAP_SIZE, HEATMAP_SIZE), mode="bilinear", align_corners=False)
        x = self.head(x)
        return x


# Lazy-loaded model
_model = None
_device = None


def _get_device():
    global _device
    if _device is None:
        _device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    return _device


def _file_looks_like_pth(path):
    """Ensure we don't try to load HTML (e.g. Drive error page) as a checkpoint."""
    if not os.path.isfile(path) or os.path.getsize(path) < 100:
        return False
    with open(path, "rb") as f:
        first = f.read(20)
    return not first.lstrip().startswith(b"<")


def load_sprout_model(model_path):
    """Load .pth state dict into HeatmapKeypointNet."""
    global _model
    if not _file_looks_like_pth(model_path):
        raise ValueError(
            f"The file {model_path} does not look like a PyTorch checkpoint (it may be an HTML page from Google Drive). "
            "Delete that file and restart the backend to trigger a fresh download using gdown."
        )
    device = _get_device()
    model = HeatmapKeypointNet(num_keypoints=NUM_KEYPOINTS).to(device)
    # weights_only=False: checkpoint was saved from Colab (trusted); PyTorch 2.6+ defaults to True and fails on these pickles
    state = torch.load(model_path, map_location=device, weights_only=False)
    model.load_state_dict(state, strict=True)
    model.eval()
    _model = model
    return model


def ensure_sprout_model_loaded(model_path):
    global _model
    if _model is None:
        if not os.path.isfile(model_path):
            raise FileNotFoundError(f"Sprout PyTorch model not found: {model_path}")
        load_sprout_model(model_path)


def predict_points_from_image_tensor(image_tensor, model, device):
    """image_tensor: [3, 256, 256] float [0,1]. Returns (base_xy, tip_xy) in INPUT_SIZE coords."""
    model.eval()
    with torch.no_grad():
        pred_heatmaps = model(image_tensor.unsqueeze(0).to(device))[0].cpu().numpy()
    pr_base = heatmap_to_point(pred_heatmaps[0])
    pr_tip = heatmap_to_point(pred_heatmaps[1])
    scale = INPUT_SIZE / HEATMAP_SIZE
    base_xy = (pr_base[0] * scale, pr_base[1] * scale)
    tip_xy = (pr_tip[0] * scale, pr_tip[1] * scale)
    return base_xy, tip_xy


def predict_sprout_length_from_image(img_bgr, model_path, preprocess_crop_resize_256):
    """
    img_bgr: BGR image (e.g. from cv2.imread).
    preprocess_crop_resize_256: function that takes BGR image and returns RGB numpy (256,256,3) [0,255].
    Returns dict: { "label": "short", "confidence": float, "top3": [...] } to match Keras output shape.
    """
    ensure_sprout_model_loaded(model_path)
    device = _get_device()

    # Match Colab: crop potato, resize to 256, RGB, normalize to [0,1], CHW
    img_rgb = preprocess_crop_resize_256(img_bgr)
    if img_rgb is None or img_rgb.size == 0:
        return {
            "label": "unknown",
            "confidence": 0.0,
            "top3": [{"label": "unknown", "probability": 0.0}],
        }
    # [0,255] -> [0,1], HWC -> CHW
    x = np.transpose(img_rgb.astype(np.float32) / 255.0, (2, 0, 1))
    image_tensor = torch.tensor(x, dtype=torch.float32).unsqueeze(0)

    base_xy, tip_xy = predict_points_from_image_tensor(image_tensor[0], _model, device)
    sprout_length_px = euclidean_distance(base_xy, tip_xy)
    # At inference we have no bbox; use crop width = INPUT_SIZE as reference (crop is 256x256)
    potato_width_px = float(INPUT_SIZE)
    sprout_ratio = sprout_length_px / max(potato_width_px, 1e-6)
    label = classify_sprout_ratio(sprout_ratio)

    # No probabilistic output from keypoint model; use fixed confidence for API compatibility
    confidence = 0.95
    all_labels = ["none", "short", "medium", "long"]
    top3 = [
        {"label": label, "probability": confidence},
        *[{"label": l, "probability": 0.02} for l in all_labels if l != label][:2],
    ]
    return {
        "label": label,
        "confidence": confidence,
        "top3": top3[:3],
        "base_xy": [round(base_xy[0], 2), round(base_xy[1], 2)],
        "tip_xy": [round(tip_xy[0], 2), round(tip_xy[1], 2)],
    }
