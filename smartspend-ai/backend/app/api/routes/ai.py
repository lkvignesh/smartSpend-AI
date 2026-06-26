from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.middleware.auth import get_current_user
from app.models.models import User, AIConversation
from app.services.ai_service import AIService
from app.services.finance_service import FinanceService

router = APIRouter(prefix="/ai", tags=["ai"])

class ChatRequest(BaseModel):
    message: str

@router.post("/chat")
def ai_chat(body: ChatRequest, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    finance = FinanceService(db, user.id)
    stats = finance.get_dashboard_stats()
    context = {
        "total_expenses_month": stats.total_expenses_month,
        "total_income_month": stats.total_income_month,
        "savings_rate": stats.savings_rate,
        "health_score": stats.health_score,
        "top_categories": stats.top_categories,
    }
    ai = AIService()
    response = ai.chat(body.message, context)
    conv = AIConversation(user_id=user.id, message=body.message, response=response)
    db.add(conv)
    db.commit()
    return {"response": response, "ai_enabled": ai.enabled}

@router.get("/status")
def ai_status():
    ai = AIService()
    return {"enabled": ai.enabled, "message": "OpenAI connected" if ai.enabled else "Add OPENAI_API_KEY to enable AI features"}
