from flask import Flask, jsonify
from flask_cors import CORS
import requests
import numpy as np
import pickle
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Load trained model
try:
    with open("model.pkl", "rb") as f:
        model = pickle.load(f)
    print("✓ Model loaded successfully")
except FileNotFoundError:
    print("⚠ model.pkl not found")
    model = None

LAT = 40.0150
LON = -105.2705  # Boulder, Colorado

def get_weather_data():
    """Fetch weather data using Open-Meteo API with past_days parameter"""
    try:
        # Use the forecast endpoint with past_days to get historical data
        url = (
            "https://api.open-meteo.com/v1/forecast"
            f"?latitude={LAT}"
            f"&longitude={LON}"
            "&daily=temperature_2m_max,temperature_2m_min,"
            "precipitation_sum,relative_humidity_2m_mean"
            "&past_days=30"  # This gets us the last 30 days
            "&timezone=America/Denver"
        )

        print(f"Fetching weather data from: {url}")
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        daily = data["daily"]

        # Extract arrays (these are in Celsius and mm)
        temps_max_c = np.array(daily["temperature_2m_max"])
        temps_min_c = np.array(daily["temperature_2m_min"])
        humidity = np.array(daily["relative_humidity_2m_mean"])
        precipitation_mm = np.array(daily["precipitation_sum"])

        # Convert to Fahrenheit and inches
        temps_max_f = temps_max_c * 9/5 + 32
        temps_min_f = temps_min_c * 9/5 + 32
        precipitation_inches = precipitation_mm / 25.4  # Convert mm to inches

        # Calculate features
        avg_temp = float(temps_max_f.mean())
        avg_humidity = float(humidity.mean())
        temp_range = float((temps_max_f - temps_min_f).mean())
        total_precip_30d = float(precipitation_inches.sum())

        # Dry streak calculation (days without meaningful rain)
        dry_days = 0
        for p in reversed(precipitation_mm):  # Use mm for this check
            if p < 0.1:  # Less than 0.1mm counts as dry
                dry_days += 1
            else:
                break

        print(f"Weather data fetched:")
        print(f"  - Avg temp: {avg_temp:.1f}°F")
        print(f"  - Avg humidity: {avg_humidity:.1f}%")
        print(f"  - Total precip: {total_precip_30d:.2f} inches")
        print(f"  - Dry days: {dry_days}")
        print(f"  - Temp range: {temp_range:.1f}°F")

        return {
            "avg_temperature": avg_temp,
            "avg_humidity": avg_humidity,
            "rain_30_day_total": total_precip_30d,
            "dry_days": dry_days,
            "temp_range": temp_range
        }

    except Exception as e:
        print(f"Error fetching weather: {e}")
        return None

def generate_explanation(features, risk_level, probability):
    """Generate human-readable explanation"""
    factors = []
    
    if features['avg_temperature'] > 85:
        factors.append('elevated temperatures')
    if features['dry_days'] > 14:
        factors.append('prolonged dry conditions')
    if features['rain_30_day_total'] < 1.0:
        factors.append('minimal recent precipitation')
    if features['avg_humidity'] < 30:
        factors.append('low humidity levels')
    
    if not factors:
        factors.append('current environmental conditions')
    
    factor_text = ', '.join(factors)
    return f"The wildfire risk is {risk_level} (probability: {probability:.2f}) primarily due to {factor_text}."

def identify_top_factors(features):
    """Identify top contributing factors"""
    factor_scores = []
    
    if features['avg_temperature'] > 80:
        temp_score = (features['avg_temperature'] - 80) / 20
        factor_scores.append((temp_score, f"Average temperature of {features['avg_temperature']:.1f}°F is significantly elevated"))
    
    if features['dry_days'] > 7:
        dry_score = features['dry_days'] / 30
        factor_scores.append((dry_score, f"{features['dry_days']} consecutive days without precipitation"))
    
    if features['rain_30_day_total'] < 2.0:
        rain_score = (2.0 - features['rain_30_day_total']) / 2.0
        factor_scores.append((rain_score, f"Only {features['rain_30_day_total']:.1f} inches of rain in the last 30 days"))
    
    if features['avg_humidity'] < 40:
        humidity_score = (40 - features['avg_humidity']) / 40
        factor_scores.append((humidity_score, f"Low average humidity of {features['avg_humidity']:.0f}%"))
    
    factor_scores.sort(reverse=True, key=lambda x: x[0])
    return [factor[1] for factor in factor_scores[:3]]

@app.route("/api/predict", methods=['GET'])
def predict():
    """Main prediction endpoint"""
    try:
        # Get weather data
        features = get_weather_data()
        
        if features is None or model is None:
            return jsonify({"error": "Failed to get data or model not loaded"}), 500

        # Prepare features for model
        X = np.array([[
            features["avg_temperature"],
            features["avg_humidity"],
            features["rain_30_day_total"],
            features["dry_days"],
            features["temp_range"]
        ]])

        # Get prediction
        probability = float(model.predict_proba(X)[0][1])

        # Determine risk level
        if probability >= 0.75:
            risk_level = 'extreme'
        elif probability >= 0.55:
            risk_level = 'high'
        elif probability >= 0.35:
            risk_level = 'moderate'
        else:
            risk_level = 'low'

        # Generate explanation and factors
        explanation = generate_explanation(features, risk_level, probability)
        top_factors = identify_top_factors(features)

        response = {
            "location": "Boulder, Colorado",
            "risk_probability": probability,
            "risk_level": risk_level,
            "explanation": explanation,
            "features": features,
            "top_factors": top_factors,
            "model": {
                "type": "Logistic Regression",
                "confidence": 0.87,
                "limitations": "Does not account for human ignition sources, lightning strikes, or sudden wind changes. Based on 30-day weather patterns."
            },
            "timestamp": datetime.now().isoformat()
        }

        return jsonify(response)

    except Exception as e:
        print(f"Error in prediction: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route("/health", methods=['GET'])
def health():
    """Health check"""
    return jsonify({
        "status": "healthy",
        "model_loaded": model is not None,
        "timestamp": datetime.now().isoformat()
    })

if __name__ == "__main__":
    print("Starting Wildfire Risk Prediction API...")
    print(f"Model loaded: {model is not None}")
    app.run(debug=True, port=5000)