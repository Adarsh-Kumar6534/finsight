from sqlalchemy import Column, Integer, String, DateTime, Index
from datetime import datetime
from app.core.database import Base

class Operation(Base):
    __tablename__ = "operations"

    operation_id = Column(String, primary_key=True, index=True)
    region = Column(String, index=True)
    status = Column(String, index=True)
    last_updated = Column(DateTime, default=datetime.utcnow)
    details = Column(String, nullable=True)

    __table_args__ = (
        Index("idx_operation_region_status", "region", "status"),
    )
