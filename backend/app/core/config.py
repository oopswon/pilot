import os
from pydantic import BaseModel

class Settings(BaseModel):
    PROJECT_NAME: str = "CRM Pipeline Tracking System"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-for-development")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days
    ALGORITHM: str = "HS256"

settings = Settings()
