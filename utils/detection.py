from ultralytics import YOLO
import cv2

# Load models
pest_model = YOLO("models/pest_best.pt")
disease_model = YOLO("models/disease_best.pt")


# Global detection settings (can be updated via API)
DETECTION_SETTINGS = {
    "pest": {
        "conf": 0.5,
        "iou": 0.45,
        "max_det": 3
    },
    "disease": {
        "conf": 0.5,
        "iou": 0.45,
        "max_det": 3
    }
}


def detect_pest(image_path):
    settings = DETECTION_SETTINGS["pest"]
    return pest_model.predict(
        image_path,
        conf=settings["conf"],
        iou=settings["iou"],
        max_det=settings["max_det"]
    )


def detect_disease(image_path):
    settings = DETECTION_SETTINGS["disease"]
    return disease_model.predict(
        image_path,
        conf=settings["conf"],
        iou=settings["iou"],
        max_det=settings["max_det"]
    )


def draw_boxes(result):
    return result[0].plot()


# 🔥 NEW: crop detected regions
def crop_detections(result, image):
    boxes = result[0].boxes.xyxy.cpu().numpy()
    crops = []

    for box in boxes:
        x1, y1, x2, y2 = map(int, box)
        crop = image[y1:y2, x1:x2]
        crops.append(crop)

    return crops