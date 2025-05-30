from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    wallet_address = Column(String, unique=True, index=True, nullable=False)
    github_id = Column(String, unique=True, index=True, nullable=True)
    github_username = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    achievements = relationship("Achievement", back_populates="user")
    nfts = relationship("NFT", back_populates="user")

class Achievement(Base):
    __tablename__ = "achievements"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    type = Column(String, nullable=False)
    description = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    user = relationship("User", back_populates="achievements")

class NFT(Base):
    
    __tablename__ = "nfts"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    token_id = Column(String, unique=True, nullable=False)
    metadata_uri = Column(String, nullable=False)
    issued_at = Column(DateTime, default=datetime.utcnow)
    user = relationship("User", back_populates="nfts") 