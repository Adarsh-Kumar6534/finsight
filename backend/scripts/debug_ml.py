import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.services.ml_service import ml_service

def debug_ml():
    print("Testing ML Service...")
    
    # Test SLA Prediction
    req = {
        "amount": 50000.0,
        "risk_rating": "High",
        "region": "North America",
        "hour_of_day": 14,
        "transaction_type": "Transfer"
    }
    
    try:
        print("Predicting SLA Breach...")
        result = ml_service.predict_sla_breach(req)
        print(f"SLA Result: {result}")
        
    except Exception as e:
        print(f"ML Error: {e}")

if __name__ == "__main__":
    debug_ml()
