from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class TransactionCreate(BaseModel):
    transaction_id: str
    client_id: int
    amount: float
    currency: str
    status: str
    transaction_date: datetime
    region: str
    merchant_category: str
    payment_method: str
    risk_rating: str

class TransactionResponse(BaseModel):
    transaction_id: str
    client_id: int
    amount: float
    currency: str
    status: str
    transaction_date: datetime
    sla_breach_flag: bool

    class Config:
        orm_mode = True
