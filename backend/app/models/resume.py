import uuid
import enum
from sqlalchemy import Column, String, Integer, Boolean, DateTime, ForeignKey, Text, JSON, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.database import Base

class ResumeStatus(str, enum.Enum):
    draft = "draft"
    completed = "completed"
    archived = "archived"

class Resume(Base):
    __tablename__ = "resumes"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"))
    title = Column(String)
    target_job_title = Column(String)
    target_company = Column(String)
    experience_level = Column(String)
    industry = Column(String)
    resume_style = Column(String)
    status = Column(Enum(ResumeStatus), default=ResumeStatus.draft)
    ats_score = Column(Integer, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", back_populates="resumes")
    versions = relationship("ResumeVersion", back_populates="resume", cascade="all, delete-orphan")
    personal_details = relationship("PersonalDetails", back_populates="resume", uselist=False, cascade="all, delete-orphan")
    educations = relationship("Education", back_populates="resume", cascade="all, delete-orphan")
    experiences = relationship("Experience", back_populates="resume", cascade="all, delete-orphan")
    projects = relationship("Project", back_populates="resume", cascade="all, delete-orphan")
    skills = relationship("Skill", back_populates="resume", cascade="all, delete-orphan")
    achievements = relationship("Achievement", back_populates="resume", cascade="all, delete-orphan")
    certificates = relationship("Certificate", back_populates="resume", cascade="all, delete-orphan")
    languages = relationship("Language", back_populates="resume", cascade="all, delete-orphan")
    ats_reports = relationship("ATSReport", back_populates="resume", cascade="all, delete-orphan")
    job_matches = relationship("JobMatch", back_populates="resume", cascade="all, delete-orphan")
    cover_letters = relationship("CoverLetter", back_populates="resume", cascade="all, delete-orphan")

class ResumeVersion(Base):
    __tablename__ = "resume_versions"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    resume_id = Column(String(36), ForeignKey("resumes.id"))
    version_number = Column(Integer)
    data = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    resume = relationship("Resume", back_populates="versions")

class PersonalDetails(Base):
    __tablename__ = "personal_details"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    resume_id = Column(String(36), ForeignKey("resumes.id"), unique=True)
    full_name = Column(String)
    email = Column(String)
    phone = Column(String)
    linkedin = Column(String)
    github = Column(String)
    portfolio = Column(String)
    location = Column(String)
    photo_url = Column(String)
    resume = relationship("Resume", back_populates="personal_details")

class Education(Base):
    __tablename__ = "educations"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    resume_id = Column(String(36), ForeignKey("resumes.id"))
    institution = Column(String)
    degree = Column(String)
    field_of_study = Column(String)
    start_date = Column(String)
    end_date = Column(String)
    gpa = Column(String)
    description = Column(Text)
    order_index = Column(Integer)
    resume = relationship("Resume", back_populates="educations")

class Experience(Base):
    __tablename__ = "experiences"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    resume_id = Column(String(36), ForeignKey("resumes.id"))
    company = Column(String)
    position = Column(String)
    location = Column(String)
    start_date = Column(String)
    end_date = Column(String)
    is_current = Column(Boolean)
    description = Column(Text)
    bullets = Column(JSON)
    order_index = Column(Integer)
    resume = relationship("Resume", back_populates="experiences")

class Project(Base):
    __tablename__ = "projects"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    resume_id = Column(String(36), ForeignKey("resumes.id"))
    name = Column(String)
    description = Column(Text)
    tech_stack = Column(JSON)
    github_link = Column(String)
    live_demo = Column(String)
    order_index = Column(Integer)
    resume = relationship("Resume", back_populates="projects")

class Skill(Base):
    __tablename__ = "skills"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    resume_id = Column(String(36), ForeignKey("resumes.id"))
    category = Column(String)
    name = Column(String)
    proficiency_level = Column(Integer)
    resume = relationship("Resume", back_populates="skills")

class Achievement(Base):
    __tablename__ = "achievements"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    resume_id = Column(String(36), ForeignKey("resumes.id"))
    title = Column(String)
    description = Column(Text)
    date = Column(String)
    order_index = Column(Integer)
    resume = relationship("Resume", back_populates="achievements")

class Certificate(Base):
    __tablename__ = "certificates"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    resume_id = Column(String(36), ForeignKey("resumes.id"))
    name = Column(String)
    issuer = Column(String)
    date = Column(String)
    url = Column(String)
    order_index = Column(Integer)
    resume = relationship("Resume", back_populates="certificates")

class Language(Base):
    __tablename__ = "languages"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    resume_id = Column(String(36), ForeignKey("resumes.id"))
    name = Column(String)
    proficiency = Column(String)
    resume = relationship("Resume", back_populates="languages")

class ATSReport(Base):
    __tablename__ = "ats_reports"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    resume_id = Column(String(36), ForeignKey("resumes.id"))
    overall_score = Column(Integer)
    keyword_score = Column(Integer)
    formatting_score = Column(Integer)
    readability_score = Column(Integer)
    suggestions = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    resume = relationship("Resume", back_populates="ats_reports")

class JobMatch(Base):
    __tablename__ = "job_matches"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    resume_id = Column(String(36), ForeignKey("resumes.id"))
    job_description = Column(Text)
    match_percentage = Column(Integer)
    missing_skills = Column(JSON)
    missing_keywords = Column(JSON)
    suggestions = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    resume = relationship("Resume", back_populates="job_matches")

class CoverLetter(Base):
    __tablename__ = "cover_letters"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    resume_id = Column(String(36), ForeignKey("resumes.id"))
    content = Column(Text)
    job_title = Column(String)
    company = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    resume = relationship("Resume", back_populates="cover_letters")

class Notification(Base):
    __tablename__ = "notifications"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"))
    message = Column(String)
    type = Column(String)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    user = relationship("User", back_populates="notifications")

class UserSettings(Base):
    __tablename__ = "user_settings"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), unique=True)
    theme = Column(String, default="light")
    email_notifications = Column(Boolean, default=True)
    auto_save = Column(Boolean, default=True)
    user = relationship("User", back_populates="settings")
