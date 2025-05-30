from pydantic import BaseSettings
from dotenv import load_dotenv
load_dotenv()

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


    class Config:
        env_file = ".env"

settings = Settings() 