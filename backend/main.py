import sys
import os

# To allow executing from the `backend` directory without modifying existing logic:
# 1. Change current working directory to the parent directory (CV_APP) so "models/" paths resolve correctly.
# 2. Add parent directory to sys.path so "from utils.XYZ import ..." works seamlessly.
parent_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
if os.getcwd() != parent_dir:
    os.chdir(parent_dir)
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

# Now we can safely import routes which internally import utils/
from backend.routes import detect, classify, pipeline, analytics, settings

app = FastAPI(title="CV App Backend API")

# Setup CORS with allow_origins=["*"] as requested
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root Endpoint
@app.get("/")
async def root():
    return {"message": "CV App Backend API Wrap logic is running."}

# Include routers
app.include_router(detect.router, prefix="/detect", tags=["Detect"])
app.include_router(classify.router, prefix="/classify", tags=["Classify"])
app.include_router(pipeline.router, prefix="/pipeline", tags=["Pipeline"])
app.include_router(analytics.router, prefix="/analytics", tags=["Analytics"])
app.include_router(settings.router, prefix="/settings", tags=["Settings"])

# Serve static files so the frontend can retrieve the images via HTTP
# Since os.chdir is to `parent_dir`, the base directory for StaticFiles is `.`
app.mount("/crop_pest_yolo", StaticFiles(directory="crop_pest_yolo"), name="crop_pest_yolo")
app.mount("/crop_disease_yolo", StaticFiles(directory="crop_disease_yolo"), name="crop_disease_yolo")
app.mount("/AlexNet_model", StaticFiles(directory="AlexNet_model"), name="AlexNet_model")
