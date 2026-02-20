from typing import List, Union
from pydantic import AnyHttpUrl, PostgresDsn, validator
from pydantic_settings import BaseSettings
from dotenv import load_dotenv
import os

load_dotenv() # Load env vars from .env file explicitly

class Settings(BaseSettings):
    PROJECT_NAME: str = "FinSight 2.0"
    API_V1_STR: str = "/api/v1"
    
    # BACKEND_CORS_ORIGINS is a JSON-formatted list of origins
    # e.g: '["http://localhost", "http://localhost:4200", "http://localhost:3000"]'
    BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = []

    @validator("BACKEND_CORS_ORIGINS", pre=True)
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)

    POSTGRES_SERVER: str = "localhost"
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "password"
    POSTGRES_DB: str = "finsight2"
    DATABASE_URL: str | None = None # Ensure this is picked up from env
    sqlalchemy_database_uri: str | None = None

    @validator("sqlalchemy_database_uri", pre=True)
    def assemble_db_connection(cls, v: str | None, values: dict[str, any]) -> str:
        if isinstance(v, str):
            return v
        # Fallback to building from components if DATABASE_URL is not set directly
        # But we expect DATABASE_URL to be set in .env
        return values.get("DATABASE_URL") or PostgresDsn.build(
            scheme="postgresql",
            username=values.get("POSTGRES_USER"),
            password=values.get("POSTGRES_PASSWORD"),
            host=values.get("POSTGRES_SERVER"),
            path=f"{values.get('POSTGRES_DB') or ''}",
        ).unicode_string()

    class Config:
        case_sensitive = True
        env_file = ".env"
        extra = "ignore" # Allow extra fields like DATABASE_URL in .env without validation error

settings = Settings()
