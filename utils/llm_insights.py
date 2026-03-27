import os
import json
from groq import Groq

def generate_insights(detections, classification):
    """
    Generate AI insights based on detection and classification outputs.
    Returns:
    {
      "summary": "...",
      "severity": "...",
      "recommendation": "..."
    }
    """
    
    default_response = {
        "summary": "Crop analysis completed",
        "severity": "Moderate",
        "recommendation": "Review detected issues and take preventive measures."
    }

    # Configure the Groq API client
    api_key = os.environ.get("GROQ_API_KEY")
    if not api_key:
        print("[LLM Insights] WARNING: No GROQ_API_KEY found in environment.")
        return default_response
    
    try:
        client = Groq(api_key=api_key)
    except Exception as e:
        print(f"[LLM Insights] Error initializing Groq client: {e}")
        return default_response

    detections_text = json.dumps(detections, indent=2)
    classification_text = json.dumps(classification, indent=2)
    
    prompt = f"""
You are an expert agricultural AI assistant.

You are given results from a crop analysis system.

Detections (pests/diseases with confidence):
{detections_text}

Classification result:
{classification_text}

---

INSTRUCTIONS:

1. Carefully analyze BOTH detections and classification.
2. If pests/diseases are detected → mention them explicitly.
3. If classification indicates healthy → mention healthy condition.
4. Do NOT give generic responses like "Analysis Complete".
5. Use actual detected labels (e.g., aphid, leaf blight, etc.)
6. Severity must depend on:
   * number of detections
   * confidence values
7. Recommendation must be practical and specific.

---

OUTPUT FORMAT (STRICT JSON ONLY):

{{
"summary": "Specific issue detected (e.g., Aphid Infestation Detected on Leaves)",
"severity": "High | Moderate | Early | Low",
"recommendation": "Clear actionable steps based on detected issue"
}}

---

RULES:

* NO markdown
* NO explanation
* ONLY JSON
* NO generic phrases like "Analysis complete"
* MUST use actual labels from input

---

EXAMPLES:

If aphid detected:
summary: "Aphid Infestation Detected"
severity: "High"

If healthy:
summary: "Crop Appears Healthy"
severity: "Low"

"""

    
    print("Calling LLM insights...")
    try:
        response = client.chat.completions.create(
            model="openai/gpt-oss-120b",
            messages=[
                {"role": "user", "content": prompt}
            ],
            stream=False
        )
        
        # Parse the JSON
        output_text = response.choices[0].message.content.strip()
        print("LLM output:", output_text)
        
        # Robust JSON Extraction
        start_idx = output_text.find("{")
        end_idx = output_text.rfind("}")
        
        if start_idx != -1 and end_idx != -1 and end_idx > start_idx:
            json_str = output_text[start_idx:end_idx+1]
        else:
            json_str = output_text
            
        try:
            insights = json.loads(json_str)
            print("Parsed insights:", insights)
        except json.JSONDecodeError as e:
            print(f"[LLM Insights] JSON Parsing Error: {e} - Raw output: {output_text}")
            return default_response
        
        # Validate expected fields
        return {
            "summary": insights.get("summary", default_response["summary"]),
            "severity": insights.get("severity", default_response["severity"]),
            "recommendation": insights.get("recommendation", default_response["recommendation"])
        }
    except Exception as e:
        print(f"[LLM Insights] Error generating insights: {e}")
        return default_response