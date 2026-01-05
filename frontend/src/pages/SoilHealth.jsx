import { useState, useEffect } from 'react';

export default function SoilHealth() {
  const [activeTab, setActiveTab] = useState('predict');
  const [statistics, setStatistics] = useState(null);
  const [recentSamples, setRecentSamples] = useState([]);
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  
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
        setPrediction(data);
        setActiveTab('results');
      }
    } catch (error) {
      alert('Error making prediction: ' + error.message);
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
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Soil Health Analysis</h1>
        <p className="text-gray-600">Analyze soil conditions and get recommendations for potato cultivation</p>
      </div>

      {/* Statistics Cards */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg p-4 text-white shadow-md">
            <div className="text-sm opacity-90">Total Samples</div>
            <div className="text-3xl font-bold mt-1">{statistics.total_samples}</div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg p-4 text-white shadow-md">
            <div className="text-sm opacity-90">Locations</div>
            <div className="text-3xl font-bold mt-1">{statistics.total_locations}</div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg p-4 text-white shadow-md">
            <div className="text-sm opacity-90">Avg pH Level</div>
            <div className="text-3xl font-bold mt-1">{statistics.avg_ph?.toFixed(2)}</div>
          </div>
          
          <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-lg p-4 text-white shadow-md">
            <div className="text-sm opacity-90">Avg Moisture</div>
            <div className="text-3xl font-bold mt-1">{statistics.avg_moisture?.toFixed(1)}%</div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('predict')}
              className={`px-6 py-3 font-medium ${
                activeTab === 'predict'
                  ? 'border-b-2 border-green-500 text-green-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              🌱 Predict Suitability
            </button>
            <button
              onClick={() => setActiveTab('results')}
              className={`px-6 py-3 font-medium ${
                activeTab === 'results'
                  ? 'border-b-2 border-green-500 text-green-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              disabled={!prediction}
            >
              📊 Results & Recommendations
            </button>
            <button
              onClick={() => setActiveTab('analysis')}
              className={`px-6 py-3 font-medium ${
                activeTab === 'analysis'
                  ? 'border-b-2 border-green-500 text-green-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              📈 Data Analysis
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Prediction Form Tab */}
          {activeTab === 'predict' && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Enter Soil Parameters</h2>
              <p className="text-gray-600 mb-6">
                Fill in the soil parameters below to predict suitability for potato cultivation
              </p>

              <form onSubmit={handlePredict} className="space-y-6">
                {/* Soil Chemistry */}
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-3 flex items-center">
                    <span className="bg-green-100 text-green-700 rounded-full w-8 h-8 flex items-center justify-center mr-2 text-sm">1</span>
                    Soil Chemistry
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        pH Level
                      </label>
                      <input
                        type="number"
                        name="pH"
                        step="0.01"
                        min="4"
                        max="8"
                        value={formData.pH}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="5.5 - 6.5"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">Optimal: 5.5-6.5</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        EC (Electrical Conductivity)
                      </label>
                      <input
                        type="number"
                        name="EC"
                        step="0.001"
                        min="0"
                        value={formData.EC}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="0.05 - 0.25"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">dS/m</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nitrogen (N)
                      </label>
                      <input
                        type="number"
                        name="N"
                        step="0.1"
                        min="0"
                        value={formData.N}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="20 - 70"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">ppm</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phosphorus (P)
                      </label>
                      <input
                        type="number"
                        name="P"
                        step="0.1"
                        min="0"
                        value={formData.P}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="20 - 160"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">ppm</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Potassium (K)
                      </label>
                      <input
                        type="number"
                        name="K"
                        step="0.1"
                        min="0"
                        value={formData.K}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="100 - 400"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">ppm</p>
                    </div>
                  </div>
                </div>

                {/* Growth Stage */}
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-3 flex items-center">
                    <span className="bg-purple-100 text-purple-700 rounded-full w-8 h-8 flex items-center justify-center mr-2 text-sm">2</span>
                    Growth Stage
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Current Growth Stage
                      </label>
                      <select
                        name="Growth_Stage"
                        value={formData.Growth_Stage}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      >
                        <option value="Germination">Germination (0-3 weeks)</option>
                        <option value="Vegetative">Vegetative (3-6 weeks)</option>
                        <option value="Tuber_Initiation">Tuber Initiation (6-10 weeks)</option>
                        <option value="Maturation">Maturation (10-16 weeks)</option>
                      </select>
                      <p className="text-xs text-gray-500 mt-1">Select the current growth stage of your potato crop</p>
                    </div>
                  </div>
                </div>

                {/* Environmental Conditions */}
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-3 flex items-center">
                    <span className="bg-blue-100 text-blue-700 rounded-full w-8 h-8 flex items-center justify-center mr-2 text-sm">3</span>
                    Environmental Conditions
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Temperature (°C)
                      </label>
                      <input
                        type="number"
                        name="Temperature"
                        step="0.1"
                        min="0"
                        value={formData.Temperature}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="15 - 25"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">Optimal: 15-25°C</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Humidity (%)
                      </label>
                      <input
                        type="number"
                        name="Humidity"
                        step="0.1"
                        min="0"
                        max="100"
                        value={formData.Humidity}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="60 - 90"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">%</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Soil Moisture (%)
                      </label>
                      <input
                        type="number"
                        name="Moisture"
                        step="0.1"
                        min="0"
                        max="100"
                        value={formData.Moisture}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="40 - 75"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">Optimal: 40-75%</p>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-md font-medium hover:from-green-600 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                  >
                    {loading ? 'Analyzing...' : '🔍 Analyze Soil'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="bg-gray-200 text-gray-700 px-6 py-3 rounded-md font-medium hover:bg-gray-300 transition-all"
                  >
                    Reset
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Results Tab */}
          {activeTab === 'results' && prediction && (
            <div>
              <h2 className="text-xl font-semibold mb-6 text-gray-800">Analysis Results</h2>

              {/* Suitability Result Card */}
              <div className={`border-l-4 p-6 rounded-lg mb-6 shadow-md ${
                prediction.color === 'green' ? 'bg-green-50 border-green-500' :
                prediction.color === 'orange' ? 'bg-orange-50 border-orange-500' :
                'bg-red-50 border-red-500'
              }`}>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-2xl font-bold mb-2" style={{ color: prediction.color }}>
                      {prediction.label}
                    </h3>
                    <p className="text-gray-700 mb-3">{prediction.desc}</p>
                    {prediction.confidence && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-600">Confidence:</span>
                        <div className="bg-white rounded-full px-3 py-1 text-sm font-semibold" style={{ color: prediction.color }}>
                          {prediction.confidence.toFixed(1)}%
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="text-5xl">
                    {prediction.color === 'green' ? '✅' : prediction.color === 'orange' ? '⚠️' : '❌'}
                  </div>
                </div>
              </div>

              {/* Fertilizer Recommendations */}
              {prediction.recommendations && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  {/* Fertilizer Dosages */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-md">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
                      <span className="mr-2">🧪</span>
                      Recommended Fertilizers
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-green-50 rounded-md">
                        <span className="font-medium text-gray-700">Urea</span>
                        <span className="text-lg font-bold text-green-700">
                          {prediction.recommendations.urea} kg/acre
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded-md">
                        <span className="font-medium text-gray-700">TSP (Triple Super Phosphate)</span>
                        <span className="text-lg font-bold text-blue-700">
                          {prediction.recommendations.tsp} kg/acre
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-purple-50 rounded-md">
                        <span className="font-medium text-gray-700">MOP (Muriate of Potash)</span>
                        <span className="text-lg font-bold text-purple-700">
                          {prediction.recommendations.mop} kg/acre
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Items */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-md">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
                      <span className="mr-2">📋</span>
                      Recommended Actions
                    </h3>
                    <ul className="space-y-2">
                      {prediction.recommendations.actions.map((action, index) => (
                        <li key={index} className="flex items-start gap-2 text-gray-700">
                          <span className="text-green-500 mt-1">•</span>
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setActiveTab('predict')}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-md font-medium hover:from-green-600 hover:to-emerald-700 transition-all shadow-md"
                >
                  ← New Analysis
                </button>
                <button
                  onClick={() => window.print()}
                  className="bg-blue-500 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-600 transition-all shadow-md"
                >
                  🖨️ Print Report
                </button>
              </div>
            </div>
          )}

          {activeTab === 'results' && !prediction && (
            <div className="text-center py-12 text-gray-500">
              <div className="text-6xl mb-4">📊</div>
              <p>No results yet. Please analyze soil parameters first.</p>
              <button
                onClick={() => setActiveTab('predict')}
                className="mt-4 text-green-600 hover:text-green-700 font-medium"
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
  );
}
