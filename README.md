# FinSight 2.0

Advanced Fintech Analytics Dashboard with Hybrid SQL/ORM Architecture.

## Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL 14+

## Setup

### Backend
1. Navigate to `backend/`:
   ```bash
   cd backend
   ```
2. Create and activate virtual environment:
   ```bash
   python -m venv venv
   # Windows:
   .\venv\Scripts\activate
   # Mac/Linux:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure `.env`:
   - Copy `.env.example` (create one if missing) to `.env`.
   - Set `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB=finsight2`.

### Database
1. Make sure PostgreSQL is running and you have created the database `finsight2`.
2. Run migrations:
   ```bash
   alembic upgrade head
   ```
3. Seed database (requires CSVs in project root):
   ```bash
   python scripts/seed_database.py
   ```

### Frontend
1. Navigate to `frontend/`:
   ```bash
   cd frontend
   ```
2. Install dependencies (if not already done):
   ```bash
   npm install
   ```
3. Run development server:
   ```bash
   npm run dev
   ```

## Architecture
- **Backend**: FastAPI, SQLAlchemy (Hybrid ORM/Raw SQL), Alembic, Pydantic.
- **Frontend**: Next.js 13+ (App Router), Tailwind CSS, Framer Motion, Recharts.
- **ML**: Scikit-Learn (Offline training).
