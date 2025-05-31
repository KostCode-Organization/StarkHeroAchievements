from pydantic_settings import BaseSettings
from dotenv import load_dotenv
load_dotenv()
from pathlib import Path

from pydantic import Field, computed_field
from pydantic_settings import BaseSettings, SettingsConfigDict
from sqlalchemy import URL

class Settings(BaseSettings):
    # database_url: str
    # redis_url: str
    # web3_provider_uri: str
    # contract_address: str
    # private_key: str
    github_client_id: str
    github_client_secret: str
    github_callback_url: str
    # secret_key: str
    algorithm: str = "HS256"

    db_driver: str = "postgresql+asyncpg"
    db_name: str = Field(default="db_name", alias="POSTGRES_DB")
    db_user: str = Field(default="user", alias="POSTGRES_USER")
    db_password: str = Field(default="password", alias="POSTGRES_PASSWORD")
    db_host: str = "db"
    db_port: int = 5432

    openai_api_key: str = "asdads"

    class Config:
        env_file = ".env"
        extra = "ignore"  # Ignore extra environment variables

    @computed_field
    @property
    def db_url(self) -> URL:
        """
        Computed property to get SQLAlchemy URL, using env settings
        """
        return URL.create(
            drivername=self.db_driver,
            username=self.db_user,
            password=self.db_password,
            host=self.db_host,
            database=self.db_name,
            port=self.db_port,
        )

settings = Settings()