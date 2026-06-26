from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
import bcrypt
from app.core.config import settings

def hash_password(password: str) -> str:
    password_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes, salt)
    return hashed.decode('utf-8')

def verify_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(plain.encode('utf-8'), hashed.encode('utf-8'))
    except Exception:
        return False

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
