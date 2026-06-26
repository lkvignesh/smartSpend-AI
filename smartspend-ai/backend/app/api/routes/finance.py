from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID
from app.db.session import get_db
from app.middleware.auth import get_current_user
from app.models.models import User
from app.schemas.finance import ExpenseCreate, ExpenseOut, IncomeCreate, IncomeOut, BudgetCreate, BudgetOut, GoalCreate, GoalOut, DashboardStats
from app.services.finance_service import FinanceService

router = APIRouter(tags=["finance"])

def svc(db=Depends(get_db), user=Depends(get_current_user)):
    return FinanceService(db, user.id)

@router.get("/dashboard", response_model=DashboardStats)
def dashboard(service: FinanceService = Depends(svc)):
    return service.get_dashboard_stats()

@router.post("/expenses", response_model=ExpenseOut)
def create_expense(data: ExpenseCreate, service: FinanceService = Depends(svc)):
    return service.create_expense(data)

@router.get("/expenses", response_model=List[ExpenseOut])
def list_expenses(skip: int = 0, limit: int = 50, month: Optional[int] = None, year: Optional[int] = None, service: FinanceService = Depends(svc)):
    return service.get_expenses(skip, limit, month, year)

@router.put("/expenses/{expense_id}", response_model=ExpenseOut)
def update_expense(expense_id: UUID, data: ExpenseCreate, service: FinanceService = Depends(svc)):
    return service.update_expense(expense_id, data)

@router.delete("/expenses/{expense_id}")
def delete_expense(expense_id: UUID, service: FinanceService = Depends(svc)):
    service.delete_expense(expense_id)
    return {"status": "deleted"}

@router.post("/incomes", response_model=IncomeOut)
def create_income(data: IncomeCreate, service: FinanceService = Depends(svc)):
    return service.create_income(data)

@router.get("/incomes", response_model=List[IncomeOut])
def list_incomes(skip: int = 0, limit: int = 50, service: FinanceService = Depends(svc)):
    return service.get_incomes(skip, limit)

@router.post("/budgets", response_model=BudgetOut)
def create_budget(data: BudgetCreate, service: FinanceService = Depends(svc)):
    return service.create_budget(data)

@router.get("/budgets")
def list_budgets(month: int, year: int, service: FinanceService = Depends(svc)):
    return service.get_budgets(month, year)

@router.post("/goals", response_model=GoalOut)
def create_goal(data: GoalCreate, service: FinanceService = Depends(svc)):
    return service.create_goal(data)

@router.get("/goals", response_model=List[GoalOut])
def list_goals(service: FinanceService = Depends(svc)):
    return service.get_goals()
