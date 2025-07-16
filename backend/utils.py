from passlib.context import CryptContext
from jose import jwt
from config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def create_jwt_token(data: dict):
    return jwt.encode(data, settings.jwt_secret, algorithm=settings.jwt_algorithm)
