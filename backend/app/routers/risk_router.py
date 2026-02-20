from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.repositories.analytics_repo import AnalyticsRepository
from app.schemas.common_schema import APIResponse
from typing import Any

router = APIRouter()
analytics_repo = AnalyticsRepository()

@router.get("/overview", response_model=APIResponse[Any])
def get_risk_overview(db: Session = Depends(get_db)):
    """
    Get aggregated risk metrics for the Risk Monitor.
    """
    try:
        data = analytics_repo.get_risk_metrics(db)
        return {
            "success": True,
            "data": data,
            "error": None
        }
    except Exception as e:
        print(f"Error fetching risk metrics: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
