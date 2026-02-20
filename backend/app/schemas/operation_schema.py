from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class OperationResponse(BaseModel):
    operation_id: str
    region: str
    status: str
    last_updated: datetime
    details: Optional[str] = None

    class Config:
        orm_mode = True
