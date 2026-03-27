import tensorflow as tf
import numpy as np
import cv2
from PIL import Image

from utils.image_processing import process_drone_image

# Load model
model = tf.keras.models.load_model("models/alexnet_model.keras")

IMG_SIZE = (224, 224)

# ✅ YOUR 22 CLASSES
class_names = [
    "Cashew anthracnose",
    "Cashew gummosis",
    "Cashew healthy",
    "Cashew leaf miner",
    "Cashew red rust",

    "Cassava bacterial blight",
    "Cassava brown spot",
    "Cassava green mite",
    "Cassava healthy",
    "Cassava mosaic",

    "Maize fall armyworm",
    "Maize grasshopper",
    "Maize healthy",
    "Maize leaf beetle",
    "Maize leaf blight",
    "Maize leaf spot",
    "Maize streak virus",

    "Tomato healthy",
    "Tomato leaf blight",
    "Tomato leaf curl",
    "Tomato septoria leaf spot",
    "Tomato verticillium wilt"
]


# 🔥 BASIC CLASSIFICATION
def classify_image_basic(image):
    img = image.resize(IMG_SIZE)
    img = np.array(img) / 255.0
    img = np.expand_dims(img, axis=0)

    pred = model.predict(img)

    class_id = np.argmax(pred)
    confidence = np.max(pred)

    if class_id >= len(class_names):
        return "Unknown", confidence

    return class_names[class_id], confidence


# 🚀 ADVANCED (DRONE)
def classify_image_advanced(image_path):
    processed = process_drone_image(image_path)

    img = cv2.cvtColor(processed, cv2.COLOR_BGR2RGB)
    img = Image.fromarray(img)

    img = img.resize(IMG_SIZE)
    img = np.array(img) / 255.0
    img = np.expand_dims(img, axis=0)

    pred = model.predict(img)

    print("DEBUG pred shape:", pred.shape)  # 👈 useful

    class_id = np.argmax(pred)
    confidence = np.max(pred)

    if class_id >= len(class_names):
        return "Unknown", confidence

    return class_names[class_id], confidence