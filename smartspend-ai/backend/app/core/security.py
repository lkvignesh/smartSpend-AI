from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

def create_access_token(data: dict) -> str:
    expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return jwt.encode({**data, "exp": expire}, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

def create_refresh_token(data: dict) -> str:
    expire = datetime.utcnow() + timedelta(days=7)
    return jwt.encode({**data, "exp": expire}, settings.REFRESH_SECRET_KEY, algorithm=settings.ALGORITHM)

def decode_token(token: str, refresh: bool = False) -> Optional[dict]:
    try:
        key = settings.REFRESH_SECRET_KEY if refresh else settings.SECRET_KEY
        return jwt.decode(token, key, algorithms=[settings.ALGORITHM])
    except JWTError:
        return None
