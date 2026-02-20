import sys
import os
from sqlalchemy import text
from app.core.database import SessionLocal

# Add backend to sys.path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

def validate_db():
    db = SessionLocal()
    try:
        # Test connection
        result = db.execute(text("SELECT 1")).scalar()
        print(f"Connection Successful: {result == 1}")

        # Check tables
        tables = db.execute(text("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'")).fetchall()
        print("Tables in DB:", [t[0] for t in tables])

        # Check row counts
        for table in ['clients', 'transactions', 'operations']:
            count = db.execute(text(f"SELECT COUNT(*) FROM {table}")).scalar()
            print(f"{table}: {count} rows")

    except Exception as e:
        print(f"Validation Failed: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    validate_db()
