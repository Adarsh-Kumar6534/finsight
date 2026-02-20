from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.repositories.operation_repo import OperationRepository
from app.schemas.operation_schema import OperationResponse
from app.schemas.common_schema import APIResponse
from typing import List

router = APIRouter()
operation_repo = OperationRepository()

@router.get("/", response_model=APIResponse[List[OperationResponse]])
def get_operations(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """
    Fetch system operations logs.
    """
    try:
        operations = operation_repo.get_operations(db, skip=skip, limit=limit)
        return {
            "success": True,
            "data": operations,
            "error": None
        }
    except Exception as e:
        print(f"Error fetching operations: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
