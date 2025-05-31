"""
This module contains the database session configuration for FastAPI routes.
"""

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import sessionmaker

from app.core.config import settings
import sqlalchemy

engine = sqlalchemy.create_engine(settings.db_url, echo=True, future=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


# Dependency for FastAPI routes
def get_db():
    """
    Dependency for FastAPI routes.
    :return: Database session.
    """
    with SessionLocal() as session:
        yield session
