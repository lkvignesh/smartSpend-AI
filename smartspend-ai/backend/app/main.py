from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings

app = FastAPI(
    title="SmartSpend AI",
    description="AI-powered personal finance tracker",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.api.routes import auth, finance, ai
app.include_router(auth.router, prefix="/api")
app.include_router(finance.router, prefix="/api")
app.include_router(ai.router, prefix="/api")

@app.on_event("startup")
async def startup():
    try:
        from app.db.session import Base, engine
        Base.metadata.create_all(bind=engine)
        print("✅ Database tables created successfully")
    except Exception as e:
        print(f"❌ Database error: {e}")

@app.get("/")
def root():
    return {"status": "SmartSpend AI is running", "docs": "/docs"}

@app.get("/health")
def health():
    return {"status": "healthy"}
