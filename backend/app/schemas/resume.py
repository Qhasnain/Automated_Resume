from pydantic import BaseModel
from typing import Optional, List, Any
from datetime import datetime

# --- Personal Details ---
class PersonalDetailsCreate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None
    portfolio: Optional[str] = None
    location: Optional[str] = None
    photo_url: Optional[str] = None

class PersonalDetailsResponse(PersonalDetailsCreate):
    id: str
    resume_id: str
    class Config:
        from_attributes = True

# --- Education ---
class EducationCreate(BaseModel):
    institution: Optional[str] = None
    degree: Optional[str] = None
    field_of_study: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    gpa: Optional[str] = None
    description: Optional[str] = None
    order_index: int = 0

class EducationResponse(EducationCreate):
    id: str
    resume_id: str
    class Config:
        from_attributes = True

# --- Experience ---
class ExperienceCreate(BaseModel):
    company: Optional[str] = None
    position: Optional[str] = None
    location: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    is_current: bool = False
    description: Optional[str] = None
    bullets: Optional[List[str]] = None
    order_index: int = 0

class ExperienceResponse(ExperienceCreate):
    id: str
    resume_id: str
    class Config:
        from_attributes = True

# --- Project ---
class ProjectCreate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    tech_stack: Optional[List[str]] = None
    github_link: Optional[str] = None
    live_demo: Optional[str] = None
    order_index: int = 0

class ProjectResponse(ProjectCreate):
    id: str
    resume_id: str
    class Config:
        from_attributes = True

# --- Skill ---
class SkillCreate(BaseModel):
    category: Optional[str] = None
    name: Optional[str] = None
    proficiency_level: int = 3

class SkillResponse(SkillCreate):
    id: str
    resume_id: str
    class Config:
        from_attributes = True

# --- Achievement ---
class AchievementCreate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    date: Optional[str] = None
    order_index: int = 0

class AchievementResponse(AchievementCreate):
    id: str
    resume_id: str
    class Config:
        from_attributes = True

# --- Certificate ---
class CertificateCreate(BaseModel):
    name: Optional[str] = None
    issuer: Optional[str] = None
    date: Optional[str] = None
    url: Optional[str] = None
    order_index: int = 0

class CertificateResponse(CertificateCreate):
    id: str
    resume_id: str
    class Config:
        from_attributes = True

# --- Language ---
class LanguageCreate(BaseModel):
    name: Optional[str] = None
    proficiency: Optional[str] = None

class LanguageResponse(LanguageCreate):
    id: str
    resume_id: str
    class Config:
        from_attributes = True

# --- Resume ---
class ResumeCreate(BaseModel):
    title: Optional[str] = "Untitled Resume"
    target_job_title: Optional[str] = None
    target_company: Optional[str] = None
    experience_level: Optional[str] = None
    industry: Optional[str] = None
    resume_style: Optional[str] = None

class ResumeUpdate(BaseModel):
    title: Optional[str] = None
    target_job_title: Optional[str] = None
    target_company: Optional[str] = None
    experience_level: Optional[str] = None
    industry: Optional[str] = None
    resume_style: Optional[str] = None
    status: Optional[str] = None

class ResumeResponse(BaseModel):
    id: str
    user_id: str
    title: Optional[str] = None
    target_job_title: Optional[str] = None
    target_company: Optional[str] = None
    experience_level: Optional[str] = None
    industry: Optional[str] = None
    resume_style: Optional[str] = None
    status: str = "draft"
    ats_score: Optional[int] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    class Config:
        from_attributes = True

class ResumeFullResponse(ResumeResponse):
    personal_details: Optional[PersonalDetailsResponse] = None
    educations: List[EducationResponse] = []
    experiences: List[ExperienceResponse] = []
    projects: List[ProjectResponse] = []
    skills: List[SkillResponse] = []
    achievements: List[AchievementResponse] = []
    certificates: List[CertificateResponse] = []
    languages: List[LanguageResponse] = []
    class Config:
        from_attributes = True

# --- ATS Report ---
class ATSReportResponse(BaseModel):
    id: str
    resume_id: str
    overall_score: int
    keyword_score: int
    formatting_score: int
    readability_score: int
    suggestions: Optional[Any] = None
    created_at: Optional[datetime] = None
    class Config:
        from_attributes = True

# --- Job Match ---
class JobMatchRequest(BaseModel):
    job_description: str

class JobMatchResponse(BaseModel):
    id: str
    resume_id: str
    match_percentage: int
    missing_skills: Optional[Any] = None
    missing_keywords: Optional[Any] = None
    suggestions: Optional[Any] = None
    created_at: Optional[datetime] = None
    class Config:
        from_attributes = True

# --- Cover Letter ---
class CoverLetterRequest(BaseModel):
    job_title: Optional[str] = None
    company: Optional[str] = None

class CoverLetterResponse(BaseModel):
    id: str
    resume_id: str
    content: str
    job_title: Optional[str] = None
    company: Optional[str] = None
    created_at: Optional[datetime] = None
    class Config:
        from_attributes = True

# --- AI ---
class GenerateSummaryRequest(BaseModel):
    resume_id: str

class GenerateSummaryResponse(BaseModel):
    summary: str

class OptimizeBulletsRequest(BaseModel):
    bullets: List[str]
    job_title: Optional[str] = None

class OptimizeBulletsResponse(BaseModel):
    optimized_bullets: List[str]

class LinkedInRequest(BaseModel):
    resume_id: str

class LinkedInResponse(BaseModel):
    headline: str
    about: str

# --- Dashboard ---
class DashboardStats(BaseModel):
    total_resumes: int
    avg_ats_score: Optional[int] = None
    user_tier: str


class AIAssistRequest(BaseModel):
    text: str
    action_type: str
    job_description: Optional[str] = None

class AIAssistResponse(BaseModel):
    result: str
