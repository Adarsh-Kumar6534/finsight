from sqlalchemy.orm import Session
from app.models.client import Client
from app.schemas.client_schema import ClientCreate

class ClientRepository:
    def get_client(self, db: Session, client_id: int):
        return db.query(Client).filter(Client.client_id == client_id).first()

    def get_clients(self, db: Session, skip: int = 0, limit: int = 100, search: str = None):
        query = db.query(Client)
        if search:
            search_pattern = f"%{search}%"
            query = query.filter(
                (Client.name.ilike(search_pattern)) | 
                (Client.region.ilike(search_pattern))
            )
        return query.offset(skip).limit(limit).all()

    def create_client(self, db: Session, client: ClientCreate):
        db_client = Client(**client.dict())
        db.add(db_client)
        db.commit()
        db.refresh(db_client)
        return db_client
