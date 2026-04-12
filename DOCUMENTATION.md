# 🚀 CropAI – Project Workflow (Detailed Documentation)

## 🔷 1. Problem Definition
Farmers face difficulty in:
- Identifying crop diseases
- Detecting pests early
- Taking timely preventive action

**Manual inspection:**
- Time-consuming
- Requires expert knowledge

**Goal:**
👉 Build an AI-powered system to automate:
- Pest Detection
- Disease Detection
- Crop Classification
- Basic AI-based recommendations

---

## 🔷 2. System Overview
The system consists of 4 main modules:
1. **Image Preprocessing Pipeline**
2. **Detection Models** (YOLO)
3. **Classification Model** (CNN - AlexNet)
4. **AI Assistant** (LLM-based insights)

---

## 🔷 3. End-to-End Workflow

```text
User Upload Image
        ↓
Image Preprocessing
        ↓
[Option 1] Pest Detection (YOLO)
[Option 2] Disease Detection (YOLO)
[Option 3] Classification (CNN)
[Option 4] Full Pipeline
        ↓
Model Output (Bounding Boxes / Class Label)
        ↓
AI Assistant (Insights + Recommendations)
        ↓
Frontend Dashboard Display
```

---

## 🔷 4. Image Preprocessing Pipeline
*(Implemented in `image_processing.py` prior to model inference)*

### ✅ 4.1 Upscaling
- Improves image resolution
- Helps models detect small objects (pests)

### ✅ 4.2 Denoising
- **Method**: `cv2.fastNlMeansDenoisingColored`
- Removes noise while preserving important visual details

### ✅ 4.3 CLAHE (Contrast Enhancement)
- Improves visibility of leaf texture & disease spots
- Applied on the **LAB** color space

### ✅ 4.4 Sharpening
- Kernel-based sharpening filter
- Enhances edges and patterns

### ✅ 4.5 ROI Extraction
Uses:
- Grayscale conversion
- Canny edge detection
- Contour detection
- Extracts the most important region (the leaf area itself)

👉 **Output**: A clean, enhanced image ready for model input

---

## 🔷 5. Pest Detection Module
- **Model**: YOLO (You Only Look Once)
- **Task**: Detect pests in the image alongside drawing bounding boxes
- **Input**: Preprocessed image
- **Output**: Bounding box, Class label (e.g., Aphids, Moths), Confidence score
- **Key Parameters**: Confidence Threshold, IoU Threshold, Max Detections

## 🔷 6. Disease Detection Module
- **Model**: YOLO (separate trained model)
- **Task**: Detect disease regions directly on the leaves
- **Output**: Diseased region localization, Disease label (e.g., Blight, Leaf Spot)

## 🔷 7. Crop Classification Module
- **Model**: CNN (AlexNet)
- **Compared with**: ResNet, MobileNet
- **Result**: 👉 *AlexNet performed best during validation.*
- **Input**: Preprocessed image
- **Output**: Crop/Disease general class, Confidence scores

## 🔷 8. AI Assistant Module
- **Uses**: LLM (Groq API, `openai/gpt-oss-120b`)
- **Input**: Detection results, Classification output
- **Output**:
```json
{
  "summary": "...",
  "severity": "...",
  "recommendation": "..."
}
```
- **Current State**: Basic rule + prompt-based insights.
- **Future Goal**: Fine-tune a domain-specific assistant for pest control suggestions, disease treatment guidance, and farmer-friendly recommendations.

---

## 🔷 9. Frontend Workflow
- **Built using**: React (Vite)
- **Features**:
  - Image Upload Drag & Drop Interface
  - Selectable Mode (Pest Detection, Disease Detection, Classification, Full Pipeline)
- **Display**: Dynamically overlaid bounding boxes, confidence score progress bars, class distribution, and the compiled AI insights card.

## 🔷 10. Backend Workflow
- **Built using**: FastAPI
- **Responsibilities**:
  - Receive the image multipart payload from the frontend.
  - Apply preprocessing pipeline steps.
  - Call the appropriate active ML model.
  - Collate output.
- **Return**: JSON payload encompassing predictions, extracted metrics, and LLM-parsed AI insights.

---

## 🔷 11. Evaluation & Metrics
- **Detection Metrics**: mAP@50, mAP@50-95, Precision, Recall
- **Classification Metrics**: Accuracy, Precision, Recall, F1-score, Confusion Matrix

## 🔷 12. Key Observations
- **Classification**: 👉 High accuracy (~82.9%)
- **Detection**: 👉 Moderate performance. Needs more diverse data and parameter tuning.
- **Major Issue**: ❗ Generalization problem. The models occasionally struggle on real-world/unseen images that differ significantly from the training distribution.

## 🔷 13. Limitations
- Limited dataset diversity.
- Lack of aerial/UAV images for wide-area analysis.
- Detection model underfitting in some outlier cases.
- The AI assistant is generally basic and not specifically domain-trained on deep agricultural literature.

## 🔷 14. Future Enhancements
- Add Segmentation (Mask-based precise detection).
- Improve the dataset (collect real-world + UAV aerial images).
- Optimize YOLO models for edge inference.
- Build a domain-specific AI assistant.
- Deploy actively on mobile / edge devices.

## 🔷 15. Conclusion
CropAI demonstrates a complete AI pipeline ranging from image preprocessing and model training to high-speed API inference and frontend dashboard deployment. It provides an exceptionally strong foundation for real-world smart agriculture systems going forward.
