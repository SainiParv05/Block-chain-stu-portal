from fastapi import APIRouter
from services.logger import save_log, get_logs

router = APIRouter(prefix="/repo")

@router.post("/save")
def save(data: dict):
    save_log(data["text"], data["type"])
    return {"status": "saved"}

@router.get("/logs")
def logs():
    return get_logs()
