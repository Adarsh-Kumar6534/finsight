import os
import joblib
import pandas as pd
from typing import List, Dict, Any

class MLService:
    def __init__(self):
        self.models_dir = os.path.join(os.path.dirname(__file__), '../ml_models')
        self.sla_model = None
        self.failure_model = None
        self.anomaly_model = None
        self.preprocessor = None
        self._load_models()

    def _load_models(self):
        try:
            print("Loading ML models...")
            self.sla_model = joblib.load(os.path.join(self.models_dir, 'sla_model.joblib'))
            self.failure_model = joblib.load(os.path.join(self.models_dir, 'failure_model.joblib'))
            
            anomaly_data = joblib.load(os.path.join(self.models_dir, 'anomaly_model.joblib'))
            self.anomaly_model = anomaly_data['model']
            # We don't need 'preprocessor' separately if we use the pipeline, 
            # but for Anomaly detection, the model itself doesn't include the preprocessor inside an sklearn Pipeline object 
            # as cleanly as classifiers in my training script.
            # In training script: 
            # processed_data = preprocessor.fit_transform(data) 
            # iso_forest.fit(processed_data)
            # So we need the preprocessor to transform new data before passing to iso_forest.predict
            self.anomaly_preprocessor = anomaly_data['preprocessor']

            print("ML models loaded successfully.")
        except Exception as e:
            print(f"Error loading models: {e}")
            # In production, we might want to fail hard or fallback to a dummy service

    def predict_sla_breach(self, features: Dict[str, Any]) -> Dict[str, Any]:
        """
        Predict probability of SLA breach.
        Features must include: amount, risk_rating, region
        """
        if not self.sla_model:
            return {"error": "Model not loaded"}
        
        df = pd.DataFrame([features])
        prob = self.sla_model.predict_proba(df)[0][1] # Probability of class 1 (Breach)
        prediction = int(prob > 0.5)
        
        return {
            "prediction": prediction,
            "probability": float(prob),
            "model_version": "v1"
        }

    def predict_failure(self, features: Dict[str, Any]) -> Dict[str, Any]:
        """
        Predict probability of transaction failure.
        Features must include: amount, risk_rating, region
        """
        if not self.failure_model:
            return {"error": "Model not loaded"}
        
        df = pd.DataFrame([features])
        prob = self.failure_model.predict_proba(df)[0][1] # Probability of class 1 (Failure)
        prediction = int(prob > 0.5)
        
        return {
            "prediction": prediction,
            "probability": float(prob),
            "model_version": "v1"
        }

    def detect_anomaly(self, features: Dict[str, Any]) -> Dict[str, Any]:
        """
        Detect if transaction is anomalous.
        Features must include: amount, risk_rating, region
        """
        if not self.anomaly_model:
            return {"error": "Model not loaded"}
        
        df = pd.DataFrame([features])
        
        # Transform features using the saved preprocessor
        X_processed = self.anomaly_preprocessor.transform(df)
        
        # Isolation Forest: -1 for anomalies, 1 for normal
        prediction = self.anomaly_model.predict(X_processed)[0]
        
        # Convert to 1 (Anomaly) vs 0 (Normal)
        is_anomaly = 1 if prediction == -1 else 0
        
        # Score_samples gives negative score, lower is more anomalous
        score = self.anomaly_model.score_samples(X_processed)[0]
        
        return {
            "is_anomaly": is_anomaly,
            "anomaly_score": float(score),
            "model_version": "v1"
        }

ml_service = MLService()
