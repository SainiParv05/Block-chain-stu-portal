from fastapi import APIRouter
from services.awareness import awareness_scan

router = APIRouter(prefix="/awareness")

@router.post("/scan")
def scan(data: dict):
    return awareness_scan(data["text"])
