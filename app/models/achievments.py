from hashlib import sha256
from typing import Optional
from uuid import UUID
from passlib.context import CryptContext
from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.types import Enum

from app.models.base import AbstractBaseModel

class Achievements(AbstractBaseModel):
    """
    achievements model representing achievements in the system.
    """

    achievements: Mapped[str] = mapped_column(String, nullable=False, unique=True)
    achievements_descriotion: Mapped[str] = mapped_column(String, nullable=False)
    nft_id: Mapped[UUID] = mapped_column(ForeignKey("nfts.id"), nullable=True, unique=True)
    nft: Mapped['Nfts'] = relationship(
        "Nfts",
        back_populates="achievements",
        uselist=False,
        cascade="all, delete-orphan",
        lazy="selectin",
    )

