from app.core.config import settings
from typing import Optional

MOCK_RESPONSES = {
    "default": "I'm your SmartSpend AI assistant! Connect your OpenAI API key in settings to unlock full AI insights — spending analysis, predictions, and personalized advice.",
    "waste": "To identify wasteful spending, I'd analyze your transaction history across categories. Add your OpenAI key to get personalized insights!",
    "save": "Smart saving strategies depend on your income and spending patterns. Connect OpenAI to get a tailored saving plan.",
}

class AIService:
    def __init__(self):
        self.enabled = bool(settings.OPENAI_API_KEY)
        if self.enabled:
            from openai import OpenAI
            self.client = OpenAI(api_key=settings.OPENAI_API_KEY)

    def chat(self, message: str, context: dict) -> str:
        if not self.enabled:
            for key, response in MOCK_RESPONSES.items():
                if key in message.lower():
                    return response
            return MOCK_RESPONSES["default"]
        
        system_prompt = f"""You are SmartSpend AI, a personal finance advisor.
User financial context:
- Monthly expenses: ₹{context.get('total_expenses_month', 0)}
- Monthly income: ₹{context.get('total_income_month', 0)}
- Savings rate: {context.get('savings_rate', 0)}%
- Health score: {context.get('health_score', 0)}/100
Top spending categories: {context.get('top_categories', [])}
Answer concisely and helpfully. Use ₹ for currency. Be specific with numbers."""

        response = self.client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": message}
            ],
            max_tokens=500
        )
        return response.choices[0].message.content

    def categorize_expense(self, merchant: str, title: str) -> Optional[str]:
        if not self.enabled:
            rules = {
                "swiggy": "Food", "zomato": "Food", "amazon": "Shopping",
                "uber": "Travel", "ola": "Travel", "netflix": "Entertainment",
                "spotify": "Entertainment", "apollo": "Healthcare",
                "myntra": "Shopping", "flipkart": "Shopping",
            }
            key = (merchant or title).lower()
            for k, v in rules.items():
                if k in key:
                    return v
            return None

        response = self.client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": f"Categorize this expense into one of: Food, Travel, Shopping, Entertainment, Healthcare, Utilities, Education, Other. Merchant: {merchant}, Title: {title}. Reply with just the category name."}],
            max_tokens=10
        )
        return response.choices[0].message.content.strip()

    def predict_month_end(self, daily_avg: float, days_remaining: int, current_spend: float) -> dict:
        predicted = current_spend + (daily_avg * days_remaining)
        return {"predicted_total": round(predicted, 2), "daily_avg": round(daily_avg, 2)}
