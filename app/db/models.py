from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Table
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base import Base

# ────────────────────────────────────────────────────────────────
# Association table for many‑to‑many between users and achievements
# ────────────────────────────────────────────────────────────────
user_achievements = Table(
    "user_achievements",
    Base.metadata,
    Column("user_id", Integer, ForeignKey("users.id"), primary_key=True),
    Column("achievement_id", Integer, ForeignKey("achievements.id"), primary_key=True),
    Column("granted_at", DateTime, default=datetime.utcnow),  # optional timestamp
)


class User(Base):
    __tablename__ = "users"

    id             = Column(Integer, primary_key=True, index=True)
    wallet_address = Column(String, unique=True, index=True, nullable=False)
    github_id      = Column(String, unique=True, index=True, nullable=True)
    github_username = Column(String, nullable=True)
    created_at     = Column(DateTime, default=datetime.utcnow)

    # relationships
    achievements = relationship(
        "Achievement",
        secondary=user_achievements,
        back_populates="users",
        cascade="all, delete",
    )
    nfts   = relationship("NFT",   back_populates="user", cascade="all, delete-orphan")
    issues = relationship("Issue", back_populates="user", cascade="all, delete-orphan")


class Achievement(Base):
    __tablename__ = "achievements"

    id          = Column(Integer, primary_key=True, index=True)
    type        = Column(String, nullable=False)
    description = Column(String, nullable=True)
    created_at  = Column(DateTime, default=datetime.utcnow)

    # reverse side of the m‑to‑n
    users = relationship(
        "User",
        secondary=user_achievements,
        back_populates="achievements",
    )


class NFT(Base):
    __tablename__ = "nfts"

    id           = Column(Integer, primary_key=True, index=True)
    token_id     = Column(String, unique=True, nullable=False)
    metadata_uri = Column(String, nullable=False)
    issued_at    = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="nfts")


class Issue(Base):
    __tablename__ = "issues"

    id      = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name    = Column(String, nullable=False)

    user = relationship("User", back_populates="issues")
