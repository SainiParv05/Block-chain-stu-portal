from fastapi import APIRouter
from services.misinformation import check_misinformation

router = APIRouter(prefix="/safety")

@router.post("/misinformation")
def detect(data: dict):
    return check_misinformation(data["text"])
