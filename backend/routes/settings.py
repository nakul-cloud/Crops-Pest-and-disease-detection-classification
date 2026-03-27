from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from utils.detection import DETECTION_SETTINGS

router = APIRouter()

class DetectionParams(BaseModel):
    conf: float
    iou: float
    max_det: int

class SettingsPayload(BaseModel):
    pest: DetectionParams
    disease: DetectionParams

@router.get("/detection")
async def get_detection_settings():
    """Retrieve current detection thresholds."""
    return DETECTION_SETTINGS

@router.post("/detection")
async def update_detection_settings(payload: SettingsPayload):
    """Update detection thresholds for Pest and Disease models."""
    try:
        DETECTION_SETTINGS["pest"] = payload.pest.dict()
        DETECTION_SETTINGS["disease"] = payload.disease.dict()
        return {
            "status": "success",
            "message": "Detection parameters updated successfully",
            "settings": DETECTION_SETTINGS
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
