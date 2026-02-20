import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import SessionLocal
# Import models to ensure they are registered with Base
from app.models import Client, Transaction
from app.repositories.transaction_repo import transaction_repo

def debug_transactions():
    db = SessionLocal()
    try:
        print("Testing get_all_transactions...")
        txns = transaction_repo.get_all_transactions(db, limit=5)
        print(f"Found {len(txns)} transactions")
        for t in txns:
            print(f"ID: {t.transaction_id}, Amount: {t.amount}, Date: {t.transaction_date}")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    debug_transactions()
