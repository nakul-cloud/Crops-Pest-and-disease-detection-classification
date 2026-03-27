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


# Leaf Segmentation
def segment_leaf(image):
    """
    Segments the leaf region using HSV color space.
    Removes background by detecting green colors using morphological operations.
    
    Parameters:
    image: BGR image (numpy array)
    
    Returns:
    Segmented image with background removed, or original if segmentation fails
    """
    try:
        # Convert BGR to HSV color space
        hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
        
        # Define green color range in HSV
        lower_green = np.array([25, 40, 40])
        upper_green = np.array([90, 255, 255])
        
        # Create mask for green regions
        mask = cv2.inRange(hsv, lower_green, upper_green)
        
        # Optional improvement: Skip segmentation if mask is too small
        if np.sum(mask) < 1000:
            return image
        
        # Apply morphological closing to clean noise and fill gaps
        kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
        mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel)
        
        # Apply mask to original image using bitwise AND
        segmented = cv2.bitwise_and(image, image, mask=mask)
        
        return segmented
    
    except Exception as e:
        # Fallback: return original image if segmentation fails
        print(f"Leaf segmentation failed: {e}")
        return image


# FINAL PIPELINE
def process_drone_image(image_path):
    img = cv2.imread(image_path)

    img = upscale(img)
    img = denoise(img)
    img = apply_clahe(img)
    img = sharpen(img)
    img = segment_leaf(img)
    img = extract_roi(img)

    return img