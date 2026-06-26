from pydantic import BaseModel
from typing import Optional, List
from uuid import UUID
from datetime import datetime

class ExpenseCreate(BaseModel):
    title: str
    amount: float
    category_id: Optional[UUID] = None
    date: datetime
    merchant: Optional[str] = None
    notes: Optional[str] = None
    payment_method: Optional[str] = None
    is_recurring: bool = False
    tags: Optional[str] = None
    location: Optional[str] = None

class ExpenseUpdate(ExpenseCreate):
    pass

class ExpenseOut(ExpenseCreate):
    id: UUID
    user_id: UUID
    currency: str
    ai_categorized: bool
    created_at: datetime
    category: Optional["CategoryOut"] = None

    class Config:
        from_attributes = True

class IncomeCreate(BaseModel):
    title: str
    amount: float
    source: Optional[str] = None
    date: datetime
    notes: Optional[str] = None
    is_recurring: bool = False

class IncomeOut(IncomeCreate):
    id: UUID
    user_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True

class CategoryOut(BaseModel):
    id: UUID
    name: str
    icon: Optional[str]
    color: Optional[str]

    class Config:
        from_attributes = True

class BudgetCreate(BaseModel):
    name: str
    amount: float
    category_id: Optional[UUID] = None
    month: int
    year: int

class BudgetOut(BudgetCreate):
    id: UUID
    user_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True

class GoalCreate(BaseModel):
    title: str
    target_amount: float
    current_amount: float = 0
    target_date: Optional[datetime] = None
    notes: Optional[str] = None

class GoalOut(GoalCreate):
    id: UUID
    user_id: UUID
    is_completed: bool
    created_at: datetime

    class Config:
        from_attributes = True

class DashboardStats(BaseModel):
    total_expenses_month: float
    total_income_month: float
    savings_month: float
    savings_rate: float
    top_categories: List[dict]
    recent_expenses: List[ExpenseOut]
    budget_utilization: List[dict]
    health_score: int
    health_label: str
