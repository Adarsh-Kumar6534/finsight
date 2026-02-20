import sys
import os
import pandas as pd
import numpy as np
import joblib
from sqlalchemy import create_engine
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler, OneHotEncoder, LabelEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer

# Add backend to sys.path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from app.core.config import settings

def train_models():
    print("Connecting to database...")
    # Create engine directly to use with pandas
    engine = create_engine(settings.sqlalchemy_database_uri)

    try:
        # 1. Fetch Data
        print("Fetching training data...")
        # Actually join transaction and client tables
        query = """
        SELECT 
            t.amount, 
            t.status, 
            t.sla_breach_flag,
            c.risk_rating, 
            c.region
        FROM transactions t
        JOIN clients c ON t.client_id = c.client_id
        LIMIT 50000
        """
        
        # Use pandas read_sql with connection context
        with engine.connect() as conn:
            df = pd.read_sql(query, conn)
        
        print(f"Data shape: {df.shape}")

        # Preprocessing
        # Target 1: SLA Breach (Binary)
        # Target 2: Status (Failed vs Success) -> Binary
        
        df['target_sla'] = df['sla_breach_flag'].astype(int)
        df['target_failure'] = (df['status'] == 'Failed').astype(int)
        
        # Features
        # Numerical: amount
        # Categorical: risk_rating, region
        
        numeric_features = ['amount']
        categorical_features = ['risk_rating', 'region']

        preprocessor = ColumnTransformer(
            transformers=[
                ('num', StandardScaler(), numeric_features),
                ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_features)
            ])

        # --- Model 1: SLA Breach Predictor (Logistic Regression) ---
        print("Training SLA Breach Predictor...")
        clf_sla = Pipeline(steps=[('preprocessor', preprocessor),
                                  ('classifier', LogisticRegression(max_iter=1000, class_weight='balanced'))])
        
        # If dataset is too imbalanced or small, this might be weak, but sufficient for demo
        clf_sla.fit(df[numeric_features + categorical_features], df['target_sla'])
        
        # --- Model 2: Failure Predictor (Logistic Regression) ---
        print("Training Failure Predictor...")
        clf_failure = Pipeline(steps=[('preprocessor', preprocessor),
                                      ('classifier', LogisticRegression(max_iter=1000, class_weight='balanced'))])
        
        clf_failure.fit(df[numeric_features + categorical_features], df['target_failure'])

        # --- Model 3: Anomaly Detector (Isolation Forest) ---
        print("Training Anomaly Detector...")
        # Isolation Forest only needs features, unsupervised
        # We process features first manually to pass to IF which doesn't support pipelines easily with raw data mixed types usually needs transforming first if we want to pipe.
        # But we can use the same preprocessor transform.
        
        X_processed = preprocessor.fit_transform(df[numeric_features + categorical_features])
        iso_forest = IsolationForest(contamination=0.05, random_state=42)
        iso_forest.fit(X_processed)

        # Save Models
        save_dir = os.path.join(os.path.dirname(__file__), '../app/ml_models')
        os.makedirs(save_dir, exist_ok=True)
        
        print(f"Saving models to {save_dir}...")
        joblib.dump(clf_sla, os.path.join(save_dir, 'sla_model.joblib'))
        joblib.dump(clf_failure, os.path.join(save_dir, 'failure_model.joblib'))
        # Save preprocessor and iso_forest separately or together? 
        # For IF, we need the preprocessor. Let's save a pipeline-like object or just valid objects.
        # Actually IF is not a transformer, it's an estimator.
        # We can bundle the preprocessor and the model.
        joblib.dump({'preprocessor': preprocessor, 'model': iso_forest}, os.path.join(save_dir, 'anomaly_model.joblib'))
        
        print("Training complete.")

    except Exception as e:
        print(f"Error training models: {e}")

if __name__ == "__main__":
    train_models()
