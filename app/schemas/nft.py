from pydantic import BaseModel
from datetime import datetime

class NFTBase(BaseModel):
    token_id: str
    metadata_uri: str

class NFTCreate(NFTBase):
    pass

class NFTOut(NFTBase):
    id: int
    user_id: int
    issued_at: datetime

    class Config:
        orm_mode = True 