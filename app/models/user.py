from hashlib import sha256
from typing import Optional

from passlib.context import CryptContext
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.types import Enum

from app.models.base import AbstractBaseModel

class User(AbstractBaseModel):
    """
    User model representing users in the system.
    """

    egithub_username: Mapped[Optional[str]] = mapped_column(String, nullable=True, unique=True)
    wallet_id: Mapped[Optional[str]] = mapped_column(String, nullable=True)