from pydantic import BaseModel
from typing import Generic, TypeVar, Optional, Any

T = TypeVar("T")

class MetaData(BaseModel):
    execution_time_ms: int

class APIResponse(BaseModel, Generic[T]):
    success: bool
    data: Optional[T] = None
    meta: Optional[MetaData] = None
    error: Optional[str] = None
