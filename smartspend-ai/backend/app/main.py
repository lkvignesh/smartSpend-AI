from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routes import auth, finance, ai
from app.db.session import Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SmartSpend AI",
    description="AI-powered personal finance tracker",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "https://smartspend-ai.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api")
app.include_router(finance.router, prefix="/api")
app.include_router(ai.router, prefix="/api")

@app.get("/")
def root():
    return {"status": "SmartSpend AI is running", "docs": "/docs"}

@app.get("/health")
def health():
    return {"status": "healthy"}
