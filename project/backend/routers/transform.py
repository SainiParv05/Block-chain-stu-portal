from fastapi import APIRouter
from services.summarizer import summarize
from services.rephrase import rephrase_text

router = APIRouter(prefix="/transform")

@router.post("/summarize")
def summarize_text(data: dict):
    return {"summary": summarize(data["text"])}

@router.post("/rephrase")
def rephrase(data: dict):
    return {"rephrased": rephrase_text(data["text"])}
