from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.repositories.client_repo import ClientRepository
from app.schemas.client_schema import ClientResponse
from app.schemas.common_schema import APIResponse
from typing import List

router = APIRouter()
client_repo = ClientRepository()

@router.get("/", response_model=APIResponse[List[ClientResponse]])
def get_clients(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    search: str = Query(None),
    db: Session = Depends(get_db)
):
    """
    Fetch clients with optional search.
    """
    try:
        clients = client_repo.get_clients(db, skip=skip, limit=limit, search=search)
        return {
            "success": True,
            "data": clients,
            "error": None
        }
    except Exception as e:
        print(f"Error fetching clients: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.get("/{client_id}", response_model=APIResponse[ClientResponse])
def get_client(client_id: int, db: Session = Depends(get_db)):
    """
    Fetch a single client by ID.
    """
    client = client_repo.get_client(db, client_id)
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    return {
        "success": True,
        "data": client,
        "error": None
    }
