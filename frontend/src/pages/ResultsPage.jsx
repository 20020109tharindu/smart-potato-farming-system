import { useEffect, useState } from "react";

export default function ResultsPage() {
  const [data, setData] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      // In actual app, get from navigation state or sessionStorage
      const mockForm = {
        season_type: "0",
        district: "Nuwara Eliya",
        field_size_acres: "3",
        potato_variety: "0",
        soil_type: "2",
        planned_fertilizer_kg_per_acre: "150",
        seed_cost_lkr: "45000",
        fertilizer_cost_lkr: "30000",
        labor_cost_lkr: "75000",
        hands_on_money_lkr: "200000",
      };

      setData(mockForm);

      if (!mockForm) {
        setResult(null);
        setLoading(false);
        return;
      }

      // Convert safely to numbers
      const fieldSize = Number(mockForm.field_size_acres || 0);
      const fertilizer = Number(mockForm.planned_fertilizer_kg_per_acre || 0);
      const marketPrice = 180; // Default market price

      const seedCost = Number(mockForm.seed_cost_lkr || 0);
      const fertCost = Number(mockForm.fertilizer_cost_lkr || 0);
      const laborCost = Number(mockForm.labor_cost_lkr || 0);

      const moneyAtHand = Number(mockForm.hands_on_money_lkr || 0);

      // SIMPLE SAMPLE FORMULA (Replace with backend model)
      const yieldKg = fieldSize * (1800 + (fertilizer - 50) * 10);

      const revenue = yieldKg * marketPrice;
      const cost = seedCost + fertCost + laborCost;
      const profit = revenue - cost;

      const feasible = cost <= moneyAtHand;

      setResult({
        yieldKg,
        revenue,
        cost,
        profit,
        feasible,
        price: marketPrice,
      });

      setLoading(false);
    }, 800);
  }, []);

  const handleNewPrediction = () => {
    // In actual app: nav("/")
    window.location.reload();
  };

  const handleViewRecommendations = () => {
    // In actual app: nav("/recommendations")
    alert("Navigate to recommendations page");
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600 mb-4'></div>
          <p className='text-gray-600 text-lg'>Analyzing your farm data...</p>
        </div>
      </div>
    );
  }

  if (result === null) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4'>
        <div className='bg-white rounded-2xl shadow-xl p-8 max-w-md text-center'>
          <div className='text-6xl mb-4'>📋</div>
          <h2 className='text-2xl font-bold text-gray-800 mb-3'>
            No Data Found
          </h2>
          <p className='text-gray-600 mb-6'>
            Please fill out the input form first to get your yield and profit
            predictions.
          </p>
          <button
            onClick={handleNewPrediction}
            className='bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transform transition hover:scale-105'
          >
            Go to Input Form
          </button>
        </div>
      </div>
    );
  }

  const profitPercentage =
    result.cost > 0 ? (result.profit / result.cost) * 100 : 0;
  const yieldPerAcre = data
    ? result.yieldKg / Number(data.field_size_acres)
    : 0;

  return (
    <div className='min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8 px-4'>
      <div className='max-w-5xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-8'>
          <div className='inline-block bg-green-100 rounded-full p-4 mb-4'>
            <svg
              className='w-12 h-12 text-green-600'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
          </div>
          <h1 className='text-4xl font-bold text-gray-800 mb-2'>
            Prediction Results
          </h1>
          <p className='text-gray-600'>
            Here's your estimated yield and profit analysis
          </p>
        </div>

        {/* Feasibility Alert */}
        {result.feasible ? (
          <div className='bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-lg shadow-md'>
            <div className='flex items-center'>
              <svg
                className='h-6 w-6 mr-3'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                  clipRule='evenodd'
                />
              </svg>
              <div>
                <p className='font-bold'>✅ Feasible Plan</p>
                <p className='text-sm'>
                  Your available capital is sufficient to cover all costs!
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className='bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg shadow-md'>
            <div className='flex items-center'>
              <svg
                className='h-6 w-6 mr-3'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                  clipRule='evenodd'
                />
              </svg>
              <div>
                <p className='font-bold'>⚠️ Not Feasible</p>
                <p className='text-sm'>
                  Your available capital may not be sufficient. Consider
                  reducing costs or increasing budget.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Key Metrics Cards */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
          {/* Yield Card */}
          <div className='bg-white rounded-xl shadow-lg p-6 border-t-4 border-blue-500 transform transition hover:scale-105'>
            <div className='flex items-center justify-between mb-2'>
              <span className='text-3xl'>🌾</span>
              <span className='text-xs font-semibold text-gray-500 uppercase'>
                Estimated Yield
              </span>
            </div>
            <p className='text-3xl font-bold text-gray-800'>
              {result.yieldKg.toLocaleString()}
            </p>
            <p className='text-sm text-gray-600'>kg total</p>
            <p className='text-xs text-gray-500 mt-1'>
              {yieldPerAcre.toFixed(0)} kg/acre
            </p>
          </div>

          {/* Revenue Card */}
          <div className='bg-white rounded-xl shadow-lg p-6 border-t-4 border-green-500 transform transition hover:scale-105'>
            <div className='flex items-center justify-between mb-2'>
              <span className='text-3xl'>💵</span>
              <span className='text-xs font-semibold text-gray-500 uppercase'>
                Revenue
              </span>
            </div>
            <p className='text-3xl font-bold text-green-600'>
              LKR {result.revenue.toLocaleString()}
            </p>
            <p className='text-sm text-gray-600'>Expected income</p>
            <p className='text-xs text-gray-500 mt-1'>
              @ LKR {result.price}/kg
            </p>
          </div>

          {/* Cost Card */}
          <div className='bg-white rounded-xl shadow-lg p-6 border-t-4 border-orange-500 transform transition hover:scale-105'>
            <div className='flex items-center justify-between mb-2'>
              <span className='text-3xl'>💰</span>
              <span className='text-xs font-semibold text-gray-500 uppercase'>
                Total Cost
              </span>
            </div>
            <p className='text-3xl font-bold text-orange-600'>
              LKR {result.cost.toLocaleString()}
            </p>
            <p className='text-sm text-gray-600'>Investment needed</p>
          </div>

          {/* Profit Card */}
          <div
            className={`bg-white rounded-xl shadow-lg p-6 border-t-4 ${
              result.profit >= 0 ? "border-purple-500" : "border-red-500"
            } transform transition hover:scale-105`}
          >
            <div className='flex items-center justify-between mb-2'>
              <span className='text-3xl'>
                {result.profit >= 0 ? "📈" : "📉"}
              </span>
              <span className='text-xs font-semibold text-gray-500 uppercase'>
                Net Profit
              </span>
            </div>
            <p
              className={`text-3xl font-bold ${
                result.profit >= 0 ? "text-purple-600" : "text-red-600"
              }`}
            >
              LKR {result.profit.toLocaleString()}
            </p>
            <p className='text-sm text-gray-600'>
              {result.profit >= 0 ? "Expected profit" : "Expected loss"}
            </p>
            <p
              className={`text-xs mt-1 font-semibold ${
                profitPercentage >= 0 ? "text-purple-600" : "text-red-600"
              }`}
            >
              {profitPercentage >= 0 ? "+" : ""}
              {profitPercentage.toFixed(1)}% ROI
            </p>
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className='bg-white rounded-2xl shadow-xl p-8 mb-6'>
          <h2 className='text-2xl font-bold text-gray-800 mb-6 flex items-center'>
            <span className='text-3xl mr-3'>📊</span>
            Cost Breakdown
          </h2>

          <div className='space-y-4'>
            <div className='flex items-center justify-between p-4 bg-blue-50 rounded-lg'>
              <div className='flex items-center'>
                <div className='w-3 h-3 bg-blue-500 rounded-full mr-3'></div>
                <span className='font-medium text-gray-700'>Seed Cost</span>
              </div>
              <span className='text-lg font-semibold text-gray-800'>
                LKR {Number(data.seed_cost_lkr).toLocaleString()}
              </span>
            </div>

            <div className='flex items-center justify-between p-4 bg-green-50 rounded-lg'>
              <div className='flex items-center'>
                <div className='w-3 h-3 bg-green-500 rounded-full mr-3'></div>
                <span className='font-medium text-gray-700'>
                  Fertilizer Cost
                </span>
              </div>
              <span className='text-lg font-semibold text-gray-800'>
                LKR {Number(data.fertilizer_cost_lkr).toLocaleString()}
              </span>
            </div>

            <div className='flex items-center justify-between p-4 bg-amber-50 rounded-lg'>
              <div className='flex items-center'>
                <div className='w-3 h-3 bg-amber-500 rounded-full mr-3'></div>
                <span className='font-medium text-gray-700'>Labor Cost</span>
              </div>
              <span className='text-lg font-semibold text-gray-800'>
                LKR {Number(data.labor_cost_lkr).toLocaleString()}
              </span>
            </div>

            <div className='border-t-2 border-gray-200 pt-4 mt-4'>
              <div className='flex items-center justify-between p-4 bg-gray-100 rounded-lg'>
                <span className='font-bold text-gray-800 text-lg'>
                  Total Investment
                </span>
                <span className='text-2xl font-bold text-gray-800'>
                  LKR {result.cost.toLocaleString()}
                </span>
              </div>
            </div>

            <div className='flex items-center justify-between p-4 bg-purple-50 rounded-lg border-2 border-purple-200'>
              <span className='font-bold text-gray-800 text-lg'>
                Available Capital
              </span>
              <span className='text-2xl font-bold text-purple-600'>
                LKR {Number(data.hands_on_money_lkr).toLocaleString()}
              </span>
            </div>

            {!result.feasible && (
              <div className='p-4 bg-red-50 rounded-lg border border-red-200'>
                <p className='text-red-700 font-medium'>
                  ⚠️ Additional funding needed: LKR{" "}
                  {(
                    result.cost - Number(data.hands_on_money_lkr)
                  ).toLocaleString()}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Farm Info Summary */}
        <div className='bg-white rounded-2xl shadow-xl p-8 mb-6'>
          <h2 className='text-2xl font-bold text-gray-800 mb-6 flex items-center'>
            <span className='text-3xl mr-3'>🚜</span>
            Farm Information
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='p-4 bg-gray-50 rounded-lg'>
              <p className='text-sm text-gray-600 mb-1'>District</p>
              <p className='text-lg font-semibold text-gray-800'>
                {data.district}
              </p>
            </div>

            <div className='p-4 bg-gray-50 rounded-lg'>
              <p className='text-sm text-gray-600 mb-1'>Field Size</p>
              <p className='text-lg font-semibold text-gray-800'>
                {data.field_size_acres} acres
              </p>
            </div>

            <div className='p-4 bg-gray-50 rounded-lg'>
              <p className='text-sm text-gray-600 mb-1'>Season</p>
              <p className='text-lg font-semibold text-gray-800'>
                {data.season_type === "0" ? "Maha" : "Yala"}
              </p>
            </div>

            <div className='p-4 bg-gray-50 rounded-lg'>
              <p className='text-sm text-gray-600 mb-1'>Fertilizer Planned</p>
              <p className='text-lg font-semibold text-gray-800'>
                {data.planned_fertilizer_kg_per_acre} kg/acre
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className='flex flex-col sm:flex-row gap-4'>
          <button
            onClick={handleViewRecommendations}
            className='flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transform transition hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300'
          >
            📋 View Recommendations
          </button>

          <button
            onClick={handleNewPrediction}
            className='flex-1 bg-white hover:bg-gray-50 text-gray-800 font-semibold py-4 px-6 rounded-xl shadow-lg border-2 border-gray-300 transform transition hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-300'
          >
            🔄 New Prediction
          </button>
        </div>

        {/* Footer Note */}
        <div className='mt-6 text-center text-gray-600 text-sm'>
          <p>
            💡 These predictions are estimates based on your input data and
            historical trends.
          </p>
        </div>
      </div>
    </div>
  );
}
