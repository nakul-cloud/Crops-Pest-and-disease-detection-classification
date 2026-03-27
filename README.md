# CropAI: AI Agriculture Dashboard

CropAI is an advanced web-based dashboard and computer vision system for agricultural disease and pest detection. It integrates deep learning models with a modern React frontend and a FastAPI backend to provide real-time, actionable insights for crop health.

## Technologies Used
- **Frontend**: React, Vite, TailwindCSS, Recharts, Framer Motion
- **Backend**: FastAPI, Python
- **Machine Learning**: YOLOv8 (Pest & Disease Detection), AlexNet (Classification)
- **AI Insights**: Groq LLM API (`openai/gpt-oss-120b`) for natural language summarization and recommendations.

## Project Workflow
1. **Image Upload/Input**: The user uploads an image of a crop leaf via the dashboard interface.
2. **Analysis Pipeline**:
   - The FastAPI backend receives the image.
   - **Pest Detection**: `crop_pest_yolo` (YOLOv8) analyzes for pests.
   - **Disease Detection**: `crop_disease_yolo` (YOLOv8) analyzes for diseases.
   - **Classification**: An AlexNet model classifies the overall crop condition.
3. **AI Insights Generation**: The aggregate results from the pipeline are fed into the Groq LLM API. The LLM generates a structured JSON response containing a plain-English summary, a severity classification (e.g., High, Moderate, Early, Low), and actionable recommendations.
4. **Interactive Dashboard**: The frontend displays the analyzed image with bounding boxes, the LLM-generated insights, and an interactive ML analytics dashboard tracking model metrics (mAP, Precision, Recall, Box Loss).

## Parameter Settings
You can dynamically adjust the model's sensitivity in the **Settings** page of the dashboard. These settings apply immediately to the backend analysis pipeline:

### Pest & Disease YOLO Parameters
- **Confidence Threshold (`conf`)**: Ranges from `0.1` to `1.0`. Filters out weak detections. Higher values ensure only very confident bounding boxes are shown (default `0.5`).
- **IoU Threshold (`iou`)**: Intersection over Union, ranges from `0.1` to `1.0`. Used for Non-Maximum Suppression (NMS) to remove overlapping bounding boxes for the same object (default `0.45`).
- **Max Detections (`max_det`)**: Maximum number of objects the model is allowed to detect per image (default `3`).

## Running the Application

### 1. Backend Setup
Navigate to the root directory and ensure you have Python 3.8+ installed.
```bash
# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate   # On Windows

# Install dependencies
pip install -r requirements.txt

# Set your Groq API Key
set GROQ_API_KEY=your_api_key_here

# Run the FastAPI server
uvicorn backend.main:app --reload  # Or use app.py depending on your entry point
```

### 2. Frontend Setup
In a new terminal, while still in the root directory:
```bash
# Install dependencies
npm install

# Start the Vite development server
npm run dev
```

The frontend will generally be available at `http://localhost:5173` and the backend API at `http://localhost:8000`.

## ML Analytics
The dashboard includes an interactive "Model Analysis & Reports" page which dynamically loads real training metrics (`results.csv` and `training_curve.json`). This section visualizes `mAP50`, `Precision`, and `Box Loss` across epochs using custom, dual-axis composed charts.