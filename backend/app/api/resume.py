from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.models.user import User
from app.models.resume import (
    Resume, PersonalDetails, Education, Experience, Project,
    Skill, Achievement, Certificate, Language
)
from app.schemas.resume import (
    ResumeCreate, ResumeUpdate, ResumeResponse, ResumeFullResponse,
    PersonalDetailsCreate, PersonalDetailsResponse,
    EducationCreate, EducationResponse,
    ExperienceCreate, ExperienceResponse,
    ProjectCreate, ProjectResponse,
    SkillCreate, SkillResponse,
    AchievementCreate, AchievementResponse,
    CertificateCreate, CertificateResponse,
    LanguageCreate, LanguageResponse,
)
from app.core.security import get_current_user

router = APIRouter(prefix="/api/resumes", tags=["resumes"])

def _get_resume_or_404(resume_id: str, user: User, db: Session) -> Resume:
    resume = db.query(Resume).filter(Resume.id == resume_id, Resume.user_id == user.id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    return resume

@router.post("", response_model=ResumeResponse)
def create_resume(data: ResumeCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    resume = Resume(user_id=user.id, **data.model_dump())
    db.add(resume)
    db.commit()
    db.refresh(resume)
    return resume

@router.get("", response_model=List[ResumeResponse])
def list_resumes(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return db.query(Resume).filter(Resume.user_id == user.id).order_by(Resume.created_at.desc()).all()

@router.get("/{resume_id}", response_model=ResumeFullResponse)
def get_resume(resume_id: str, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return _get_resume_or_404(resume_id, user, db)

@router.put("/{resume_id}", response_model=ResumeResponse)
def update_resume(resume_id: str, data: ResumeUpdate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    resume = _get_resume_or_404(resume_id, user, db)
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(resume, key, value)
    db.commit()
    db.refresh(resume)
    return resume

@router.delete("/{resume_id}")
def delete_resume(resume_id: str, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    resume = _get_resume_or_404(resume_id, user, db)
    db.delete(resume)
    db.commit()
    return {"detail": "Resume deleted"}

# --- Personal Details ---
@router.put("/{resume_id}/personal", response_model=PersonalDetailsResponse)
def update_personal(resume_id: str, data: PersonalDetailsCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    resume = _get_resume_or_404(resume_id, user, db)
    pd = db.query(PersonalDetails).filter(PersonalDetails.resume_id == resume_id).first()
    if pd:
        for key, value in data.model_dump().items():
            setattr(pd, key, value)
    else:
        pd = PersonalDetails(resume_id=resume_id, **data.model_dump())
        db.add(pd)
    db.commit()
    db.refresh(pd)
    return pd

# --- Bulk Replace Helpers ---
def _bulk_replace(db: Session, model_class, resume_id: str, items_data: list, schema_class):
    db.query(model_class).filter(model_class.resume_id == resume_id).delete()
    new_items = []
    for i, item_data in enumerate(items_data):
        d = item_data.model_dump()
        d['order_index'] = d.get('order_index', i)
        obj = model_class(resume_id=resume_id, **d)
        db.add(obj)
        new_items.append(obj)
    db.commit()
    for item in new_items:
        db.refresh(item)
    return new_items

# --- Education ---
@router.put("/{resume_id}/education", response_model=List[EducationResponse])
def update_education(resume_id: str, data: List[EducationCreate], db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    _get_resume_or_404(resume_id, user, db)
    return _bulk_replace(db, Education, resume_id, data, EducationResponse)

# --- Experience ---
@router.put("/{resume_id}/experience", response_model=List[ExperienceResponse])
def update_experience(resume_id: str, data: List[ExperienceCreate], db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    _get_resume_or_404(resume_id, user, db)
    return _bulk_replace(db, Experience, resume_id, data, ExperienceResponse)

# --- Projects ---
@router.put("/{resume_id}/projects", response_model=List[ProjectResponse])
def update_projects(resume_id: str, data: List[ProjectCreate], db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    _get_resume_or_404(resume_id, user, db)
    return _bulk_replace(db, Project, resume_id, data, ProjectResponse)

# --- Skills ---
@router.put("/{resume_id}/skills", response_model=List[SkillResponse])
def update_skills(resume_id: str, data: List[SkillCreate], db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    _get_resume_or_404(resume_id, user, db)
    db.query(Skill).filter(Skill.resume_id == resume_id).delete()
    new_items = []
    for item_data in data:
        obj = Skill(resume_id=resume_id, **item_data.model_dump())
        db.add(obj)
        new_items.append(obj)
    db.commit()
    for item in new_items:
        db.refresh(item)
    return new_items

# --- Certificates ---
@router.put("/{resume_id}/certificates", response_model=List[CertificateResponse])
def update_certificates(resume_id: str, data: List[CertificateCreate], db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    _get_resume_or_404(resume_id, user, db)
    return _bulk_replace(db, Certificate, resume_id, data, CertificateResponse)

# --- Achievements ---
@router.put("/{resume_id}/achievements", response_model=List[AchievementResponse])
def update_achievements(resume_id: str, data: List[AchievementCreate], db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    _get_resume_or_404(resume_id, user, db)
    return _bulk_replace(db, Achievement, resume_id, data, AchievementResponse)

# --- Languages ---
@router.put("/{resume_id}/languages", response_model=List[LanguageResponse])
def update_languages(resume_id: str, data: List[LanguageCreate], db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    _get_resume_or_404(resume_id, user, db)
    db.query(Language).filter(Language.resume_id == resume_id).delete()
    new_items = []
    for item_data in data:
        obj = Language(resume_id=resume_id, **item_data.model_dump())
        db.add(obj)
        new_items.append(obj)
    db.commit()
    for item in new_items:
        db.refresh(item)
    return new_items
