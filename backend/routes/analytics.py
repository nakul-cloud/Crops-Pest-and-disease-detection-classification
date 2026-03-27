import os
import csv
from fastapi import APIRouter

router = APIRouter()

CLASS_NAMES = [
    "Cashew anthracnose", "Cashew gumosis", "Cashew healthy",
    "Cashew leaf miner", "Cashew red rust",
    "Cassava bacterial blight", "Cassava brown spot",
    "Cassava green mite", "Cassava healthy", "Cassava mosaic",
    "Maize fall armyworm", "Maize grasshoper", "Maize healthy",
    "Maize leaf beetle", "Maize leaf blight", "Maize leaf spot",
    "Maize streak virus",
    "Tomato healthy", "Tomato leaf blight", "Tomato leaf curl",
    "Tomato septoria leaf spot", "Tomato verticulium wilt",
]
NUM_CLASSES = len(CLASS_NAMES)


def compute_confusion_matrix(path: str):
    """Build NxN confusion matrix from predictions.csv (true, pred columns)."""
    matrix = [[0] * NUM_CLASSES for _ in range(NUM_CLASSES)]
    try:
        with open(path, "r") as f:
            reader = csv.DictReader(f)
            for row in reader:
                t = int(row["true"])
                p = int(row["pred"])
                if 0 <= t < NUM_CLASSES and 0 <= p < NUM_CLASSES:
                    matrix[t][p] += 1
    except Exception:
        return None
    return matrix


def parse_results_csv(path: str):
    rows = []
    try:
        with open(path, "r") as f:
            reader = csv.DictReader(f)
            for row in reader:
                rows.append(row)
    except Exception:
        return None, None

    if not rows:
        return None, None

    last = {k.strip(): v.strip() for k, v in rows[-1].items()}
    summary = {
        "mAP50":     round(float(last.get("metrics/mAP50(B)", 0)), 4),
        "mAP50_95":  round(float(last.get("metrics/mAP50-95(B)", 0)), 4),
        "precision": round(float(last.get("metrics/precision(B)", 0)), 4),
        "recall":    round(float(last.get("metrics/recall(B)", 0)), 4),
        "epochs":    len(rows),
    }
    history = []
    for row in rows:
        r = {k.strip(): v.strip() for k, v in row.items()}
        history.append({
            "epoch":    int(r.get("epoch", 0)),
            "mAP50":   round(float(r.get("metrics/mAP50(B)", 0)), 4),
            "mAP50_95": round(float(r.get("metrics/mAP50-95(B)", 0)), 4),
            "precision": round(float(r.get("metrics/precision(B)", 0)), 4),
            "recall":  round(float(r.get("metrics/recall(B)", 0)), 4),
            "box_loss": round(float(r.get("train/box_loss", 0)), 4),
            "cls_loss": round(float(r.get("train/cls_loss", 0)), 4),
        })
    return summary, history


def parse_training_curve_json(path: str):
    import json
    try:
        with open(path, "r") as f:
            data = json.load(f)
    except Exception:
        return None, None
        
    if not data:
        return None, None
        
    last = data[-1]
    summary = {
        "mAP50":     round(float(last.get("map50", 0)), 4),
        "mAP50_95":  round(float(last.get("map5095", 0)), 4),
        "precision": round(float(last.get("precision", 0)), 4),
        "recall":    round(float(last.get("recall", 0)), 4),
        "epochs":    len(data),
    }
    
    history = []
    for row in data:
        history.append({
            "epoch":      int(row.get("epoch", 0)),
            "mAP50":      round(float(row.get("map50", 0)), 4),
            "mAP50_95":   round(float(row.get("map5095", 0)), 4),
            "precision":  round(float(row.get("precision", 0)), 4),
            "recall":     round(float(row.get("recall", 0)), 4),
            "box_loss":   round(float(row.get("box_loss", 0)), 4),
            "cls_loss":   0, # Still not provided, keep as 0
        })
        
    return summary, history


def parse_class_report(path: str):
    classes = []
    try:
        with open(path, "r") as f:
            lines = f.readlines()
        for line in lines:
            parts = line.split()
            if len(parts) >= 5:
                try:
                    precision = float(parts[-4])
                    recall    = float(parts[-3])
                    f1        = float(parts[-2])
                    support   = int(parts[-1])
                    label = " ".join(parts[:-4])
                    if label and label not in ("accuracy", "macro", "weighted"):
                        classes.append({
                            "class": label,
                            "precision": precision,
                            "recall": recall,
                            "f1": f1,
                            "support": support,
                        })
                except ValueError:
                    pass
    except Exception:
        pass
    return classes


@router.get("/")
@router.get("")
async def get_analytics():
    base_dir = os.getcwd()

    # Accuracy
    accuracy_val = "N/A"
    try:
        with open(os.path.join(base_dir, "AlexNet_model", "accuracy.txt"), "r") as f:
            raw = f.read().strip()
            accuracy_val = raw.split(":")[-1].strip()
    except Exception:
        pass

    # Classification report text + per-class
    report_text = ""
    try:
        with open(os.path.join(base_dir, "AlexNet_model", "classification_report.txt"), "r") as f:
            report_text = f.read()
    except Exception:
        pass

    class_metrics = parse_class_report(
        os.path.join(base_dir, "AlexNet_model", "classification_report.txt")
    )

    # Real confusion matrix from predictions.csv
    confusion_matrix = compute_confusion_matrix(
        os.path.join(base_dir, "AlexNet_model", "predictions.csv")
    )

    # Pest YOLO training data
    pest_summary, pest_history = parse_results_csv(
        os.path.join(base_dir, "crop_pest_yolo", "results.csv")
    )

    # Disease YOLO training data
    disease_summary, disease_history = parse_training_curve_json(
        os.path.join(base_dir, "crop_disease_yolo", "training_curve.json")
    )

    return {
        "pest": {
            "confusion_matrix_img": "/crop_pest_yolo/confusion_matrix.png",
            "pr_curve_img":         "/crop_pest_yolo/BoxPR_curve.png",
            "metrics":              pest_summary,
            "training_history":     pest_history,
        },
        "disease": {
            "confusion_matrix_img": "/crop_disease_yolo/confusion_matrix.png",
            "pr_curve_img":         "/crop_disease_yolo/BoxPR_curve.png",
            "metrics":              disease_summary,
            "training_history":     disease_history,
        },
        "classification": {
            "confusion_matrix_img": "/AlexNet_model/confusion_matrix.png",
            "confusion_matrix":     confusion_matrix,
            "class_names":          CLASS_NAMES,
            "report":               report_text,
            "accuracy":             accuracy_val,
            "class_metrics":        class_metrics,
        },
    }
