# backend/utils/preprocess.py
import cv2
import numpy as np

IMG_SIZE = (224, 224)

def crop_potato(img_bgr):
    if img_bgr is None:
        return img_bgr

    h, w = img_bgr.shape[:2]
    gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)
    gray = cv2.GaussianBlur(gray, (5, 5), 0)

    # ✅ MATCH COLAB: adaptiveThreshold + BINARY_INV
    th = cv2.adaptiveThreshold(
        gray, 255,
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY_INV,
        51, 2
    )

    # ✅ MATCH COLAB: morphology close
    kernel = np.ones((5, 5), np.uint8)
    th = cv2.morphologyEx(th, cv2.MORPH_CLOSE, kernel, iterations=2)

    contours, _ = cv2.findContours(th, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    if not contours:
        return img_bgr

    c = max(contours, key=cv2.contourArea)
    x, y, wc, hc = cv2.boundingRect(c)

    # ✅ MATCH COLAB: ignore tiny crops
    if wc * hc < 0.05 * h * w:
        return img_bgr

    # ✅ MATCH COLAB: 0.2 padding
    pad = int(0.2 * max(wc, hc))

    return img_bgr[
        max(0, y - pad): min(h, y + hc + pad),
        max(0, x - pad): min(w, x + wc + pad)
    ]


def to_square_resize(img_bgr):
    crop = crop_potato(img_bgr)
    h, w = crop.shape[:2]
    side = max(h, w)

    padded = cv2.copyMakeBorder(
        crop,
        (side - h) // 2, (side - h + 1) // 2,
        (side - w) // 2, (side - w + 1) // 2,
        cv2.BORDER_CONSTANT,
        value=(255, 255, 255)
    )

    out = cv2.resize(padded, IMG_SIZE)
    return out


# For PyTorch sprout keypoint model: 256x256 RGB
SPROUT_INPUT_SIZE = (256, 256)


def to_square_resize_256_rgb(img_bgr):
    """Crop potato, pad to square, resize to 256x256, return RGB (H,W,3) uint8."""
    crop = crop_potato(img_bgr)
    if crop is None or crop.size == 0:
        return None
    h, w = crop.shape[:2]
    side = max(h, w)
    padded = cv2.copyMakeBorder(
        crop,
        (side - h) // 2, (side - h + 1) // 2,
        (side - w) // 2, (side - w + 1) // 2,
        cv2.BORDER_CONSTANT,
        value=(255, 255, 255),
    )
    out = cv2.resize(padded, SPROUT_INPUT_SIZE)
    return cv2.cvtColor(out, cv2.COLOR_BGR2RGB)