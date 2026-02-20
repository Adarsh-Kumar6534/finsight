from sqlalchemy.orm import Session
from app.models.operation import Operation

class OperationRepository:
    def get_operations(self, db: Session, skip: int = 0, limit: int = 50):
        return db.query(Operation).order_by(Operation.last_updated.desc()).offset(skip).limit(limit).all()
