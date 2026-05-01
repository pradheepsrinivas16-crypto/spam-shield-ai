from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import os

app = FastAPI()

# 1. THE CONNECTION (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. LOAD THE BRAIN (Corrected Paths)
# We use 'backend/' because that is where the files are now
# In backend/main.py
vectorizer = joblib.load('backend/vectorizer.pkl')
model = joblib.load('backend/model.pkl')
class SMS(BaseModel):
    text: str

@app.post("/analyze")
def analyze_sms(sms: SMS):
    # Perform math prediction
    matrix = vectorizer.transform([sms.text])
    prediction = model.predict(matrix)[0]
    
    # Logic to explain WHY
    reasons = []
    text_lower = sms.text.lower()
    
    if "click" in text_lower or "http" in text_lower or ".com" in text_lower:
        reasons.append("Suspicious Link Detected")
    if "winner" in text_lower or "prize" in text_lower or "won" in text_lower:
        reasons.append("Lottery/Scam Keywords")
    if "urgent" in text_lower or "action required" in text_lower:
        reasons.append("High Urgency Pressure")
    if "$" in text_lower or "cash" in text_lower:
        reasons.append("Unverified Financial Offer")

    # Final Decision
    if reasons or prediction == 'spam':
        label = "SPAM"
        explanation = " | ".join(reasons) if reasons else "Pattern matches typical spam behavior."
    else:
        label = "HAM"
        explanation = "This message appears safe."

    return {
        "result": label,
        "explanation": explanation
    }