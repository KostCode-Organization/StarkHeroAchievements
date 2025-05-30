from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    wallet_address: str
    github_id: Optional[str] = None
    github_username: Optional[str] = None

class UserCreate(UserBase):
    pass

class UserOut(UserBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True 