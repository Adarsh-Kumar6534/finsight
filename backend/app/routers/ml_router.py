from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from app.services.ml_service import ml_service
from typing import Optional

router = APIRouter()

class PredictionRequest(BaseModel):
    amount: float
    risk_rating: str
    region: str
    hour_of_day: int
    transaction_type: str

class PredictionResponse(BaseModel):
    prediction: Optional[int] = None
    probability: Optional[float] = None
    is_anomaly: Optional[int] = None
    anomaly_score: Optional[float] = None
    model_version: str
    error: Optional[str] = None

from app.schemas.common_schema import APIResponse

@router.post("/predict-sla", response_model=APIResponse[PredictionResponse])
def predict_sla(request: PredictionRequest):
    result = ml_service.predict_sla_breach(request.dict())
    if "error" in result:
        raise HTTPException(status_code=503, detail=result["error"])
    return {
        "success": True,
        "data": result
    }

@router.post("/predict-failure", response_model=APIResponse[PredictionResponse])
def predict_failure(request: PredictionRequest):
    result = ml_service.predict_failure(request.dict())
    if "error" in result:
        raise HTTPException(status_code=503, detail=result["error"])
    return {
        "success": True,
        "data": result
    }

@router.post("/detect-anomaly", response_model=APIResponse[PredictionResponse])
def detect_anomaly(request: PredictionRequest):
    result = ml_service.detect_anomaly(request.dict())
    if "error" in result:
        raise HTTPException(status_code=503, detail=result["error"])
    return {
        "success": True,
        "data": result
    }
