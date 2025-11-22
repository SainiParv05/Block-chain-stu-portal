from fastapi import APIRouter
from services.encrypt import encrypt_text, hash_text

router = APIRouter(prefix="/crypto")

@router.post("/encrypt")
def encrypt(data: dict):
    return {"encrypted": encrypt_text(data["text"])}

@router.post("/hash")
def hashing(data: dict):
    return {"hash": hash_text(data["text"])}
