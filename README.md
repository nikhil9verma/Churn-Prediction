# Bank Churn Predictor

A full-stack application leveraging Machine Learning to predict customer churn probability, built with a FastAPI backend and a React (Vite) frontend.

## Architecture

- **Frontend**: React + Vite (Custom Vanilla CSS for dark mode/glassmorphism design)
- **Backend**: FastAPI
- **ML Model**: Scikit-Learn Pipeline loaded via `joblib`, SHAP for feature explainability

## Local Development

### 1. Backend (FastAPI)
```bash
cd backend
python -m venv venv
# Windows: .\venv\Scripts\activate | Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```
The API will be available at `http://localhost:8000`.

### 2. Frontend (React)
```bash
cd frontend
npm install
npm run dev
```
The React app will be available at `http://localhost:5173`.

---

## Deployment Guide (Railway + Vercel)

### Deploying the Backend (Railway)
1. Push your code to a GitHub repository.
2. Log in to [Railway](https://railway.app/).
3. Click **New Project** -> **Deploy from GitHub repo**.
4. Select your repository.
5. Railway will automatically detect the Python environment. However, because your backend is in a subfolder, you need to configure the root directory:
   - Go to **Settings** -> **Deploy** -> **Root Directory** and set it to `/backend`.
6. Railway uses the `uvicorn main:app` command automatically when it sees `fastapi` in `requirements.txt`.
7. Once deployed, Railway will provide a public URL (e.g., `https://your-backend-url.up.railway.app`).

### Deploying the Frontend (Vercel)
1. Log in to [Vercel](https://vercel.com/).
2. Click **Add New** -> **Project**.
3. Import your GitHub repository.
4. Set the **Framework Preset** to `Vite`.
5. Set the **Root Directory** to `frontend`.
6. **IMPORTANT**: Update the backend URL in `frontend/src/App.jsx` from `http://localhost:8000/predict` to your new live Railway backend URL before pushing.
7. Click **Deploy**. Vercel will automatically build and provide a live URL.

## Live Links (To be updated after deployment)
- **Frontend App**: `[Pending]`
- **Backend API**: `[Pending]`
