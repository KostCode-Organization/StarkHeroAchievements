from hashlib import sha256
from typing import Optional

from passlib.context import CryptContext
from sqlalchemy import String, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.types import Enum

from app.models.base import AbstractBaseModel

class Nfts(AbstractBaseModel):
    """
    achievements model representing achievements in the system.
    """

    meta_data: Mapped[str] = mapped_column(JSON, nullable=False, unique=True)



