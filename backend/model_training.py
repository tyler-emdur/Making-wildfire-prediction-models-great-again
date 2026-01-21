import pickle
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report

def generate_training_data():
    """Generate synthetic training data based on wildfire patterns"""
    np.random.seed(42)
    n_samples = 1000
    
    # Generate features
    avg_temperature = np.random.normal(75, 15, n_samples)
    avg_humidity = np.random.normal(45, 20, n_samples)
    rain_30_day_total = np.abs(np.random.normal(2, 2, n_samples))
    dry_days = np.random.randint(0, 45, n_samples)
    temp_range = np.random.normal(30, 10, n_samples)
    
    X = np.column_stack([
        avg_temperature,
        avg_humidity,
        rain_30_day_total,
        dry_days,
        temp_range
    ])
    
    # Generate target based on fire risk logic
    y = np.zeros(n_samples)
    for i in range(n_samples):
        risk_score = 0
        
        if avg_temperature[i] > 85:
            risk_score += 2
        elif avg_temperature[i] > 75:
            risk_score += 1
        
        if avg_humidity[i] < 30:
            risk_score += 2
        elif avg_humidity[i] < 40:
            risk_score += 1
        
        if rain_30_day_total[i] < 0.5:
            risk_score += 2
        elif rain_30_day_total[i] < 1.5:
            risk_score += 1
        
        if dry_days[i] > 21:
            risk_score += 2
        elif dry_days[i] > 14:
            risk_score += 1
        
        if temp_range[i] > 40:
            risk_score += 1
        
        y[i] = 1 if risk_score >= 4 else 0
    
    return X, y

def train_model():
    """Train logistic regression model"""
    print("Generating training data...")
    X, y = generate_training_data()
    
    print(f"Dataset: {len(X)} samples")
    print(f"High risk samples: {int(y.sum())} ({y.mean()*100:.1f}%)")
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    print("\nTraining Logistic Regression model...")
    model = LogisticRegression(random_state=42, max_iter=1000)
    model.fit(X_train, y_train)
    
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    
    print(f"\nModel Accuracy: {accuracy:.3f}")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred, target_names=['Low Risk', 'High Risk']))
    
    with open('model.pkl', 'wb') as f:
        pickle.dump(model, f)
    print("\n✓ Model saved to model.pkl")
    
    return model

if __name__ == '__main__':
    train_model()