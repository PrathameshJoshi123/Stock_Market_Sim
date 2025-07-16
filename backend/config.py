from pydantic_settings import BaseSettings
import os
from dotenv import load_dotenv
load_dotenv()

class Settings(BaseSettings):
    mongo_uri: str = os.getenv("MONGO_URI")
    jwt_secret: str = "supersecret"
    jwt_algorithm: str = "HS256"

settings = Settings()
