from pydantic import BaseModel
from typing import List, Dict, Any

class KPIResponse(BaseModel):
    total_volume: float
    total_transactions: int
    high_risk_count: int
    sla_breach_rate: float

class TrendPoint(BaseModel):
    day: str
    volume: float
    count: int

class HighRiskClient(BaseModel):
    client_id: int
    name: str
    region: str
    risk_rating: str
    total_exposure: float
    region_rank: int
    exposure_quartile: int

class AnalyticsResponse(BaseModel):
    kpis: KPIResponse
    trend: List[TrendPoint]
    risk_distribution: List[HighRiskClient]
