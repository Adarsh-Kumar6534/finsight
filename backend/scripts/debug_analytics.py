import sys
import os

# Add parent directory to path to import app modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import SessionLocal
from app.services.analytics_service import analytics_service
import traceback

def debug_analytics():
    db = SessionLocal()
    try:
        print("Testing get_dashboard_data...")
        data = analytics_service.get_dashboard_data(db)
        print("Success!")
        print(data)
    except Exception as e:
        print(f"Error: {e}")
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    debug_analytics()
