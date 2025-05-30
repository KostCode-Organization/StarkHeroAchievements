"""
This module contains the application settings.
"""

from pathlib import Path

from pydantic import Field, computed_field
from pydantic_settings import BaseSettings, SettingsConfigDict
from sqlalchemy import URL


class Settings(BaseSettings):
    """
    Application settings.

    :param app_env: Application environment.
    :param secret_key: Secret key for JWT.
    :param access_token_expire_minutes: Access token expiration time in minutes.
    :param refresh_token_expire_minutes: Refresh token expiration time in minutes.
    :param algorithm: JWT algorithm.
    :param email_signup_confirmation_token_expire_minutes:
    Email signup confirmation token expiration time in minutes.
    :param mail_from: Email sender address.
    :param mail_sender_name: Email sender name.
    :param mailjet_api_key: Mailjet API key for sending emails.
    :param mailjet_api_secret: Mailjet API secret for sending emails.
    :param hostname: Hostname.
    :param api_hostname: Api Hostname.
    :param db_driver: Database driver.
    :param db_name: Database name.
    :param db_user: Database user.
    :param db_password: Database password.
    :param db_host: Database host.
    :param db_port: Database port.
    :param google_client_id: Google client ID.
    :param google_client_secret: Google client secret.
    :param google_redirect_url: Google redirect URL.
    :param github_client_id: GitHub client ID.
    :param github_client_secret: GitHub client secret.
    :param github_redirect_url: GitHub redirect URL.
    :param google_cloud_storage_key: Key for google storage .
    """

    # Application settings
    # app_env: str = "development"

    # Auth
    # secret_key: str = "SECRET_KEY"
    # access_token_expire_minutes: int = 30
    # refresh_token_expire_minutes: int = 1000
    # algorithm: str = "HS256"

    # Email settings
    # email_signup_confirmation_token_expire_minutes: int = 60  # 1 hour in minutes
    # mail_from: str = "admin@starkhero.xyz"
    # mail_sender_name: str = "StarkHero"
    # mailjet_api_key: str = Field(
    #     default="YOUR_MAILJET_API_KEY", alias="MAILJET_API_KEY"
    # )
    # mailjet_api_secret: str = Field(
    #     default="YOUR_MAILJET_API_SECRET", alias="MAILJET_API_SECRET"
    # )
    # hostname: str = "localhost"
    # api_hostname: str = "localhost"

    # Database settings
    db_driver: str = "postgresql+asyncpg"
    db_name: str = Field(default="db_name", alias="POSTGRES_DB")
    db_user: str = Field(default="user", alias="POSTGRES_USER")
    db_password: str = Field(default="password", alias="POSTGRES_PASSWORD")
    db_host: str = "db"
    db_port: int = 5432

    # # Google authentication settings
    # google_client_id: str = "google-client-id"
    # google_client_secret: str = "google-secret-client"
    # google_redirect_url: str = "google-redirect-url"

    # # GitHub authentication settings
    # github_client_id: str = "github-client-id"
    # github_client_secret: str = "github-secret-client"
    # github_redirect_url: str = "github-redirect-url"

    # # Key for google storage
    # google_cloud_storage_key: str | None = None

    model_config = SettingsConfigDict(
        env_file=Path(__file__).parent.parent.parent.joinpath(".env"),
        env_file_encoding="utf-8",
    )

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


# Create a singleton instance of the settings
settings = Settings()
