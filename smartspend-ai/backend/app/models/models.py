import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, Float, Text, ForeignKey, Enum, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db.session import Base
import enum

class AuthProvider(str, enum.Enum):
    email = "email"
    google = "google"
    github = "github"

class TransactionType(str, enum.Enum):
    expense = "expense"
    income = "income"

class User(Base):
    __tablename__ = "users"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    full_name = Column(String(255), nullable=False)
    hashed_password = Column(String(255), nullable=True)
    avatar_url = Column(Text, nullable=True)
    auth_provider = Column(Enum(AuthProvider), default=AuthProvider.email)
    provider_id = Column(String(255), nullable=True)
    is_verified = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    currency = Column(String(10), default="INR")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    expenses = relationship("Expense", back_populates="user", cascade="all, delete")
    incomes = relationship("Income", back_populates="user", cascade="all, delete")
    budgets = relationship("Budget", back_populates="user", cascade="all, delete")
    goals = relationship("Goal", back_populates="user", cascade="all, delete")

class Category(Base):
    __tablename__ = "categories"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False)
    icon = Column(String(50), nullable=True)
    color = Column(String(20), nullable=True)
    type = Column(Enum(TransactionType), nullable=False)
    is_default = Column(Boolean, default=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    expenses = relationship("Expense", back_populates="category")

class Expense(Base):
    __tablename__ = "expenses"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    category_id = Column(UUID(as_uuid=True), ForeignKey("categories.id"), nullable=True)
    title = Column(String(255), nullable=False)
    amount = Column(Float, nullable=False)
    currency = Column(String(10), default="INR")
    date = Column(DateTime, nullable=False)
    merchant = Column(String(255), nullable=True)
    notes = Column(Text, nullable=True)
    payment_method = Column(String(50), nullable=True)
    is_recurring = Column(Boolean, default=False)
    tags = Column(Text, nullable=True)
    receipt_url = Column(Text, nullable=True)
    location = Column(String(255), nullable=True)
    ai_categorized = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    user = relationship("User", back_populates="expenses")
    category = relationship("Category", back_populates="expenses")

class Income(Base):
    __tablename__ = "incomes"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    title = Column(String(255), nullable=False)
    amount = Column(Float, nullable=False)
    source = Column(String(100), nullable=True)
    date = Column(DateTime, nullable=False)
    notes = Column(Text, nullable=True)
    is_recurring = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    user = relationship("User", back_populates="incomes")

class Budget(Base):
    __tablename__ = "budgets"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    category_id = Column(UUID(as_uuid=True), ForeignKey("categories.id"), nullable=True)
    name = Column(String(255), nullable=False)
    amount = Column(Float, nullable=False)
    month = Column(Integer, nullable=False)
    year = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    user = relationship("User", back_populates="budgets")

class Goal(Base):
    __tablename__ = "goals"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    title = Column(String(255), nullable=False)
    target_amount = Column(Float, nullable=False)
    current_amount = Column(Float, default=0)
    target_date = Column(DateTime, nullable=True)
    notes = Column(Text, nullable=True)
    is_completed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    user = relationship("User", back_populates="goals")

class AIConversation(Base):
    __tablename__ = "ai_conversations"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    message = Column(Text, nullable=False)
    response = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
