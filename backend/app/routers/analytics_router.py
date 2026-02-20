from fastapi import APIRouter, Depends, HTTPException
from typing import Any
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.analytics_service import analytics_service
from app.schemas.analytics_schema import AnalyticsResponse
from app.schemas.common_schema import APIResponse

router = APIRouter()

@router.get("/dashboard", response_model=APIResponse[AnalyticsResponse])
def get_analytics_dashboard(db: Session = Depends(get_db)) -> Any:
    """
    Get comprehensive analytics dashboard data.
    """
    try:
        data = analytics_service.get_dashboard_data(db)
        return {
            "success": True,
            "data": data,
            "meta": {"execution_time_ms": 12}, # Placeholder for timing middleware
            "error": None
        }
    except Exception as e:
        # In production, log error and return specific error codes
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
