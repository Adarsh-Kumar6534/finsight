from sqlalchemy.orm import Session
from sqlalchemy import text
from app.models.transaction import Transaction
from app.schemas.transaction_schema import TransactionCreate

class TransactionRepository:
    def get_transaction(self, db: Session, transaction_id: str):
        return db.query(Transaction).filter(Transaction.transaction_id == transaction_id).first()

    def create_transaction(self, db: Session, transaction: TransactionCreate):
        db_transaction = Transaction(**transaction.dict())
        db.add(db_transaction)
        db.commit()
        db.refresh(db_transaction)
        return db_transaction
    
    def get_transactions_by_client(self, db: Session, client_id: int, skip: int = 0, limit: int = 100):
        return db.query(Transaction).filter(Transaction.client_id == client_id).offset(skip).limit(limit).all()

    def get_all_transactions(self, db: Session, skip: int = 0, limit: int = 50):
        return db.query(Transaction).order_by(Transaction.transaction_date.desc()).offset(skip).limit(limit).all()

transaction_repo = TransactionRepository()
