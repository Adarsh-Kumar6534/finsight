from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ClientCreate(BaseModel):
    client_id: int
    name: str
    region: str
    risk_rating: str
    joined_date: Optional[datetime] = None

class ClientResponse(BaseModel):
    client_id: int
    name: str
    region: str
    risk_rating: str
    joined_date: datetime

    class Config:
        orm_mode = True
