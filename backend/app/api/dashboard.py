from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func as sql_func
from app.db.database import get_db
from app.models.user import User
from app.models.resume import Resume
from app.schemas.resume import DashboardStats, ResumeResponse
from app.core.security import get_current_user
from typing import List

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])

@router.get("/stats", response_model=DashboardStats)
def get_stats(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    total = db.query(Resume).filter(Resume.user_id == user.id).count()
    avg_score = db.query(sql_func.avg(Resume.ats_score)).filter(
        Resume.user_id == user.id, Resume.ats_score.isnot(None)
    ).scalar()
    
    return DashboardStats(
        total_resumes=total,
        avg_ats_score=int(avg_score) if avg_score else None,
        user_tier=user.tier.value if user.tier else "free",
    )

@router.get("/recent", response_model=List[ResumeResponse])
def get_recent(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return db.query(Resume).filter(Resume.user_id == user.id).order_by(Resume.created_at.desc()).limit(5).all()
