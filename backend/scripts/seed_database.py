import sys
import os
import pandas as pd
import random
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.core.database import SessionLocal, engine, Base
from app.models.client import Client
from app.models.transaction import Transaction
from app.models.operation import Operation

sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

def seed_data():
    db: Session = SessionLocal()
    
    # Check Clients
    try:
        if db.query(Client).count() > 0:
            print("Clients already seeded.")
        else:
            print("Loading Clients...")
            clients_df = pd.read_csv('../finsight2_clients.csv')
            # Columns: client_id, industry, risk_rating, revenue_band, compliance_score
            
            # Map client_id to region from transactions?
            # For speed, just use random regions + weighted by industry?
            regions = ['North America', 'Europe', 'APAC', 'LATAM']
            
            clients = []
            for i, row in clients_df.iterrows():
                clients.append(Client(
                    client_id=row['client_id'],
                    name=f"Client {row['client_id']} ({row['industry']})",
                    region=random.choice(regions),
                    risk_rating=row['risk_rating'],
                    joined_date=datetime.utcnow() - timedelta(days=random.randint(0, 1000))
                ))
                if len(clients) >= 1000:
                    db.bulk_save_objects(clients)
                    db.commit()
                    clients = []
            if clients:
                db.bulk_save_objects(clients)
                db.commit()
            print("Clients loaded.")

    except Exception as e:
        print(f"Error seeding clients: {e}")
        db.rollback()

    # Check Transactions
    try:
        if db.query(Transaction).count() > 0:
            print("Transactions already seeded.")
        else:
            print("Loading Transactions...")
            # Columns: transaction_id, client_id, region, asset_class, channel, transaction_value, transaction_timestamp, risk_rating, failed, status
            txns_df = pd.read_csv('../finsight2_transactions.csv')
            txns_df['transaction_timestamp'] = pd.to_datetime(txns_df['transaction_timestamp'])
            
            txns = []
            count = 0 
            total_txns = len(txns_df)
            
            for i, row in txns_df.iterrows():
                # Map CSV to Model
                # Model: transaction_id, client_id, amount, currency, status, transaction_date, sla_breach_flag
                
                sla_breach = False
                # Randomly assign SLA breach for demo purposes heavily weighted by failed status?
                # Or just random 5%
                if random.random() < 0.05:
                    sla_breach = True

                txns.append(Transaction(
                    transaction_id=str(row['transaction_id']),
                    client_id=row['client_id'],
                    amount=row['transaction_value'],
                    currency='USD', # Default
                    status=row['status'],
                    transaction_date=row['transaction_timestamp'],
                    sla_breach_flag=sla_breach
                ))
                
                if len(txns) >= 1000:
                    db.bulk_save_objects(txns)
                    db.commit()
                    count += len(txns)
                    txns = []
                    print(f"Inserted {count}/{total_txns} transactions...", end='\r')
            
            if txns:
                db.bulk_save_objects(txns)
                db.commit()
            print("\nTransactions loaded.")

    except Exception as e:
        print(f"Error seeding transactions: {e}")
        db.rollback()

    # Check Operations
    try:
        if db.query(Operation).count() > 0:
            print("Operations already seeded.")
        else:
            print("Loading Operations...")
            # Columns: transaction_id, validation_time, risk_check_time, execution_time, settlement_time, total_processing_time, sla_breach_flag, manual_intervention_flag
            ops_df = pd.read_csv('../finsight2_operations.csv')
            
            ops = []
            for i, row in ops_df.iterrows():
                # Model: operation_id, region, status, last_updated, details
                
                status = "Operational"
                if row['manual_intervention_flag']:
                    status = "Intervention Required"
                elif row['sla_breach_flag']:
                    status = "SLA Breach"
                
                ops.append(Operation(
                    operation_id=str(row['transaction_id']), # Use transaction_id as operation_id
                    region=random.choice(['North America', 'Europe', 'APAC', 'LATAM']), # Synthetic
                    status=status,
                    last_updated=datetime.utcnow(),
                    details=f"Total Time: {row['total_processing_time']}s"
                ))
                
                if len(ops) >= 1000:
                    db.bulk_save_objects(ops)
                    db.commit()
                    ops = []
                    print(f"Inserted {i+1} operations...", end='\r')
            
            if ops:
                db.bulk_save_objects(ops)
                db.commit()
            print("\nOperations loaded.")

    except Exception as e:
        print(f"Error seeding operations: {e}")
        db.rollback()

    finally:
        db.close()

if __name__ == "__main__":
    seed_data()
