# SmartSpend AI

> Your AI-powered personal finance operating system

## Stack

| Layer | Tech |
|---|---|
| Frontend | React 19 + TypeScript + Vite + Material UI |
| Backend | FastAPI + Python + PostgreSQL |
| AI | OpenAI GPT (optional) |
| Deploy | Vercel (frontend) + Railway (backend + DB) |

## Deploy in 15 minutes

### Step 1 — Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/smartspend-ai.git
git push -u origin main
```

### Step 2 — Deploy backend on Railway

1. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
2. Select `smartspend-ai` repo → Select the `backend` folder
3. Add **PostgreSQL** plugin → copy `DATABASE_URL`
4. Add **Redis** plugin → copy `REDIS_URL`
5. Set environment variables:

```
DATABASE_URL=         (from Railway Postgres plugin)
REDIS_URL=            (from Railway Redis plugin)
SECRET_KEY=           (any random 32+ char string)
REFRESH_SECRET_KEY=   (any random 32+ char string)
FRONTEND_URL=         (your Vercel URL, set after step 3)
OPENAI_API_KEY=       (optional — add later)
```

6. Railway auto-detects Python and runs `uvicorn app.main:app`
7. Copy your Railway backend URL (e.g. `https://smartspend-xxx.railway.app`)

### Step 3 — Deploy frontend on Vercel

1. Go to [vercel.com](https://vercel.com) → New Project → Import from GitHub
2. Select `smartspend-ai` repo → Set **Root Directory** to `frontend`
3. Set environment variable:

```
VITE_API_URL=https://YOUR_RAILWAY_URL.railway.app/api
```

4. Deploy → copy your Vercel URL
5. Go back to Railway → update `FRONTEND_URL` with your Vercel URL

### Step 4 — Add OpenAI (when ready)

In Railway environment variables, add:
```
OPENAI_API_KEY=sk-...
```

All AI features activate instantly — no redeployment needed.

## Local development

```bash
# Backend
cd backend
cp .env.example .env   # fill in values
pip install -r requirements.txt
uvicorn app.main:app --reload

# Frontend
cd frontend
cp .env.example .env
npm install
npm run dev
```

## Features

- Auth (email + Google OAuth)
- Dashboard with KPI cards + charts
- Expense tracking with categories
- Income tracking
- Financial goals tracker
- AI chat advisor (requires OpenAI key)
- Financial health score
