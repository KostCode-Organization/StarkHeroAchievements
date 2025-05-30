"""
This module contains the base model for all database tables. It includes common fields such as
id, created_at, and updated_at.
"""

import uuid
from datetime import datetime
from re import sub

from sqlalchemy import DateTime, MetaData
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import DeclarativeBase, Mapped, declared_attr, mapped_column

CONVENTION = {
    "ix": "%(table_name)s_%(column_0_N_name)s_idx",
    "uq": "%(table_name)s_%(column_0_N_name)s_key",
    "ck": "%(table_name)s_%(constraint_name)s_check",
    "fk": "%(table_name)s_%(column_0_N_name)s_fkey",
    "pk": "%(table_name)s_pkey",
    "seq": "%(table_name)s_%(column_0_N_name)s_seq",
}


class BaseModel(DeclarativeBase):
    """Base class for all models"""

    metadata = MetaData(naming_convention=CONVENTION)

    @classmethod
    @declared_attr.directive
    def __tablename__(cls) -> str:
        return sub(r"(?<!^)(?=[A-Z])", "_", cls.__name__).lower() + "s"


class AbstractBaseModel(BaseModel):
    """
    Abstract model with most commonly used set of fields"""

    __abstract__ = True

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )
