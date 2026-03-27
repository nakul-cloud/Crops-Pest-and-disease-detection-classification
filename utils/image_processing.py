import cv2
import numpy as np

# CLAHE
def apply_clahe(image):
    lab = cv2.cvtColor(image, cv2.COLOR_BGR2LAB)
    l, a, b = cv2.split(lab)

    clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8, 8))
    l = clahe.apply(l)

    lab = cv2.merge((l, a, b))
    return cv2.cvtColor(lab, cv2.COLOR_LAB2BGR)


# Denoising
def denoise(image):
    return cv2.fastNlMeansDenoisingColored(image, None, 10, 10, 7, 21)


# Sharpen
def sharpen(image):
    kernel = np.array([[0, -1, 0],
                       [-1, 5,-1],
                       [0, -1, 0]])
    return cv2.filter2D(image, -1, kernel)


# ROI extraction
def extract_roi(image):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    edges = cv2.Canny(gray, 50, 150)

    contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    if len(contours) == 0:
        return image

    largest = max(contours, key=cv2.contourArea)
    x, y, w, h = cv2.boundingRect(largest)

    return image[y:y+h, x:x+w]


# Upscale
def upscale(image):
    return cv2.resize(image, None, fx=1.5, fy=1.5, interpolation=cv2.INTER_CUBIC)


# FINAL PIPELINE
def process_drone_image(image_path):
    img = cv2.imread(image_path)

    img = upscale(img)
    img = denoise(img)
    img = apply_clahe(img)
    img = sharpen(img)
    img = extract_roi(img)

    return img