from fastapi import APIRouter, HTTPException
from schemas import user as user_schema
from models import user as user_model
from utils import hash_password, verify_password, create_jwt_token
from bson import ObjectId

router = APIRouter()

@router.post("/signup", response_model=user_schema.UserOut)
async def signup(user: user_schema.UserCreate):
    existing = await user_model.user_collection.find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed = hash_password(user.password)
    user_doc = {
        "email": user.email,
        "username": user.username,
        "password": hashed,
    }
    result = await user_model.user_collection.insert_one(user_doc)
    return user_schema.UserOut(id=str(result.inserted_id), email=user.email, username=user.username)

@router.post("/login")
async def login(user: user_schema.UserLogin):
    existing = await user_model.user_collection.find_one({"email": user.email})
    if not existing or not verify_password(user.password, existing["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_jwt_token({"user_id": str(existing["_id"])})
    return {"access_token": token}
