from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import crypto, transform, safety, awareness, repository

app = FastAPI(title="AI Safety Hackathon Project")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(crypto.router)
app.include_router(transform.router)
app.include_router(safety.router)
app.include_router(awareness.router)
app.include_router(repository.router)

@app.get("/")
def home():
    return {"message": "Backend running successfully!"}
