from fastapi import APIRouter, File, UploadFile, HTTPException
from utils.detection import detect_pest, detect_disease
from PIL import Image
import io

router = APIRouter()

@router.post("/pest")
async def detect_pest_api(image: UploadFile = File(...)):
    """Run pest detection using YOLO (utils.detection.detect_pest)."""
    try:
        contents = await image.read()
        pil_image = Image.open(io.BytesIO(contents)).convert("RGB")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error reading image: {e}")
        
    try:
        results = detect_pest(pil_image)
        
        # Format the detections
        formatted_detections = []
        for result in results:
            boxes = result.boxes
            if boxes is not None:
                for box in boxes:
                    # bounding box data
                    bndbox = box.xyxy[0].tolist()
                    conf = float(box.conf[0])
                    cls_id = int(box.cls[0])
                    label = result.names[cls_id] if result.names else str(cls_id)
                    
                    formatted_detections.append({
                        "box": bndbox,
                        "label": label,
                        "confidence": conf
                    })
        return {"detections": formatted_detections}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error running pest detection: {e}")

@router.post("/disease")
async def detect_disease_api(image: UploadFile = File(...)):
    """Run disease detection using YOLO (utils.detection.detect_disease)."""
    try:
        contents = await image.read()
        pil_image = Image.open(io.BytesIO(contents)).convert("RGB")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error reading image: {e}")
        
    try:
        results = detect_disease(pil_image)
        
        # Format the detections
        formatted_detections = []
        for result in results:
            boxes = result.boxes
            if boxes is not None:
                for box in boxes:
                    # bounding box data
                    bndbox = box.xyxy[0].tolist()
                    conf = float(box.conf[0])
                    cls_id = int(box.cls[0])
                    label = result.names[cls_id] if result.names else str(cls_id)
                    
                    formatted_detections.append({
                        "box": bndbox,
                        "label": label,
                        "confidence": conf
                    })
        return {"detections": formatted_detections}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error running disease detection: {e}")
