# backend/utils/preprocess.py
import numpy as np
import cv2

IMG_SIZE = (224, 224)

def crop_largest_object(img_bgr):
    if img_bgr is None:
        return img_bgr

    gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)
    blur = cv2.GaussianBlur(gray, (5, 5), 0)
    _, th = cv2.threshold(blur, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

    contours, _ = cv2.findContours(th, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    if not contours:
        return img_bgr

    # find largest contour by area
    largest = max(contours, key=cv2.contourArea)
    x, y, w, h = cv2.boundingRect(largest)

    # add small padding
    pad = int(0.03 * max(w, h))
    x1 = max(0, x - pad)
    y1 = max(0, y - pad)
    x2 = min(img_bgr.shape[1], x + w + pad)
    y2 = min(img_bgr.shape[0], y + h + pad)

    return img_bgr[y1:y2, x1:x2]


def to_square_resize(img_bgr):
    crop = crop_largest_object(img_bgr)
    h, w = crop.shape[:2]
    side = max(h, w)

    top = (side - h)//2
    bottom = side - h - top
    left = (side - w)//2
    right = side - w - left

    sq = cv2.copyMakeBorder(crop, top, bottom, left, right, cv2.BORDER_CONSTANT, value=(255, 255, 255))
    out = cv2.resize(sq, IMG_SIZE, interpolation=cv2.INTER_AREA)
    return out
