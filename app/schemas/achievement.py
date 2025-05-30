from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class AchievementBase(BaseModel):
    type: str
    description: Optional[str] = None

class AchievementCreate(AchievementBase):
    pass

class AchievementOut(AchievementBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        orm_mode = True 