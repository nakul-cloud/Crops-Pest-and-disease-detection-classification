# 🚀 CropAI – AI Agriculture Dashboard

CropAI is an advanced web-based dashboard and computer vision system designed for agricultural disease and pest detection. It serves as a comprehensive tool to automate manual crop inspection, helping farmers detect pests early and take timely preventive action.

## 🧠 Features
- **Pest Detection (YOLO)**: Detects pests with high accuracy.
- **Disease Detection (YOLO)**: Identifies diseased crop regions.
- **Crop Classification (AlexNet CNN)**: Classifies the crop type and overall health.
- **AI Assistant**: LLM-based (Groq API) system for generating actionable insights.
- **Interactive Dashboard**: Modern, responsive UI for analyzing results and tracking ML analytics.

## 📖 Complete Documentation
For an in-depth look into the architecture, preprocessing pipeline, model specifics, and future enhancements, please read our [Detailed Documentation & Workflow](DOCUMENTATION.md).

## 🚀 Running the Application

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
uvicorn backend.main:app --reload
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

## 📊 ML Analytics
The dashboard includes an interactive "Model Analysis & Reports" page which dynamically loads real training metrics. This section visually renders performance metrics like `mAP50`, `Precision`, and `Box Loss` across epochs using custom, dual-axis composed charts.