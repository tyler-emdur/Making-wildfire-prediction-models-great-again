import requests
from datetime import datetime, timedelta
import numpy as np

def fetch_weather_data(lat, lng):
    """
    Fetch live weather data from Open-Meteo API
    """
    try:
        url = "https://api.open-meteo.com/v1/forecast"
        params = {
            'latitude': lat,
            'longitude': lng,
            'daily': 'temperature_2m_max,temperature_2m_min,precipitation_sum,relative_humidity_2m_mean',
            'past_days': 30,
            'timezone': 'auto'
        }
        
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        
        data = response.json()
        return data.get('daily', None)
        
    except Exception as e:
        print(f"Error fetching weather data: {e}")
        return None

def engineer_features(weather_data):
    """
    Transform raw weather data into ML features
    """
    if not weather_data:
        return None
    
    # Extract arrays
    temps_max = np.array(weather_data['temperature_2m_max'])
    temps_min = np.array(weather_data['temperature_2m_min'])
    precipitation = np.array(weather_data['precipitation_sum'])
    humidity = np.array(weather_data['relative_humidity_2m_mean'])
    
    # Convert Celsius to Fahrenheit
    temps_max_f = temps_max * 9/5 + 32
    temps_min_f = temps_min * 9/5 + 32
    
    # Calculate features
    avg_temperature = float(np.mean(temps_max_f))
    avg_humidity = float(np.mean(humidity))
    rain_30_day_total = float(np.sum(precipitation) / 25.4)
    temp_range = float(np.max(temps_max_f) - np.min(temps_min_f))
    
    # Calculate consecutive dry days
    dry_days = 0
    for precip in reversed(precipitation):
        if precip < 0.1:
            dry_days += 1
        else:
            break
    
    features = {
        'avg_temperature': avg_temperature,
        'avg_humidity': avg_humidity,
        'rain_30_day_total': rain_30_day_total,
        'dry_days': dry_days,
        'temp_range': temp_range
    }
    
    return features

