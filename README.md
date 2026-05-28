# Wildfire Intelligence

Wildfire risk predictor for Boulder, Colorado. A scikit-learn model trained on historical wildfire occurrence data is served via a Flask API; it ingests real-time weather from Open-Meteo (temperature, humidity, precipitation over the past 30 days) and outputs a current fire risk level. A React/Vite frontend visualizes the risk score, contributing weather factors, and historical context.

## Tech Stack

- **Backend**: Python, Flask, scikit-learn, NumPy, Open-Meteo API
- **Frontend**: React 19, Vite, Tailwind CSS v4, Lucide icons
- **Model**: Pre-trained `model.pkl` (scikit-learn classifier trained on InFORM fire occurrence GeoJSON data)
- **Weather**: Open-Meteo (free, no API key required)

## Setup

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

The Flask server starts on [http://localhost:5000](http://localhost:5000). No environment variables are needed — Open-Meteo is keyless and the model is loaded from `model.pkl` at startup.

### Frontend

In a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## How It Works

### Model
Trained on `InFORM_FireOccurrence_Public` GeoJSON data, which contains historical wildfire records. The model uses temperature, humidity, and precipitation as input features. Training is in `model_training.py`; the fitted model is serialized to `model.pkl`.

### Live prediction
`app.py` fetches the last 30 days of daily weather for Boulder (40.0150°N, 105.2705°W) from Open-Meteo on each request, converts units, and feeds the most recent conditions into the model to produce a risk score.

### Frontend
Displays the current risk level with contributing weather factors. Built as a single `WildfireIntelligence` component — no routing, no state management library.

## Status

**Demo only** — model is trained and API is functional. Last updated January 2026.
