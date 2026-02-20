from pydantic import BaseModel
from typing import List, Optional

class PredictionRequest(BaseModel):
    features: List[float]

class PredictionResponse(BaseModel):
    prediction: int
    probability: float
    model_version: str
