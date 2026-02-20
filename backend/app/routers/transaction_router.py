from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.repositories.transaction_repo import transaction_repo
from app.schemas.common_schema import APIResponse
from typing import List, Any

router = APIRouter()

from app.schemas.transaction_schema import TransactionResponse

@router.get("/", response_model=APIResponse[List[TransactionResponse]])
def get_transactions(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """
    Fetch paginated transactions.
    """
    try:
        transactions = transaction_repo.get_all_transactions(db, skip=skip, limit=limit)
        return {
            "success": True,
            "data": transactions,
            "error": None
        }
    except Exception as e:
        print(f"Error fetching transactions: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
