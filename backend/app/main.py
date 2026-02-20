from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings

from app.routers import analytics_router, ml_router, transaction_router, client_router, risk_router, operation_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Set all CORS enabled origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://finsight-alpha-liart.vercel.app",
    ],
    allow_origin_regex=r"https://finsight-.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analytics_router.router, prefix=f"{settings.API_V1_STR}/analytics", tags=["analytics"])
app.include_router(ml_router.router, prefix=f"{settings.API_V1_STR}/ml", tags=["ml"])
app.include_router(transaction_router.router, prefix=f"{settings.API_V1_STR}/transactions", tags=["transactions"])
app.include_router(client_router.router, prefix=f"{settings.API_V1_STR}/clients", tags=["clients"])
app.include_router(risk_router.router, prefix=f"{settings.API_V1_STR}/risk", tags=["risk"])
app.include_router(operation_router.router, prefix=f"{settings.API_V1_STR}/operations", tags=["operations"])

@app.get("/")
def root():
    return {"message": "Welcome to FinSight 2.0 API"}
