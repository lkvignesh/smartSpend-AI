from pydantic import BaseModel, EmailStr
from typing import Optional
from uuid import UUID
from datetime import datetime

class RegisterRequest(BaseModel):
    email: EmailStr
    full_name: str
    password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: "UserOut"

class UserOut(BaseModel):
    id: UUID
    email: str
    full_name: str
    avatar_url: Optional[str]
    is_verified: bool
    currency: str
    created_at: datetime

    class Config:
        from_attributes = True

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

class RefreshRequest(BaseModel):
    refresh_token: str
