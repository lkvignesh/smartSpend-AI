from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.schemas.auth import RegisterRequest, LoginRequest, TokenResponse, RefreshRequest
from app.services.auth_service import AuthService
from app.db.session import get_db

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=TokenResponse)
def register(body: RegisterRequest, db: Session = Depends(get_db)):
    return AuthService(db).register(body)

@router.post("/login", response_model=TokenResponse)
def login(body: LoginRequest, db: Session = Depends(get_db)):
    return AuthService(db).login(body)

@router.post("/refresh")
def refresh(body: RefreshRequest, db: Session = Depends(get_db)):
    return AuthService(db).refresh(body.refresh_token)

@router.get("/google/url")
def google_url():
    from app.core.config import settings
    return {"url": f"https://accounts.google.com/o/oauth2/auth?client_id={settings.GOOGLE_CLIENT_ID}&redirect_uri={settings.FRONTEND_URL}/auth/google/callback&response_type=code&scope=email profile"}

@router.get("/google/callback")
async def google_callback(code: str, db: Session = Depends(get_db)):
    return await AuthService(db).google_oauth(code)
