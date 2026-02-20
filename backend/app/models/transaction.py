from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean, Index
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class Transaction(Base):
    __tablename__ = "transactions"

    transaction_id = Column(String, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("clients.client_id"), index=True)
    amount = Column(Float)
    currency = Column(String)
    status = Column(String, index=True)  # Completed, Pending, Failed
    transaction_date = Column(DateTime, default=datetime.utcnow, index=True)
    sla_breach_flag = Column(Boolean, default=False, index=True)
    
    client = relationship("Client", back_populates="transactions")

    __table_args__ = (
        Index("idx_transaction_timestamp", "transaction_date"),
        Index("idx_transaction_client_date", "client_id", "transaction_date"),
    )
