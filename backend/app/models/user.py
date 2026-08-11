import uuid
import enum
from sqlalchemy import Column, String, Boolean, DateTime, Enum, func
from sqlalchemy.orm import relationship
from app.db.database import Base

class TierEnum(str, enum.Enum):
    free = "free"
    pro = "pro"
    enterprise = "enterprise"

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    tier = Column(Enum(TierEnum), default=TierEnum.free, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    resumes = relationship("Resume", back_populates="user", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
    settings = relationship("UserSettings", back_populates="user", uselist=False, cascade="all, delete-orphan")
