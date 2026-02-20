from sqlalchemy.orm import Session
from app.repositories.analytics_repo import AnalyticsRepository
from typing import Dict, Any

class AnalyticsService:
    def __init__(self):
        self.repo = AnalyticsRepository()

    def get_dashboard_data(self, db: Session) -> Dict[str, Any]:
        kpis = self.repo.get_kpis(db)
        trends = self.repo.get_transaction_trends(db)
        risk_exposure = self.repo.get_risk_exposure(db)
        
        return {
            "kpis": kpis,
            "trend": trends,
            "risk_distribution": risk_exposure
        }

analytics_service = AnalyticsService()
