from fastapi import APIRouter, File, UploadFile, HTTPException
from utils.classification import classify_image_basic
from PIL import Image
import io

router = APIRouter()

@router.post("/")
@router.post("")
async def classify_api(image: UploadFile = File(...)):
    """Run crop classification using AlexNet (utils.classification.classify_image_basic)."""
    try:
        contents = await image.read()
        pil_image = Image.open(io.BytesIO(contents)).convert("RGB")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error reading image: {e}")
        
    try:
        class_name, confidence = classify_image_basic(pil_image)
        return {
            "class": class_name,
            "confidence": float(confidence)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error running classification: {e}")
