import tensorflow as tf
import numpy as np
from PIL import Image

model = tf.keras.models.load_model("models/alexnet_model.keras")

img = Image.open("test.jpg").resize((224, 224))
img = np.array(img) / 255.0
img = np.expand_dims(img, axis=0)

pred = model.predict(img)

print("Shape:", pred.shape)