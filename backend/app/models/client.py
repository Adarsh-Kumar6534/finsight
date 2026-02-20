from sqlalchemy import Column, Integer, String, Float, DateTime, Enum, Index
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class Client(Base):
    __tablename__ = "clients"

    client_id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    region = Column(String, index=True)
    risk_rating = Column(String, index=True)  # Low, Medium, High
    joined_date = Column(DateTime, default=datetime.utcnow)
    
    transactions = relationship("Transaction", back_populates="client")

    __table_args__ = (
        Index("idx_client_region_risk", "region", "risk_rating"),
    )
