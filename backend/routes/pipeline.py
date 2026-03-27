from fastapi import APIRouter, File, UploadFile, HTTPException
from utils.detection import detect_disease, crop_detections
from utils.classification import classify_image_basic
from PIL import Image
import numpy as np
import io

router = APIRouter()

@router.post("/")
@router.post("")
async def full_pipeline_api(image: UploadFile = File(...)):
    """
    Run pipeline:
    1. Disease detection
    2. Crop images
    3. Classification
    """
    try:
        contents = await image.read()
        pil_image = Image.open(io.BytesIO(contents)).convert("RGB")
        # detect_disease can take pil image, but crop_detections requires cv2/numpy image (y_min:y_max formatting)
        np_image = np.array(pil_image)
        # Note: np_image will be RGB here, while cv2 typically assumes BGR. However, crop is just array slicing.
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error reading image: {e}")
        
    try:
        # Detect disease
        results = detect_disease(pil_image)
        
        # Get cropped regions
        # result is a list of results, crop_detections expects result and image.
        crops = crop_detections(results, np_image)
        
        final_results = []
        
        boxes = results[0].boxes
        if boxes is not None:
            box_data = boxes.xyxy.cpu().numpy()
            for idx, crop_np in enumerate(crops):
                if crop_np.size == 0:
                    continue
                
                # Classify the cropped region
                # convert numpy array back to PIL Image for classify_image_basic
                crop_pil = Image.fromarray(crop_np)
                class_name, confidence = classify_image_basic(crop_pil)
                
                # Get associated detection metrics
                bndbox = box_data[idx].tolist()
                conf = float(boxes.conf[idx])
                cls_id = int(boxes.cls[idx])
                label = results[0].names[cls_id] if results[0].names else str(cls_id)
                
                final_results.append({
                    "detection": {
                        "box": bndbox,
                        "label": label,
                        "confidence": conf
                    },
                    "classification": {
                        "class": class_name,
                        "confidence": float(confidence)
                    }
                })
        
        # Aggregate detections and find overall classification
        detections_list = [res["detection"] for res in final_results]
        
        # Simple heuristic for overall classification: find the one with the highest confidence
        overall_classification = None
        if final_results:
            best_result = max(final_results, key=lambda r: r["classification"]["confidence"])
            overall_classification = best_result["classification"]
            
        # Generate insights ALWAYS (User requested: even if empty, errors, etc.)
        from utils.llm_insights import generate_insights
        
        # If overall_classification is None but we need to run insights
        safe_classification = overall_classification if overall_classification else {"class": "None detected", "confidence": 0.0}
        
        try:
            insights = generate_insights(detections_list, safe_classification)
        except Exception as e:
            print(f"[Pipeline] Error calling generate_insights: {e}")
            insights = {
                "summary": "Crop analysis completed",
                "severity": "Moderate",
                "recommendation": "Review detected issues and take preventive measures."
            }

        response_json = {
            "pipeline_results": final_results,
            "insights": insights
        }
        
        print("FINAL API RESPONSE:", response_json)
        
        return response_json
    except Exception as e:
        print(f"[Pipeline] Exception in router: {e}")
        raise HTTPException(status_code=500, detail=f"Error running pipeline: {e}")

