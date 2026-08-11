from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.database import engine, Base
from app.models import *  # Import all models so Base.metadata knows about them
from app.api.auth import router as auth_router
from app.api.resume import router as resume_router
from app.api.ai import router as ai_router
from app.api.dashboard import router as dashboard_router

app = FastAPI(
    title="ResumeForge AI",
    description="Premium multi-tenant AI Resume Engineering SaaS platform",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create all tables on startup
@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)

app.include_router(auth_router)
app.include_router(resume_router)
app.include_router(ai_router)
app.include_router(dashboard_router)

@app.get("/")
def health_check():
    return {"status": "ok", "message": "ResumeForge AI API is running"}
