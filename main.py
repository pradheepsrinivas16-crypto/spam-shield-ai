from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib

app = FastAPI()

# THIS IS THE CRITICAL "CONNECTION" PIECE
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, you'd put your website URL here
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

vectorizer = joblib.load('data/vectorizer.pkl')
model = joblib.load('data/model.pkl')

class SMS(BaseModel):
    text: str

@app.post("/analyze")
def analyze_sms(sms: SMS):
    # 1. Math Prediction
    matrix = vectorizer.transform([sms.text])
    prediction = model.predict(matrix)[0]
    
    # 2. Logic to explain WHY
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

    # 3. THE FIX: If we found a reason, force the label to SPAM
    if reasons or prediction == 1:
        label = "SPAM"
        explanation = " | ".join(reasons) if reasons else "Pattern matches typical spam behavior."
    else:
        label = "HAM"
        explanation = "This message appears safe."

    return {
        "result": label,
        "explanation": explanation
    }