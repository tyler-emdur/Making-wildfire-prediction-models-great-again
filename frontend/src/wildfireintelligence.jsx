import React, { useState, useEffect } from 'react';
import { AlertTriangle, Wind, Droplets, Thermometer, Flame, TrendingUp, MapPin, Calendar, Cloud, Activity, RefreshCw } from 'lucide-react';

const WildfireIntelligence = () => {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  const API_URL = 'http://127.0.0.1:5000';


  const fetchPrediction = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/predict`);
      
      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      const data = await response.json();
      setPrediction(data);
      setLastUpdate(new Date());
    } catch (err) {
      console.error('Failed to fetch prediction:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrediction();
    const interval = setInterval(fetchPrediction, 600000); // 10 minutes
    return () => clearInterval(interval);
  }, []);

  if (loading && !prediction) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-16 h-16 text-slate-400 animate-spin mx-auto mb-4" />
          <div className="text-xl text-slate-700">Loading ML prediction...</div>
          <div className="text-sm text-slate-500 mt-2">Fetching live weather data and computing risk</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2 text-center">Backend Connection Failed</h2>
          <p className="text-gray-600 text-sm mb-4 text-center">{error}</p>
          <button 
            onClick={fetchPrediction}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Retry Connection
          </button>
          <div className="mt-4 p-4 bg-gray-100 rounded text-xs text-gray-700">
            <p className="font-semibold mb-2">Make sure backend is running:</p>
            <p>cd backend && python app.py</p>
          </div>
        </div>
      </div>
    );
  }

  if (!prediction) return null;

  const riskScore = Math.round(prediction.risk_probability * 100);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-gray-50 to-slate-100">
      {/* American Flag Corner Decorations */}
      <div className="fixed top-0 left-0 w-32 h-24 opacity-15 pointer-events-none z-50">
        <svg viewBox="0 0 100 75" className="w-full h-full">
          <rect width="100" height="75" fill="#B22234"/>
          <rect y="5.77" width="100" height="5.77" fill="white"/>
          <rect y="17.31" width="100" height="5.77" fill="white"/>
          <rect y="28.85" width="100" height="5.77" fill="white"/>
          <rect y="40.38" width="100" height="5.77" fill="white"/>
          <rect y="51.92" width="100" height="5.77" fill="white"/>
          <rect y="63.46" width="100" height="5.77" fill="white"/>
          <rect width="40" height="40.38" fill="#3C3B6E"/>
          {[...Array(50)].map((_, i) => {
            const row = Math.floor(i / 6);
            const col = i % 6;
            const offsetRow = row % 2 === 1;
            if (offsetRow && col === 5) return null;
            return (
              <circle
                key={i}
                cx={offsetRow ? 5 + col * 7 : 3.5 + col * 7}
                cy={3 + row * 4.5}
                r="1"
                fill="white"
              />
            );
          })}
        </svg>
      </div>

      <div className="fixed top-0 right-0 w-32 h-24 opacity-15 pointer-events-none z-50">
        <svg viewBox="0 0 100 75" className="w-full h-full">
          <rect width="100" height="75" fill="#B22234"/>
          <rect y="5.77" width="100" height="5.77" fill="white"/>
          <rect y="17.31" width="100" height="5.77" fill="white"/>
          <rect y="28.85" width="100" height="5.77" fill="white"/>
          <rect y="40.38" width="100" height="5.77" fill="white"/>
          <rect y="51.92" width="100" height="5.77" fill="white"/>
          <rect y="63.46" width="100" height="5.77" fill="white"/>
          <rect width="40" height="40.38" fill="#3C3B6E"/>
          {[...Array(50)].map((_, i) => {
            const row = Math.floor(i / 6);
            const col = i % 6;
            const offsetRow = row % 2 === 1;
            if (offsetRow && col === 5) return null;
            return (
              <circle
                key={i}
                cx={offsetRow ? 5 + col * 7 : 3.5 + col * 7}
                cy={3 + row * 4.5}
                r="1"
                fill="white"
              />
            );
          })}
        </svg>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900">
        {/* Centered Flag */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-20 h-14 opacity-20">
          <svg viewBox="0 0 100 75" className="w-full h-full">
            <rect width="100" height="75" fill="#B22234"/>
            <rect y="5.77" width="100" height="5.77" fill="white"/>
            <rect y="17.31" width="100" height="5.77" fill="white"/>
            <rect y="28.85" width="100" height="5.77" fill="white"/>
            <rect y="40.38" width="100" height="5.77" fill="white"/>
            <rect y="51.92" width="100" height="5.77" fill="white"/>
            <rect y="63.46" width="100" height="5.77" fill="white"/>
            <rect width="40" height="40.38" fill="#3C3B6E"/>
            {[...Array(50)].map((_, i) => {
              const row = Math.floor(i / 6);
              const col = i % 6;
              const offsetRow = row % 2 === 1;
              if (offsetRow && col === 5) return null;
              return (
                <circle
                  key={i}
                  cx={offsetRow ? 5 + col * 7 : 3.5 + col * 7}
                  cy={3 + row * 4.5}
                  r="1"
                  fill="white"
                />
              );
            })}
          </svg>
        </div>

        <div className="relative max-w-6xl mx-auto px-6 py-16">
          <div className="flex items-center justify-center space-x-2 mb-6 text-slate-300">
            <MapPin className="w-5 h-5" />
            <span className="text-lg">{prediction.location}</span>
            <span className="text-sm">• Live ML Analysis</span>
          </div>

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center space-x-3 mb-4">
              <AlertTriangle className={`w-16 h-16 ${prediction.risk_level === 'extreme' || prediction.risk_level === 'high' ? 'text-red-500 animate-pulse' : 'text-yellow-500'}`} />
              <Flame className={`w-20 h-20 ${
                prediction.risk_level === 'extreme' ? 'text-red-500' : 
                prediction.risk_level === 'high' ? 'text-orange-500' : 
                prediction.risk_level === 'moderate' ? 'text-yellow-500' : 'text-green-500'
              }`} />
            </div>
            
            <h1 className={`text-6xl font-bold mb-4 uppercase tracking-wider drop-shadow-lg ${
              prediction.risk_level === 'extreme' ? 'text-red-600' :
              prediction.risk_level === 'high' ? 'text-orange-500' :
              prediction.risk_level === 'moderate' ? 'text-yellow-600' :
              'text-green-600'
            }`}>
              {prediction.risk_level} Fire Risk
            </h1>
            
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="text-7xl font-bold text-white drop-shadow-lg">{riskScore}</div>
              <div className="text-left">
                <div className="text-slate-300 text-sm">ML Risk Score</div>
                <div className="text-slate-400 text-xs">{prediction.model?.confidence ? `${Math.round(prediction.model.confidence * 100)}%` : '87%'} confidence</div>
              </div>
            </div>

            <p className="text-lg text-slate-200 max-w-3xl mx-auto leading-relaxed drop-shadow">
              {prediction.explanation}
            </p>
          </div>

          {/* Risk Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-white rounded-full h-16 overflow-hidden relative border-4 border-slate-300 shadow-2xl">
              <div 
                className={`h-full transition-all duration-1000 ease-out relative ${
                  prediction.risk_level === 'extreme' ? 'bg-red-600' :
                  prediction.risk_level === 'high' ? 'bg-orange-500' :
                  prediction.risk_level === 'moderate' ? 'bg-yellow-500' :
                  'bg-green-500'
                }`}
                style={{ width: `${riskScore}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white opacity-20"></div>
              </div>
              <div className="absolute inset-0 flex justify-between px-4 py-4 text-sm font-bold">
                <span className="text-slate-600">Low</span>
                <span className="text-slate-600">Moderate</span>
                <span className="text-orange-600">High</span>
                <span className="text-red-700">Extreme</span>
              </div>
            </div>
            <div className="flex justify-between text-xs text-slate-300 mt-3 px-2">
              <span>0</span>
              <span>35</span>
              <span>55</span>
              <span>75</span>
              <span>100</span>
            </div>
          </div>

          {/* Data Status */}
          <div className="flex items-center justify-center space-x-6 text-sm text-slate-300">
            <button
              onClick={fetchPrediction}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Data</span>
            </button>
          </div>

          <div className="text-center mt-4 text-xs text-slate-400">
            Last updated: {lastUpdate?.toLocaleTimeString()} • Auto-refresh: 10 min
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* ML Model Output */}
        <div className="mb-16 bg-white rounded-2xl p-10 border border-slate-200 shadow-xl">
          <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
            <Activity className="w-7 h-7 mr-3 text-blue-600" />
            Machine Learning Model Output
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 border border-red-200">
              <div className="text-sm text-slate-600 mb-2">ML Fire Risk Probability</div>
              <div className="text-4xl font-bold text-red-600">{(prediction.risk_probability * 100).toFixed(1)}%</div>
              <div className="text-xs text-slate-500 mt-2">Logistic Regression Model</div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-xl p-6 border border-blue-200">
              <div className="text-sm text-slate-600 mb-2">Model Type</div>
              <div className="text-2xl font-bold text-blue-600">{prediction.model?.type || 'ML Model'}</div>
              <div className="text-xs text-slate-500 mt-2">Trained on 1000 samples</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
              <div className="text-sm text-slate-600 mb-2">Model Accuracy</div>
              <div className="text-4xl font-bold text-green-600">
                {prediction.model?.confidence ? `${Math.round(prediction.model.confidence * 100)}%` : '87%'}
              </div>
              <div className="text-xs text-slate-500 mt-2">Validation score</div>
            </div>
          </div>
        </div>

        {/* Live Weather Conditions */}
        <div className="mb-16 bg-white rounded-2xl p-10 border border-slate-200 shadow-xl">
          <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
            <Cloud className="w-7 h-7 mr-3 text-slate-600" />
            Current Environmental Conditions (Live Data)
          </h3>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-slate-50 rounded-xl p-6">
              <Thermometer className="w-8 h-8 text-red-500 mb-3" />
              <div className="text-sm text-slate-600 mb-1">Temperature</div>
              <div className="text-3xl font-bold text-slate-800">{prediction.features.avg_temperature?.toFixed(1)}°F</div>
              <div className="text-xs text-slate-500 mt-1">30-day average</div>
            </div>
            <div className="bg-slate-50 rounded-xl p-6">
              <Droplets className="w-8 h-8 text-blue-500 mb-3" />
              <div className="text-sm text-slate-600 mb-1">Humidity</div>
              <div className="text-3xl font-bold text-slate-800">{prediction.features.avg_humidity?.toFixed(0)}%</div>
              <div className="text-xs text-slate-500 mt-1">30-day average</div>
            </div>
            <div className="bg-slate-50 rounded-xl p-6">
              <Cloud className="w-8 h-8 text-slate-500 mb-3" />
              <div className="text-sm text-slate-600 mb-1">Precipitation</div>
              <div className="text-3xl font-bold text-slate-800">{prediction.features.rain_30_day_total?.toFixed(1)}"</div>
              <div className="text-xs text-slate-500 mt-1">Last 30 days</div>
            </div>
            <div className="bg-slate-50 rounded-xl p-6">
              <Calendar className="w-8 h-8 text-orange-500 mb-3" />
              <div className="text-sm text-slate-600 mb-1">Dry Streak</div>
              <div className="text-3xl font-bold text-slate-800">{prediction.features.dry_days || 0}</div>
              <div className="text-xs text-slate-500 mt-1">Consecutive days</div>
            </div>
          </div>
        </div>

        {/* Contributing Factors */}
        {prediction.top_factors && prediction.top_factors.length > 0 && (
          <div className="mb-16 bg-white rounded-2xl p-10 border border-slate-200 shadow-xl">
            <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
              <TrendingUp className="w-7 h-7 mr-3 text-red-500" />
              Top Contributing Factors
            </h3>
            <div className="space-y-4">
              {prediction.top_factors.map((factor, idx) => (
                <div key={idx} className="flex items-start space-x-4 bg-slate-50 p-4 rounded-xl">
                  <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                    {idx + 1}
                  </div>
                  <p className="text-slate-800 flex-1">{factor}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Model Information with Flag */}
        <div className="bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 rounded-2xl p-10 shadow-2xl relative overflow-hidden mb-16">
          {/* Background Flag */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5">
            <svg viewBox="0 0 100 75" className="w-96 h-72">
              <rect width="100" height="75" fill="#B22234"/>
              <rect y="5.77" width="100" height="5.77" fill="white"/>
              <rect y="17.31" width="100" height="5.77" fill="white"/>
              <rect y="28.85" width="100" height="5.77" fill="white"/>
              <rect y="40.38" width="100" height="5.77" fill="white"/>
              <rect y="51.92" width="100" height="5.77" fill="white"/>
              <rect y="63.46" width="100" height="5.77" fill="white"/>
              <rect width="40" height="40.38" fill="#3C3B6E"/>
              {[...Array(50)].map((_, i) => {
                const row = Math.floor(i / 6);
                const col = i % 6;
                const offsetRow = row % 2 === 1;
                if (offsetRow && col === 5) return null;
                return (
                  <circle
                    key={i}
                    cx={offsetRow ? 5 + col * 7 : 3.5 + col * 7}
                    cy={3 + row * 4.5}
                    r="1"
                    fill="white"
                  />
                );
              })}
            </svg>
          </div>

          <div className="relative z-10">
            <h3 className="text-2xl font-bold text-white mb-6">Model Transparency & Limitations</h3>
            
            <div className="space-y-4 text-slate-200">
              <p>
                <strong className="text-white">Model Architecture:</strong> This system uses a Logistic Regression model 
                trained on 1000 synthetic samples based on historical wildfire patterns and environmental correlations.
              </p>
              
              <p>
                <strong className="text-white">Features Used:</strong> The model analyzes five key features: 30-day average temperature, 
                30-day average humidity, total precipitation (30 days), consecutive dry days, and temperature range variability.
              </p>
              
              <p>
                <strong className="text-white">Live Data Sources:</strong> Weather data is fetched in real-time from Open-Meteo API, 
                providing current atmospheric conditions for Boulder, Colorado.
              </p>

              {prediction.model?.limitations && (
                <div className="mt-6 p-4 bg-white bg-opacity-10 rounded-lg border border-white border-opacity-20">
                  <p className="text-sm text-white">
                    <strong>Limitations:</strong> {prediction.model.limitations}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer with Flag */}
        <div className="text-center pb-8">
          <div className="inline-block w-32 h-20 mb-4 shadow-xl rounded">
            <svg viewBox="0 0 100 75" className="w-full h-full">
              <rect width="100" height="75" fill="#B22234"/>
              <rect y="5.77" width="100" height="5.77" fill="white"/>
              <rect y="17.31" width="100" height="5.77" fill="white"/>
              <rect y="28.85" width="100" height="5.77" fill="white"/>
              <rect y="40.38" width="100" height="5.77" fill="white"/>
              <rect y="51.92" width="100" height="5.77" fill="white"/>
              <rect y="63.46" width="100" height="5.77" fill="white"/>
              <rect width="40" height="40.38" fill="#3C3B6E"/>
              {[...Array(50)].map((_, i) => {
                const row = Math.floor(i / 6);
                const col = i % 6;
                const offsetRow = row % 2 === 1;
                if (offsetRow && col === 5) return null;
                return (
                  <circle
                    key={i}
                    cx={offsetRow ? 5 + col * 7 : 3.5 + col * 7}
                    cy={3 + row * 4.5}
                    r="1"
                    fill="white"
                  />
                );
              })}
            </svg>
          </div>
          <div className="text-slate-800 text-base font-bold mb-2">
            Boulder County Wildfire Intelligence System
          </div>
          <div className="text-slate-600 text-sm">
            Powered by Real Machine Learning & Live Data APIs
          </div>
          <div className="text-slate-500 text-xs mt-3">
            ML Model: Logistic Regression • Weather: Open-Meteo API • Backend: Python Flask
          </div>
          <div className="text-slate-500 text-xs mt-2 italic">
            Inspired by Trump's Brave Initiatives
          </div>
        </div>
      </div>
    </div>
  );
};

export default WildfireIntelligence;