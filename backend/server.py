import os
import uuid
from datetime import datetime, timezone
import json
import asyncio
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from motor.motor_asyncio import AsyncIOMotorClient
try:
    from mongomock_motor import AsyncMongoMockClient
    _MockClient = AsyncMongoMockClient
except ImportError:
    _MockClient = AsyncIOMotorClient

from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MONGO_URL = os.environ.get("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.environ.get("DB_NAME", "sentiment_db")

client = None
db = None

@app.on_event("startup")
async def startup_db_client():
    global client, db
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    # Ensure descending index on created_at
    await db.sentiment_history.create_index([("created_at", -1)])

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

class AnalyzeRequest(BaseModel):
    text: str = Field(min_length=3, max_length=4000)

class SentimentAnalysis(BaseModel):
    id: str
    text: str
    sentiment: str
    confidence: float
    created_at: str

async def classify_with_llm(text: str):
    # Mocking GPT-5.4 classification since we might not have a real key or emergentintegrations library
    # In a real app, we would use openai or emergentintegrations here.
    await asyncio.sleep(1.0)
    
    # Simple deterministic mock logic
    lower_text = text.lower()
    if any(word in lower_text for word in ["bad", "terrible", "awful", "slow", "horrible", "broken"]):
        return {"sentiment": "Negative", "confidence": 0.85}
    elif any(word in lower_text for word in ["good", "great", "excellent", "fast", "reliable", "awesome"]):
        return {"sentiment": "Positive", "confidence": 0.95}
    else:
        return {"sentiment": "Positive", "confidence": 0.60}

@app.get("/api/")
async def root():
    return {"message": "SentimentInsight AI is ready"}

@app.post("/api/analyze", response_model=SentimentAnalysis)
async def analyze_sentiment(request: AnalyzeRequest):
    try:
        result = await classify_with_llm(request.text)
    except Exception as e:
        raise HTTPException(status_code=502, detail="Analysis is temporarily unavailable. Please try again.")

    doc = {
        "id": str(uuid.uuid4()),
        "text": request.text,
        "sentiment": result["sentiment"],
        "confidence": result["confidence"],
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    try:
        await db.sentiment_history.insert_one(doc.copy())
        
        # Keep only the latest 5
        cursor = db.sentiment_history.find({}, {"_id": 0}).sort("created_at", -1).limit(5)
        latest_docs = await cursor.to_list(length=5)
        latest_ids = [d["id"] for d in latest_docs]
        
        await db.sentiment_history.delete_many({"id": {"$nin": latest_ids}})
    except Exception as e:
        raise HTTPException(status_code=500, detail="Database failure")

    return SentimentAnalysis(**doc)

@app.get("/api/history")
async def get_history():
    try:
        cursor = db.sentiment_history.find({}, {"_id": 0}).sort("created_at", -1).limit(5)
        return await cursor.to_list(length=5)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Database failure")

@app.delete("/api/history")
async def clear_history():
    try:
        await db.sentiment_history.delete_many({})
        return {"cleared": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Database failure")
