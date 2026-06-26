from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.models import User, AuthProvider
from app.schemas.auth import RegisterRequest, LoginRequest, TokenResponse, UserOut
from app.core.security import hash_password, verify_password, create_access_token, create_refresh_token, decode_token
import httpx

class AuthService:
    def __init__(self, db: Session):
        self.db = db

    def register(self, data: RegisterRequest) -> TokenResponse:
        if self.db.query(User).filter(User.email == data.email).first():
            raise HTTPException(status_code=400, detail="Email already registered")
        user = User(
            email=data.email,
            full_name=data.full_name,
            hashed_password=hash_password(data.password),
            auth_provider=AuthProvider.email,
        )
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return self._issue_tokens(user)

    def login(self, data: LoginRequest) -> TokenResponse:
        user = self.db.query(User).filter(User.email == data.email).first()
        if not user or not verify_password(data.password, user.hashed_password or ""):
            raise HTTPException(status_code=401, detail="Invalid email or password")
        if not user.is_active:
            raise HTTPException(status_code=403, detail="Account deactivated")
        return self._issue_tokens(user)

    def refresh(self, refresh_token: str) -> dict:
        payload = decode_token(refresh_token, refresh=True)
        if not payload:
            raise HTTPException(status_code=401, detail="Invalid refresh token")
        user = self.db.query(User).filter(User.id == payload.get("sub")).first()
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        access_token = create_access_token({"sub": str(user.id)})
        return {"access_token": access_token, "token_type": "bearer"}

    async def google_oauth(self, code: str) -> TokenResponse:
        from app.core.config import settings
        async with httpx.AsyncClient() as client:
            token_res = await client.post("https://oauth2.googleapis.com/token", data={
                "code": code,
                "client_id": settings.GOOGLE_CLIENT_ID,
                "client_secret": settings.GOOGLE_CLIENT_SECRET,
                "redirect_uri": f"{settings.FRONTEND_URL}/auth/google/callback",
                "grant_type": "authorization_code",
            })
            token_data = token_res.json()
            user_res = await client.get("https://www.googleapis.com/oauth2/v2/userinfo",
                headers={"Authorization": f"Bearer {token_data['access_token']}"})
            user_info = user_res.json()
        return self._upsert_oauth_user(user_info["email"], user_info.get("name", ""), 
                                       user_info.get("picture"), user_info["id"], AuthProvider.google)

    def _upsert_oauth_user(self, email, name, avatar, provider_id, provider) -> TokenResponse:
        user = self.db.query(User).filter(User.email == email).first()
        if not user:
            user = User(email=email, full_name=name, avatar_url=avatar,
                        auth_provider=provider, provider_id=provider_id, is_verified=True)
            self.db.add(user)
            self.db.commit()
            self.db.refresh(user)
        return self._issue_tokens(user)

    def _issue_tokens(self, user: User) -> TokenResponse:
        access_token = create_access_token({"sub": str(user.id)})
        refresh_token = create_refresh_token({"sub": str(user.id)})
        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            user=UserOut.model_validate(user)
        )

    def get_current_user(self, token: str) -> User:
        payload = decode_token(token)
        if not payload:
            raise HTTPException(status_code=401, detail="Invalid token")
        user = self.db.query(User).filter(User.id == payload.get("sub")).first()
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
