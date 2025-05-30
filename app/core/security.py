from jose import jwt
from app.core.config import settings

# Placeholder for signature verification (MetaMask)
def verify_signature(address: str, signature: str, message: str) -> bool:
    # Implement signature verification logic
    return True

# JWT creation utility
def create_access_token(data: dict) -> str:
    return jwt.encode(data, settings.secret_key, algorithm=settings.algorithm) 