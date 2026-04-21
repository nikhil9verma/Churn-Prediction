from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib, pandas as pd, numpy as np, shap

app = FastAPI(title="Bank Churn Predictor")

app.add_middleware(CORSMiddleware,
    allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

model = joblib.load('churn_model.pkl')
scaler = joblib.load('scaler.pkl')
feature_names = joblib.load('feature_names.pkl')
explainer = shap.TreeExplainer(model)

class Customer(BaseModel):
    CreditScore: float
    Gender: int          # 0=Female, 1=Male
    Age: float
    Tenure: float
    Balance: float
    NumOfProducts: int
    HasCrCard: int
    IsActiveMember: int
    EstimatedSalary: float
    Geography_Germany: int
    Geography_Spain: int

def make_decision(prob, salary):
    value = salary * 0.15
    if prob >= 0.70 and value >= 10000:
        return "CRITICAL", "Assign relationship manager. Call within 24 hours."
    elif prob >= 0.50:
        return "HIGH", "Send personalised retention email within 48 hours."
    elif prob >= 0.30:
        return "MEDIUM", "Add to monthly nurture campaign."
    else:
        return "LOW", "No immediate action needed."

@app.post("/predict")
def predict(customer: Customer):
    # build feature dict with engineered features
    data = customer.dict()
    df = pd.DataFrame([data])

    # add engineered features
    df['balance_salary_ratio'] = df['Balance'] / (df['EstimatedSalary'] + 1)
    df['is_senior'] = (df['Age'] >= 40).astype(int)
    df['has_zero_balance'] = (df['Balance'] == 0).astype(int)
    df['inactive_high_balance'] = (
        (df['IsActiveMember'] == 0) &
        (df['Balance'] > 50000)
    ).astype(int)
    df['products_per_year'] = df['NumOfProducts'] / (df['Tenure'] + 1)
    df['credit_category'] = pd.cut(df['CreditScore'],
        bins=[0,580,670,740,800,900], labels=[0,1,2,3,4]).astype(int)
    df['germany_inactive'] = (
        (df['Geography_Germany'] == 1) &
        (df['IsActiveMember'] == 0)
    ).astype(int)

    # align columns
    df = df.reindex(columns=feature_names, fill_value=0)

    prob = float(model.predict_proba(df)[0,1])
    priority, action = make_decision(prob, customer.EstimatedSalary)

    # SHAP for top 3 reasons
    shap_vals = explainer.shap_values(df)
    if isinstance(shap_vals, list):
        shap_vals = shap_vals[1]
    shap_series = pd.Series(shap_vals[0], index=feature_names)
    top_factors = shap_series.abs().nlargest(3).index.tolist()

    return {
        "churn_probability": round(prob, 4),
        "churn_percentage": f"{prob:.1%}",
        "will_churn": prob > 0.30,
        "priority": priority,
        "action": action,
        "top_factors": top_factors
    }

@app.get("/health")
def health():
    return {"status": "running", "model": "RF Churn Predictor v1"}
