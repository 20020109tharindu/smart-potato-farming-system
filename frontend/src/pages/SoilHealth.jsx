import { useState, useEffect } from 'react';

export default function SoilHealth() {
  const [activeTab, setActiveTab] = useState('predict');
  const [statistics, setStatistics] = useState(null);
  const [recentSamples, setRecentSamples] = useState([]);
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    pH: '',
    EC: '',
    P: '',
    K: '',
    Temperature: '',
    Humidity: '',
    Moisture: '',
    N: '',
    Growth_Stage: 'Germination'
  });

  // Fetch statistics on mount
  useEffect(() => {
    fetchStatistics();
    fetchRecentSamples();
  }, []);

  const fetchStatistics = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/soil/statistics');
      const data = await response.json();
      if (!data.error) {
        setStatistics(data);
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const fetchRecentSamples = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/soil/recent?limit=5');
      const data = await response.json();
      if (!data.error && data.samples) {
        setRecentSamples(data.samples);
      }
    } catch (error) {
      console.error('Error fetching recent samples:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAnalyzing(true);
    setPrediction(null);

    try {
      const response = await fetch('http://127.0.0.1:5000/api/soil/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (data.error) {
        alert('Error: ' + data.error);
      } else {
        // Simulate analysis delay for better UX
        setTimeout(() => {
          setPrediction(data);
          setActiveTab('results');
          setAnalyzing(false);
        }, 1500);
      }
    } catch (error) {
      alert('Error making prediction: ' + error.message);
      setAnalyzing(false);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      pH: '',
      EC: '',
      P: '',
      K: '',
      Temperature: '',
      Humidity: '',
      Moisture: '',
      N: '',
      Growth_Stage: 'Germination'
    });
    setPrediction(null);
    setActiveTab('predict');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <div className="p-6">
        {/* Modern Header with Animation */}
        <div className="mb-8 text-center animate-fade-in">
          <div className="inline-block mb-4">
            <div className="text-6xl animate-bounce">🌱</div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent mb-3">
            Soil Health Analysis
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            🔬 Advanced AI-powered soil analysis for optimal potato cultivation
          </p>
        </div>

        {/* Animated Loading Overlay */}
        {analyzing && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-md mx-4 text-center transform animate-scale-in">
              <div className="relative w-32 h-32 mx-auto mb-6">
                <div className="absolute inset-0 border-8 border-emerald-200 rounded-full"></div>
                <div className="absolute inset-0 border-8 border-t-emerald-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl animate-pulse">🧪</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Analyzing Soil Data</h3>
              <p className="text-gray-600 mb-4">Our AI is processing your soil parameters...</p>
              <div className="flex justify-center gap-1">
                <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
              </div>
            </div>
          </div>
        )}

        {/* Modern Statistics Cards with Icons */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-slide-up">
            <div className="group bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer">
              <div className="flex justify-between items-start mb-3">
                <div className="text-4xl group-hover:scale-125 transition-transform duration-300">📊</div>
                <div className="bg-white bg-opacity-20 rounded-full px-3 py-1 text-xs font-semibold backdrop-blur-sm">
                  Total
                </div>
              </div>
              <div className="text-sm opacity-90 mb-1">Total Samples</div>
              <div className="text-4xl font-bold">{statistics.total_samples}</div>
            </div>
            
            <div className="group bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer">
              <div className="flex justify-between items-start mb-3">
                <div className="text-4xl group-hover:scale-125 transition-transform duration-300">📍</div>
                <div className="bg-white bg-opacity-20 rounded-full px-3 py-1 text-xs font-semibold backdrop-blur-sm">
                  Sites
                </div>
              </div>
              <div className="text-sm opacity-90 mb-1">Locations</div>
              <div className="text-4xl font-bold">{statistics.total_locations}</div>
            </div>
            
            <div className="group bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer">
              <div className="flex justify-between items-start mb-3">
                <div className="text-4xl group-hover:scale-125 transition-transform duration-300">⚗️</div>
                <div className="bg-white bg-opacity-20 rounded-full px-3 py-1 text-xs font-semibold backdrop-blur-sm">
                  pH
                </div>
              </div>
              <div className="text-sm opacity-90 mb-1">Avg pH Level</div>
              <div className="text-4xl font-bold">{statistics.avg_ph?.toFixed(2)}</div>
            </div>
            
            <div className="group bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer">
              <div className="flex justify-between items-start mb-3">
                <div className="text-4xl group-hover:scale-125 transition-transform duration-300">💧</div>
                <div className="bg-white bg-opacity-20 rounded-full px-3 py-1 text-xs font-semibold backdrop-blur-sm">
                  Moisture
                </div>
              </div>
              <div className="text-sm opacity-90 mb-1">Avg Moisture</div>
              <div className="text-4xl font-bold">{statistics.avg_moisture?.toFixed(1)}%</div>
            </div>
          </div>
        )}

        {/* Modern Tabs with Icons */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex overflow-x-auto">
              <button
                onClick={() => setActiveTab('predict')}
                className={`flex items-center gap-2 px-6 py-4 font-semibold transition-all duration-300 whitespace-nowrap ${
                  activeTab === 'predict'
                    ? 'border-b-4 border-emerald-500 text-emerald-600 bg-emerald-50'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <span className="text-xl">🌱</span>
                <span>Predict Suitability</span>
              </button>
              <button
                onClick={() => setActiveTab('results')}
                className={`flex items-center gap-2 px-6 py-4 font-semibold transition-all duration-300 whitespace-nowrap ${
                  activeTab === 'results'
                    ? 'border-b-4 border-emerald-500 text-emerald-600 bg-emerald-50'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
                disabled={!prediction}
              >
                <span className="text-xl">📊</span>
                <span>Results & Recommendations</span>
                {prediction && <span className="bg-emerald-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">✓</span>}
              </button>
              <button
                onClick={() => setActiveTab('analysis')}
                className={`flex items-center gap-2 px-6 py-4 font-semibold transition-all duration-300 whitespace-nowrap ${
                  activeTab === 'analysis'
                    ? 'border-b-4 border-emerald-500 text-emerald-600 bg-emerald-50'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <span className="text-xl">📈</span>
                <span>Data Analysis</span>
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-8">
          {/* Prediction Form Tab */}
          {activeTab === 'predict' && (
            <div className="animate-fade-in">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Enter Soil Parameters</h2>
                <p className="text-gray-600">
                  Fill in the soil parameters below to get AI-powered suitability predictions 🎯
                </p>
              </div>

              <form onSubmit={handlePredict} className="space-y-8 max-w-6xl mx-auto">
                {/* Soil Chemistry Section */}
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 shadow-lg border-2 border-emerald-200">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                    <span className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg shadow-lg">⚗️</span>
                    <span>Soil Chemistry Parameters</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                      <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                        <span className="text-lg">🔬</span>
                        pH Level
                      </label>
                      <input
                        type="text"
                        inputMode="decimal"
                        name="pH"
                        value={formData.pH}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                        placeholder="e.g., 6.49"
                        required
                      />
                      <p className="text-xs text-emerald-600 mt-2 font-medium">✓ Optimal: 5.5-6.5</p>
                    </div>

                    <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                      <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                        <span className="text-lg">⚡</span>
                        EC (Conductivity)
                      </label>
                      <input
                        type="text"
                        inputMode="decimal"
                        name="EC"
                        value={formData.EC}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                        placeholder="e.g., 0.042"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-2">dS/m</p>
                    </div>

                    <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                      <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                        <span className="text-lg">🧪</span>
                        Nitrogen (N)
                      </label>
                      <input
                        type="text"
                        inputMode="decimal"
                        name="N"
                        value={formData.N}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                        placeholder="e.g., 40.2"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-2">ppm</p>
                    </div>

                    <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                      <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                        <span className="text-lg">💎</span>
                        Phosphorus (P)
                      </label>
                      <input
                        type="text"
                        inputMode="decimal"
                        name="P"
                        value={formData.P}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                        placeholder="e.g., 43.4"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-2">ppm</p>
                    </div>

                    <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                      <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                        <span className="text-lg">🔋</span>
                        Potassium (K)
                      </label>
                      <input
                        type="text"
                        inputMode="decimal"
                        name="K"
                        value={formData.K}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                        placeholder="e.g., 250.4"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-2">ppm</p>
                    </div>
                  </div>
                </div>

                {/* Growth Stage Section */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 shadow-lg border-2 border-purple-200">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                    <span className="bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg shadow-lg">🌿</span>
                    <span>Growth Stage Selection</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-xl transition-all duration-300">
                      <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                        <span className="text-lg">📅</span>
                        Current Growth Stage
                      </label>
                      <select
                        name="Growth_Stage"
                        value={formData.Growth_Stage}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 font-medium"
                        required
                      >
                        <option value="Germination">🌱 Germination (0-3 weeks)</option>
                        <option value="Vegetative">🌿 Vegetative (3-6 weeks)</option>
                        <option value="Tuber_Initiation">🥔 Tuber Initiation (6-10 weeks)</option>
                        <option value="Maturation">🌾 Maturation (10-16 weeks)</option>
                      </select>
                      <p className="text-xs text-purple-600 mt-2 font-medium">Select the current stage of crop development</p>
                    </div>
                  </div>
                </div>

                {/* Environmental Conditions Section */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 shadow-lg border-2 border-blue-200">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                    <span className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg shadow-lg">🌦️</span>
                    <span>Environmental Conditions</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                      <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                        <span className="text-lg">🌡️</span>
                        Temperature (°C)
                      </label>
                      <input
                        type="text"
                        inputMode="decimal"
                        name="Temperature"
                        value={formData.Temperature}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        placeholder="e.g., 23.4"
                        required
                      />
                      <p className="text-xs text-blue-600 mt-2 font-medium">✓ Optimal: 15-25°C</p>
                    </div>

                    <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                      <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                        <span className="text-lg">💨</span>
                        Humidity (%)
                      </label>
                      <input
                        type="text"
                        inputMode="decimal"
                        name="Humidity"
                        value={formData.Humidity}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        placeholder="e.g., 76.5"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-2">%</p>
                    </div>

                    <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                      <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                        <span className="text-lg">💧</span>
                        Soil Moisture (%)
                      </label>
                      <input
                        type="text"
                        inputMode="decimal"
                        name="Moisture"
                        value={formData.Moisture}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        placeholder="e.g., 61.4"
                        required
                      />
                      <p className="text-xs text-blue-600 mt-2 font-medium">✓ Optimal: 40-75%</p>
                    </div>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-4 justify-center">
                  <button
                    type="submit"
                    disabled={loading}
                    className="group relative bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 text-white px-10 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center gap-3">
                      <span className="text-2xl">🔍</span>
                      {loading ? 'Analyzing...' : 'Analyze Soil Health'}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-teal-700 to-cyan-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="bg-white text-gray-700 px-8 py-4 rounded-xl font-bold text-lg border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transform hover:-translate-y-1 transition-all duration-300 shadow-lg"
                  >
                    🔄 Reset Form
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Results Tab */}
          {activeTab === 'results' && prediction && (
            <div className="animate-fade-in">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Analysis Results</h2>
                <p className="text-gray-600">AI-powered soil suitability assessment completed</p>
              </div>

              {/* Main Suitability Result Card with Animation */}
              <div className={`relative overflow-hidden rounded-2xl shadow-2xl mb-8 transform hover:scale-105 transition-all duration-500 ${
                prediction.color === 'green' ? 'bg-gradient-to-br from-emerald-50 to-teal-100 border-4 border-emerald-400' :
                prediction.color === 'orange' ? 'bg-gradient-to-br from-orange-50 to-amber-100 border-4 border-orange-400' :
                'bg-gradient-to-br from-red-50 to-pink-100 border-4 border-red-400'
              }`}>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-24 -mb-24"></div>
                
                <div className="relative p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="text-6xl animate-bounce">
                          {prediction.color === 'green' ? '✅' : prediction.color === 'orange' ? '⚠️' : '❌'}
                        </div>
                        <div>
                          <h3 className="text-4xl font-extrabold" style={{ 
                            background: `linear-gradient(to right, ${prediction.color}, ${prediction.color === 'green' ? '#059669' : prediction.color === 'orange' ? '#ea580c' : '#dc2626'})`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                          }}>
                            {prediction.label}
                          </h3>
                          <p className="text-lg text-gray-700 mt-1 font-medium">{prediction.desc}</p>
                        </div>
                      </div>
                      {prediction.confidence && (
                        <div className="flex items-center gap-3 mt-4">
                          <span className="text-sm font-bold text-gray-700">🎯 Confidence Score:</span>
                          <div className="flex-1 bg-white bg-opacity-50 rounded-full h-4 overflow-hidden shadow-inner">
                            <div 
                              className={`h-full rounded-full transition-all duration-1000 ease-out ${
                                prediction.color === 'green' ? 'bg-gradient-to-r from-emerald-500 to-teal-600' :
                                prediction.color === 'orange' ? 'bg-gradient-to-r from-orange-500 to-amber-600' :
                                'bg-gradient-to-r from-red-500 to-pink-600'
                              }`}
                              style={{ width: `${prediction.confidence}%` }}
                            ></div>
                          </div>
                          <span className="text-xl font-bold" style={{ color: prediction.color }}>
                            {prediction.confidence.toFixed(1)}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Fertilizer Recommendations Grid */}
              {prediction.recommendations && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  {/* Fertilizer Dosages Card */}
                  <div className="bg-white rounded-2xl p-8 shadow-2xl border-2 border-gray-200 hover:shadow-3xl transition-all duration-300">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full p-3">
                        <span className="text-3xl">🧪</span>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800">Fertilizer Recommendations</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="group relative bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-5 border-2 border-emerald-200 hover:border-emerald-400 transform hover:-translate-y-1 transition-all duration-300 shadow-md hover:shadow-xl">
                        <div className="absolute top-3 right-3 opacity-20 group-hover:opacity-40 transition-opacity">
                          <span className="text-4xl">🌾</span>
                        </div>
                        <div className="flex justify-between items-center relative z-10">
                          <div>
                            <span className="font-bold text-lg text-gray-800 block">Urea</span>
                            <span className="text-sm text-gray-600">Nitrogen Fertilizer</span>
                          </div>
                          <div className="text-right">
                            <div className="text-3xl font-extrabold text-emerald-600">
                              {prediction.recommendations.urea}
                            </div>
                            <span className="text-sm font-semibold text-gray-600">kg/acre</span>
                          </div>
                        </div>
                      </div>

                      <div className="group relative bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border-2 border-blue-200 hover:border-blue-400 transform hover:-translate-y-1 transition-all duration-300 shadow-md hover:shadow-xl">
                        <div className="absolute top-3 right-3 opacity-20 group-hover:opacity-40 transition-opacity">
                          <span className="text-4xl">💎</span>
                        </div>
                        <div className="flex justify-between items-center relative z-10">
                          <div>
                            <span className="font-bold text-lg text-gray-800 block">TSP</span>
                            <span className="text-sm text-gray-600">Triple Super Phosphate</span>
                          </div>
                          <div className="text-right">
                            <div className="text-3xl font-extrabold text-blue-600">
                              {prediction.recommendations.tsp}
                            </div>
                            <span className="text-sm font-semibold text-gray-600">kg/acre</span>
                          </div>
                        </div>
                      </div>

                      <div className="group relative bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-5 border-2 border-purple-200 hover:border-purple-400 transform hover:-translate-y-1 transition-all duration-300 shadow-md hover:shadow-xl">
                        <div className="absolute top-3 right-3 opacity-20 group-hover:opacity-40 transition-opacity">
                          <span className="text-4xl">🔋</span>
                        </div>
                        <div className="flex justify-between items-center relative z-10">
                          <div>
                            <span className="font-bold text-lg text-gray-800 block">MOP</span>
                            <span className="text-sm text-gray-600">Muriate of Potash</span>
                          </div>
                          <div className="text-right">
                            <div className="text-3xl font-extrabold text-purple-600">
                              {prediction.recommendations.mop}
                            </div>
                            <span className="text-sm font-semibold text-gray-600">kg/acre</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Guidelines Card */}
                  <div className="bg-white rounded-2xl p-8 shadow-2xl border-2 border-gray-200 hover:shadow-3xl transition-all duration-300">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full p-3">
                        <span className="text-3xl">📋</span>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800">Action Guidelines</h3>
                    </div>
                    <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                      {prediction.recommendations.actions.map((action, index) => (
                        <div 
                          key={index} 
                          className="group flex items-start gap-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border-l-4 border-emerald-500 hover:border-emerald-600 shadow-md hover:shadow-lg transform hover:-translate-x-1 transition-all duration-300"
                        >
                          <div className="flex-shrink-0 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-lg w-8 h-8 rounded-full flex items-center justify-center shadow-lg">
                            {index + 1}
                          </div>
                          <span className="text-gray-800 leading-relaxed font-medium">{action}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 justify-center flex-wrap">
                <button
                  onClick={() => setActiveTab('predict')}
                  className="group bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-3"
                >
                  <span className="text-2xl group-hover:animate-pulse">🔄</span>
                  New Analysis
                </button>
                <button
                  onClick={() => window.print()}
                  className="group bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-3"
                >
                  <span className="text-2xl group-hover:animate-pulse">🖨️</span>
                  Print Report
                </button>
              </div>
            </div>
          )}

          {activeTab === 'results' && !prediction && (
            <div className="text-center py-16 animate-fade-in">
              <div className="text-8xl mb-6 animate-bounce">📊</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">No Results Yet</h3>
              <p className="text-gray-600 mb-6">Please analyze soil parameters first to see predictions</p>
              <button
                onClick={() => setActiveTab('predict')}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              >
                Go to Prediction Form →
              </button>
            </div>
          )}

          {/* Analysis Tab */}
          {activeTab === 'analysis' && (
            <div>
              <h2 className="text-xl font-semibold mb-6 text-gray-800">Historical Data Analysis</h2>

              {/* Suitability Distribution */}
              {statistics && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-md">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Soil Suitability Distribution</h3>
                    <div className="space-y-3">
                      {Object.entries(statistics.suitability_distribution).map(([key, value]) => {
                        const labels = {
                          '0': 'Not Suitable',
                          '1': 'Marginally Suitable',
                          '2': 'Suitable'
                        };
                        const colors = {
                          '0': 'bg-red-500',
                          '1': 'bg-orange-500',
                          '2': 'bg-green-500'
                        };
                        const percentage = ((value / statistics.total_samples) * 100).toFixed(1);
                        
                        return (
                          <div key={key}>
                            <div className="flex justify-between mb-1 text-sm">
                              <span className="font-medium text-gray-700">{labels[key]}</span>
                              <span className="text-gray-600">{value} ({percentage}%)</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`${colors[key]} h-2 rounded-full transition-all`}
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-md">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Average Nutrient Levels</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                        <span className="font-medium text-gray-700">Nitrogen (N)</span>
                        <span className="text-lg font-bold text-gray-800">
                          {statistics.avg_nitrogen?.toFixed(1)} ppm
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                        <span className="font-medium text-gray-700">Phosphorus (P)</span>
                        <span className="text-lg font-bold text-gray-800">
                          {statistics.avg_phosphorus?.toFixed(1)} ppm
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                        <span className="font-medium text-gray-700">Potassium (K)</span>
                        <span className="text-lg font-bold text-gray-800">
                          {statistics.avg_potassium?.toFixed(1)} ppm
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Recent Samples */}
              {recentSamples.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-md">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">Recent Soil Samples</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-gray-50">
                          <th className="text-left p-3 font-medium text-gray-700">Location</th>
                          <th className="text-left p-3 font-medium text-gray-700">Date</th>
                          <th className="text-left p-3 font-medium text-gray-700">pH</th>
                          <th className="text-left p-3 font-medium text-gray-700">N</th>
                          <th className="text-left p-3 font-medium text-gray-700">P</th>
                          <th className="text-left p-3 font-medium text-gray-700">K</th>
                          <th className="text-left p-3 font-medium text-gray-700">Suitability</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentSamples.map((sample, index) => (
                          <tr key={index} className="border-b hover:bg-gray-50">
                            <td className="p-3">{sample.Location}</td>
                            <td className="p-3">{sample.Collection_Date}</td>
                            <td className="p-3">{sample.pH}</td>
                            <td className="p-3">{sample.N}</td>
                            <td className="p-3">{sample.P}</td>
                            <td className="p-3">{sample.K}</td>
                            <td className="p-3">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                sample.Soil_Suitability === 2 ? 'bg-green-100 text-green-700' :
                                sample.Soil_Suitability === 1 ? 'bg-orange-100 text-orange-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {sample.Soil_Suitability === 2 ? 'Suitable' :
                                 sample.Soil_Suitability === 1 ? 'Marginal' : 'Not Suitable'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}
