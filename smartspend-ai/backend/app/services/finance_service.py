from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from datetime import datetime
from typing import List, Optional
from uuid import UUID
from app.models.models import Expense, Income, Budget, Goal, Category
from app.schemas.finance import ExpenseCreate, IncomeCreate, BudgetCreate, GoalCreate, DashboardStats

class FinanceService:
    def __init__(self, db: Session, user_id: UUID):
        self.db = db
        self.user_id = user_id

    # ── Expenses ──
    def create_expense(self, data: ExpenseCreate) -> Expense:
        expense = Expense(**data.model_dump(), user_id=self.user_id)
        self.db.add(expense)
        self.db.commit()
        self.db.refresh(expense)
        return expense

    def get_expenses(self, skip=0, limit=50, month: Optional[int] = None, year: Optional[int] = None) -> List[Expense]:
        q = self.db.query(Expense).filter(Expense.user_id == self.user_id)
        if month:
            q = q.filter(extract("month", Expense.date) == month)
        if year:
            q = q.filter(extract("year", Expense.date) == year)
        return q.order_by(Expense.date.desc()).offset(skip).limit(limit).all()

    def update_expense(self, expense_id: UUID, data: ExpenseCreate) -> Expense:
        expense = self.db.query(Expense).filter(Expense.id == expense_id, Expense.user_id == self.user_id).first()
        if not expense:
            from fastapi import HTTPException
            raise HTTPException(status_code=404, detail="Expense not found")
        for k, v in data.model_dump().items():
            setattr(expense, k, v)
        self.db.commit()
        self.db.refresh(expense)
        return expense

    def delete_expense(self, expense_id: UUID):
        expense = self.db.query(Expense).filter(Expense.id == expense_id, Expense.user_id == self.user_id).first()
        if expense:
            self.db.delete(expense)
            self.db.commit()

    # ── Income ──
    def create_income(self, data: IncomeCreate) -> Income:
        income = Income(**data.model_dump(), user_id=self.user_id)
        self.db.add(income)
        self.db.commit()
        self.db.refresh(income)
        return income

    def get_incomes(self, skip=0, limit=50) -> List[Income]:
        return self.db.query(Income).filter(Income.user_id == self.user_id).order_by(Income.date.desc()).offset(skip).limit(limit).all()

    # ── Budget ──
    def create_budget(self, data: BudgetCreate) -> Budget:
        budget = Budget(**data.model_dump(), user_id=self.user_id)
        self.db.add(budget)
        self.db.commit()
        self.db.refresh(budget)
        return budget

    def get_budgets(self, month: int, year: int) -> List[Budget]:
        return self.db.query(Budget).filter(Budget.user_id == self.user_id, Budget.month == month, Budget.year == year).all()

    # ── Goals ──
    def create_goal(self, data: GoalCreate) -> Goal:
        goal = Goal(**data.model_dump(), user_id=self.user_id)
        self.db.add(goal)
        self.db.commit()
        self.db.refresh(goal)
        return goal

    def get_goals(self) -> List[Goal]:
        return self.db.query(Goal).filter(Goal.user_id == self.user_id).all()

    # ── Dashboard ──
    def get_dashboard_stats(self) -> DashboardStats:
        now = datetime.utcnow()
        month, year = now.month, now.year

        expenses = self.db.query(func.sum(Expense.amount)).filter(
            Expense.user_id == self.user_id,
            extract("month", Expense.date) == month,
            extract("year", Expense.date) == year
        ).scalar() or 0

        income = self.db.query(func.sum(Income.amount)).filter(
            Income.user_id == self.user_id,
            extract("month", Income.date) == month,
            extract("year", Income.date) == year
        ).scalar() or 0

        savings = income - expenses
        savings_rate = round((savings / income * 100) if income > 0 else 0, 1)

        top_cats = self.db.query(Category.name, Category.color, func.sum(Expense.amount).label("total")).join(
            Expense, Expense.category_id == Category.id
        ).filter(Expense.user_id == self.user_id,
                 extract("month", Expense.date) == month,
                 extract("year", Expense.date) == year
        ).group_by(Category.id).order_by(func.sum(Expense.amount).desc()).limit(5).all()

        recent = self.db.query(Expense).filter(Expense.user_id == self.user_id).order_by(Expense.date.desc()).limit(5).all()

        score = self._health_score(savings_rate, expenses, income)

        return DashboardStats(
            total_expenses_month=round(expenses, 2),
            total_income_month=round(income, 2),
            savings_month=round(savings, 2),
            savings_rate=savings_rate,
            top_categories=[{"name": c.name, "color": c.color, "amount": float(c.total)} for c in top_cats],
            recent_expenses=recent,
            budget_utilization=[],
            health_score=score["score"],
            health_label=score["label"]
        )

    def _health_score(self, savings_rate: float, expenses: float, income: float) -> dict:
        score = 50
        if savings_rate >= 20: score += 20
        elif savings_rate >= 10: score += 10
        if income > 0 and expenses / income < 0.7: score += 15
        if savings_rate >= 30: score += 15
        score = min(100, max(0, score))
        label = "Excellent" if score >= 80 else "Good" if score >= 60 else "Fair" if score >= 40 else "Needs attention"
        return {"score": score, "label": label}
