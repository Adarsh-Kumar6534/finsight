from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import List, Dict, Any
from datetime import datetime, timedelta

class AnalyticsRepository:
    def get_kpis(self, db: Session) -> Dict[str, Any]:
        """
        Executes complex KPI aggregation query using raw SQL.
        """
        query = text("SELECT * FROM kpis_view") # Placeholder, will be replaced by actual SQL file content
        # For now, return dummy data until SQL files are integrated
        return {
            "total_volume": 1234567.89,
            "total_transactions": 5432,
            "high_risk_count": 120,
            "sla_breach_rate": 0.05
        }

    def get_transaction_trends(self, db: Session, days: int = 30) -> List[Dict[str, Any]]:
        """
        Fetch daily transaction volume and count for the last N days.
        Uses the 'idx_transaction_timestamp' index.
        """
        # Since we are using historic CSV data, we might not have data for "last 7 days" relative to NOW.
        # For this demo, let's just get the last 30 days of AVAILABLE data in the DB.
        
        # First, find the latest date in the DB
        max_date_query = text("SELECT MAX(transaction_date) FROM transactions")
        max_date = db.execute(max_date_query).scalar()
        
        if not max_date:
            return []

        # Query for usage of index
        query = text("""
            SELECT 
                TO_CHAR(transaction_date, 'YYYY-MM-DD') as day, 
                SUM(amount) as volume, 
                COUNT(*) as count
            FROM transactions 
            WHERE transaction_date >= :start_date
            GROUP BY TO_CHAR(transaction_date, 'YYYY-MM-DD')
            ORDER BY day ASC
        """)
        
        # Go back 30 days from the latest data point
        start_date = max_date - timedelta(days=days)
        
        result = db.execute(query, {"start_date": start_date}).fetchall()
        
        trends = []
        for row in result:
             trends.append({
                 "day": row[0],
                 "volume": float(row[1]),
                 "count": int(row[2])
             })
        return trends

    def get_risk_exposure(self, db: Session) -> List[Dict[str, Any]]:
        """
        Identify high-risk clients and their total exposure.
        """
        query = text("""
            SELECT 
                c.client_id,
                c.name,
                c.region,
                c.risk_rating,
                SUM(t.amount) as total_exposure
            FROM clients c
            JOIN transactions t ON c.client_id = t.client_id
            WHERE c.risk_rating IN ('High', 'Medium')
            GROUP BY c.client_id, c.name, c.region, c.risk_rating
            ORDER BY total_exposure DESC
            LIMIT 50
        """)
        
        result = db.execute(query).fetchall()
        
        exposure = []
        for i, row in enumerate(result):
            exposure.append({
                "client_id": row[0],
                "name": row[1],
                "region": row[2],
                "risk_rating": row[3],
                "total_exposure": float(row[4]),
                "region_rank": i + 1,        # Simple rank for now
                "exposure_quartile": 1       # Placeholder
            })
            
        return exposure
    def get_risk_metrics(self, db: Session) -> Dict[str, Any]:
        """
        Aggregates risk data for the Risk Monitor dashboard.
        """
        # 1. Risk by Region (Heatmap data)
        region_query = text("""
            SELECT c.region, SUM(t.amount) as total_exposure, COUNT(DISTINCT c.client_id) as client_count
            FROM transactions t
            JOIN clients c ON t.client_id = c.client_id
            GROUP BY c.region
        """)
        region_data = db.execute(region_query).fetchall()
        
        # 2. Risk Rating Distribution
        rating_query = text("""
            SELECT risk_rating, COUNT(*) as count
            FROM clients
            GROUP BY risk_rating
        """)
        rating_data = db.execute(rating_query).fetchall()
        
        # 3. Recent High Risk Transactions
        recent_txns_query = text("""
            SELECT 
                t.transaction_id, 
                c.name as client_name, 
                t.amount, 
                c.region, 
                t.transaction_date,
                t.status
            FROM transactions t
            JOIN clients c ON t.client_id = c.client_id
            WHERE t.amount > 50000 OR t.status = 'Failed'
            ORDER BY t.transaction_date DESC
            LIMIT 10
        """)
        recent_txns = db.execute(recent_txns_query).fetchall()
        
        return {
            "regional_risk": [
                {"region": row[0], "exposure": float(row[1]), "count": int(row[2])} 
                for row in region_data
            ],
            "risk_distribution": [
                {"rating": row[0], "count": int(row[1])} 
                for row in rating_data
            ],
            "flagged_transactions": [
                {
                    "id": row[0], 
                    "client": row[1], 
                    "amount": float(row[2]), 
                    "region": row[3],
                    "date": row[4],
                    "status": row[5]
                }
                for row in recent_txns
            ]
        }
