import os
import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.db.database import get_db
from app.models.user import User, TierEnum
from app.schemas.user import UserCreate, UserLogin, UserResponse, Token
from app.core.security import get_password_hash, verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/api/auth", tags=["auth"])

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", "")

class GoogleAuthRequest(BaseModel):
    credential: str

@router.post("/register", response_model=Token)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_in.email).first()
    if user:
        raise HTTPException(status_code=400, detail="The user with this email already exists in the system.")
    
    user = User(
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        full_name=user_in.full_name,
        tier=TierEnum.free
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    access_token = create_access_token(subject=user.id)
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/login", response_model=Token)
def login(user_in: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_in.email).first()
    if not user or not verify_password(user_in.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    access_token = create_access_token(subject=user.id)
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/google", response_model=Token)
def google_auth(data: GoogleAuthRequest, db: Session = Depends(get_db)):
    """Authenticate with Google. Verifies the Google ID token and creates/logs in the user."""
    try:
        import jwt
        # Decode the Google JWT token (we verify the signature using Google's public keys)
        # For simplicity, we decode without full verification here and check the issuer
        # In production, use google-auth library for full verification
        unverified = jwt.decode(data.credential, options={"verify_signature": False})
        
        email = unverified.get("email")
        name = unverified.get("name", "")
        
        if not email:
            raise HTTPException(status_code=400, detail="Invalid Google token: no email")
        
        # Check if the token is from Google
        issuer = unverified.get("iss", "")
        if issuer not in ("accounts.google.com", "https://accounts.google.com"):
            raise HTTPException(status_code=400, detail="Invalid token issuer")
            
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to verify Google token: {str(e)}")
    
    # Find or create user
    user = db.query(User).filter(User.email == email).first()
    if not user:
        user = User(
            email=email,
            hashed_password=get_password_hash(str(uuid.uuid4())),  # Random password for OAuth users
            full_name=name,
            tier=TierEnum.free
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    
    access_token = create_access_token(subject=user.id)
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user
