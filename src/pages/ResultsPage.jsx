import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../components/LanguageSwitcher.jsx";

// Helper function for currency formatting (LKR)
const formatLKR = (amount) => {
  if (amount === null || amount === undefined) return "N/A";
  return `LKR ${Math.round(amount).toLocaleString()}`;
};

export default function ResultsPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [analysis, setAnalysis] = useState(null); // backend response
  const [lastForm, setLastForm] = useState(null); // form the user submitted
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // read backend response saved by InputPage
    const raw = sessionStorage.getItem("analysisResult");
    const lf = sessionStorage.getItem("lastForm");
    try {
      const parsed = raw ? JSON.parse(raw) : null;
      const parsedForm = lf ? JSON.parse(lf) : null;
      setAnalysis(parsed);
      setLastForm(parsedForm);
    } catch (err) {
      console.error("Parsing session storage:", err);
      setAnalysis(null);
      setLastForm(null);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600 mb-4'></div>
          <p className='text-gray-600 text-lg'>
            {t("results.loading", {
              defaultValue: "Analyzing your farm data...",
            })}
          </p>
        </div>
      </div>
    );
  }

  if (!analysis || analysis.status !== "ok") {
    return (
      <div className='min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4'>
        <div className='bg-white rounded-2xl shadow-xl p-8 max-w-md text-center'>
          <div className='text-6xl mb-4'>📋</div>
          <h2 className='text-2xl font-bold text-gray-800 mb-3'>
            {t("results.noData", { defaultValue: "No Data Found" })}
          </h2>
          <p className='text-gray-600 mb-6'>
            {t("results.noDataHint", {
              defaultValue:
                "Please fill out the input form first to get your yield and profit predictions.",
            })}
          </p>
          <button
            onClick={() => navigate("/")}
            className='bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transform transition hover:scale-105'
          >
            {t("results.gotoInput", { defaultValue: "Go to Input Form" })}
          </button>
        </div>
      </div>
    );
  }

  const { baseline, strategies } = analysis;
  const bestStrategy =
    strategies && strategies.length > 0
      ? strategies.reduce((a, b) =>
          b.net_profit_lkr > a.net_profit_lkr ? b : a
        )
      : null;

  // compute cost & feasibility from lastForm (if available)
  const seedCost = lastForm ? Number(lastForm.seed_cost_lkr || 0) : 0;
  const fertCost = lastForm ? Number(lastForm.fertilizer_cost_lkr || 0) : 0;
  const laborCost = lastForm ? Number(lastForm.labor_cost_lkr || 0) : 0;
  const totalCost = seedCost + fertCost + laborCost;
  const capital = lastForm ? Number(lastForm.hands_on_money_lkr || 0) : 0;
  const feasible = totalCost <= capital;

  return (
    <div className='min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8 px-4'>
      <div className='max-w-5xl mx-auto'>
        {/* Language */}
        <div className='flex justify-end mb-4'>
          <LanguageSwitcher />
        </div>

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
            {t("results.title", { defaultValue: "Prediction Results" })}
          </h1>
          <p className='text-gray-600'>
            {t("results.subtitle", {
              defaultValue: "Here's your estimated yield and profit analysis",
            })}
          </p>
        </div>

        {/* Feasibility Alert */}
        {feasible ? (
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
                <p className='font-bold'>
                  {t("results.feasibleTitle", {
                    defaultValue: "✅ Feasible Plan",
                  })}
                </p>
                <p className='text-sm'>
                  {t("results.feasibleText", {
                    defaultValue:
                      "Your available capital is sufficient to cover all costs!",
                  })}
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
                <p className='font-bold'>
                  {t("results.notFeasibleTitle", {
                    defaultValue: "⚠️ Not Feasible",
                  })}
                </p>
                <p className='text-sm'>
                  {t("results.notFeasibleText", {
                    defaultValue:
                      "Your available capital may not be sufficient. Consider reducing costs or increasing budget.",
                  })}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Key Metrics */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6'>
          {/* Estimated Yield */}
          <div className='bg-white rounded-xl shadow-lg p-6 border-t-4 border-blue-500 transform transition hover:scale-105'>
            <div className='flex items-center justify-between mb-2'>
              <span className='text-3xl'>🌾</span>
              <span className='text-xs font-semibold text-gray-500 uppercase'>
                {t("results.cards.estimatedYield", {
                  defaultValue: "Estimated Yield",
                })}
              </span>
            </div>
            <p className='text-3xl font-bold text-gray-800'>
              {Math.round(baseline.yield_total).toLocaleString()}
            </p>
            <p className='text-sm text-gray-600'>
              {t("results.cards.kgTotal", { defaultValue: "kg total" })}
            </p>
            <p className='text-xs text-gray-500 mt-1'>
              {Math.round(baseline.yield_per_acre)}{" "}
              {t("results.cards.kgAcre", { defaultValue: "kg/acre" })}
            </p>
          </div>

          {/* Predicted Selling Price */}
          <div className='bg-white rounded-xl shadow-lg p-6 border-t-4 border-yellow-500 transform transition hover:scale-105'>
            <div className='flex items-center justify-between mb-2'>
              <span className='text-3xl'>🏷️</span>
              <span className='text-xs font-semibold text-gray-500 uppercase'>
                {t("results.cards.sellingPrice", {
                  defaultValue: "Selling Price",
                })}
              </span>
            </div>
            <p className='text-3xl font-bold text-yellow-600'>
              {formatLKR(baseline.price_lkr_per_kg)}
            </p>
            <p className='text-sm text-gray-600'>
              {t("results.cards.perKg", { defaultValue: "Per kg (Estimated)" })}
            </p>
            <p className='text-xs text-gray-500 mt-1'>
              {t("results.cards.marketBased", {
                defaultValue: "Based on market analysis",
              })}
            </p>
          </div>

          {/* Revenue (best strategy) */}
          <div className='bg-white rounded-xl shadow-lg p-6 border-t-4 border-green-500 transform transition hover:scale-105'>
            <div className='flex items-center justify-between mb-2'>
              <span className='text-3xl'>💵</span>
              <span className='text-xs font-semibold text-gray-500 uppercase'>
                {t("results.cards.revenue", { defaultValue: "Revenue" })}
              </span>
            </div>
            <p className='text-3xl font-bold text-green-600'>
              {bestStrategy ? formatLKR(bestStrategy.revenue_lkr) : "N/A"}
            </p>
            <p className='text-sm text-gray-600'>
              {t("results.cards.expectedIncome", {
                defaultValue: "Expected income",
              })}
            </p>
            <p className='text-xs text-gray-500 mt-1'>
              @ {formatLKR(baseline.price_lkr_per_kg)}/kg
            </p>
          </div>

          {/* Total Cost (from submitted form) */}
          <div className='bg-white rounded-xl shadow-lg p-6 border-t-4 border-orange-500 transform transition hover:scale-105'>
            <div className='flex items-center justify-between mb-2'>
              <span className='text-3xl'>💰</span>
              <span className='text-xs font-semibold text-gray-500 uppercase'>
                {t("results.cards.totalCost", { defaultValue: "Total Cost" })}
              </span>
            </div>
            <p className='text-3xl font-bold text-orange-600'>
              {formatLKR(totalCost)}
            </p>
            <p className='text-sm text-gray-600'>
              {t("results.cards.investmentNeeded", {
                defaultValue: "Investment needed",
              })}
            </p>
            <p className='text-xs text-gray-500 mt-1'>
              {t("results.cards.capital", { defaultValue: "Capital" })}:{" "}
              {formatLKR(capital)}
            </p>
          </div>

          {/* Net Profit (best strategy) */}
          <div
            className={`bg-white rounded-xl shadow-lg p-6 border-t-4 ${
              bestStrategy && bestStrategy.net_profit_lkr >= 0
                ? "border-purple-500"
                : "border-red-500"
            } transform transition hover:scale-105`}
          >
            <div className='flex items-center justify-between mb-2'>
              <span className='text-3xl'>
                {bestStrategy && bestStrategy.net_profit_lkr >= 0 ? "📈" : "📉"}
              </span>
              <span className='text-xs font-semibold text-gray-500 uppercase'>
                {t("results.cards.netProfit", { defaultValue: "Net Profit" })}
              </span>
            </div>
            <p
              className={`text-3xl font-bold ${
                bestStrategy && bestStrategy.net_profit_lkr >= 0
                  ? "text-purple-600"
                  : "text-red-600"
              }`}
            >
              {bestStrategy ? formatLKR(bestStrategy.net_profit_lkr) : "N/A"}
            </p>
            <p className='text-sm text-gray-600'>
              {/* {bestStrategy ? bestStrategy.farmer_explanation : ""} */}
            </p>
            <p className='text-xs mt-1 font-semibold text-purple-600'>
              {bestStrategy
                ? `${bestStrategy.roi_percent.toFixed(1)}% ROI`
                : ""}
            </p>
          </div>
        </div>
        <div>
          <div className='bg-white rounded-2xl shadow-xl p-8 mb-6 border-l-4 border-blue-500'>
            <h2 className='text-2xl font-bold text-gray-800 mb-4 flex items-center'>
              <span className='text-3xl mr-3'>💡</span>
              {t("results.explanation.title", {
                defaultValue: "Farmer's Insight",
              })}
            </h2>

            <p className='text-gray-700 leading-relaxed text-lg'>
              {bestStrategy ? bestStrategy.farmer_explanation : ""}
            </p>
          </div>
          {bestStrategy ? bestStrategy.farmer_explanation : ""}
        </div>

        {/* Cost Breakdown */}
        <div className='bg-white rounded-2xl shadow-xl p-8 mb-6'>
          <h2 className='text-2xl font-bold text-gray-800 mb-6 flex items-center'>
            <span className='text-3xl mr-3'>📊</span>
            {t("results.breakdown.title", { defaultValue: "Cost Breakdown" })}
          </h2>

          <div className='space-y-4'>
            <div className='flex items-center justify-between p-4 bg-blue-50 rounded-lg'>
              <div className='flex items-center'>
                <div className='w-3 h-3 bg-blue-500 rounded-full mr-3'></div>
                <span className='font-medium text-gray-700'>
                  {t("results.breakdown.seed", { defaultValue: "Seed Cost" })}
                </span>
              </div>
              <span className='text-lg font-semibold text-gray-800'>
                {formatLKR(seedCost)}
              </span>
            </div>

            <div className='flex items-center justify-between p-4 bg-green-50 rounded-lg'>
              <div className='flex items-center'>
                <div className='w-3 h-3 bg-green-500 rounded-full mr-3'></div>
                <span className='font-medium text-gray-700'>
                  {t("results.breakdown.fert", {
                    defaultValue: "Fertilizer Cost",
                  })}
                </span>
              </div>
              <span className='text-lg font-semibold text-gray-800'>
                {formatLKR(fertCost)}
              </span>
            </div>

            <div className='flex items-center justify-between p-4 bg-amber-50 rounded-lg'>
              <div className='flex items-center'>
                <div className='w-3 h-3 bg-amber-500 rounded-full mr-3'></div>
                <span className='font-medium text-gray-700'>
                  {t("results.breakdown.labor", { defaultValue: "Labor Cost" })}
                </span>
              </div>
              <span className='text-lg font-semibold text-gray-800'>
                {formatLKR(laborCost)}
              </span>
            </div>

            <div className='border-t-2 border-gray-200 pt-4 mt-4'>
              <div className='flex items-center justify-between p-4 bg-gray-100 rounded-lg'>
                <span className='font-bold text-gray-800 text-lg'>
                  {t("results.breakdown.totalInvest", {
                    defaultValue: "Total Investment",
                  })}
                </span>
                <span className='text-2xl font-bold text-gray-800'>
                  {formatLKR(totalCost)}
                </span>
              </div>
            </div>

            <div className='flex items-center justify-between p-4 bg-purple-50 rounded-lg border-2 border-purple-200'>
              <span className='font-bold text-gray-800 text-lg'>
                {t("results.breakdown.capital", {
                  defaultValue: "Available Capital",
                })}
              </span>
              <span className='text-2xl font-bold text-purple-600'>
                {formatLKR(capital)}
              </span>
            </div>

            {!feasible && (
              <div className='p-4 bg-red-50 rounded-lg border border-red-200'>
                <p className='text-red-700 font-medium'>
                  {t("results.breakdown.needMore", {
                    defaultValue: "⚠️ Additional funding needed:",
                  })}{" "}
                  {formatLKR(totalCost - capital)}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Farm Info */}
        <div className='bg-white rounded-2xl shadow-xl p-8 mb-6'>
          <h2 className='text-2xl font-bold text-gray-800 mb-6 flex items-center'>
            <span className='text-3xl mr-3'>🚜</span>
            {t("results.farm.title", { defaultValue: "Farm Information" })}
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='p-4 bg-gray-50 rounded-lg'>
              <p className='text-sm text-gray-600 mb-1'>
                {t("results.farm.district", { defaultValue: "District" })}
              </p>
              <p className='text-lg font-semibold text-gray-800'>
                {lastForm ? lastForm.district : "N/A"}
              </p>
            </div>

            <div className='p-4 bg-gray-50 rounded-lg'>
              <p className='text-sm text-gray-600 mb-1'>
                {t("results.farm.fieldSize", { defaultValue: "Field Size" })}
              </p>
              <p className='text-lg font-semibold text-gray-800'>
                {lastForm
                  ? `${lastForm.field_size_acres} ${t("results.farm.acres", {
                      defaultValue: "acres",
                    })}`
                  : "N/A"}
              </p>
            </div>

            <div className='p-4 bg-gray-50 rounded-lg'>
              <p className='text-sm text-gray-600 mb-1'>
                {t("results.farm.season", { defaultValue: "Season" })}
              </p>
              <p className='text-lg font-semibold text-gray-800'>
                {lastForm ? lastForm.season_type : "N/A"}
              </p>
            </div>

            <div className='p-4 bg-gray-50 rounded-lg'>
              <p className='text-sm text-gray-600 mb-1'>
                {t("results.farm.fertilizer", {
                  defaultValue: "Fertilizer Planned",
                })}
              </p>
              <p className='text-lg font-semibold text-gray-800'>
                {lastForm
                  ? `${lastForm.planned_fertilizer_kg_per_acre} kg/acre`
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className='flex flex-col sm:flex-row gap-4'>
          <button
            onClick={() => navigate("/app/cost/recommendations")}
            className='flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transform transition hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300'
          >
            📋{" "}
            {t("results.viewRecommendations", {
              defaultValue: "View Recommendations",
            })}
          </button>

          <button
            onClick={() => navigate("/")}
            className='flex-1 bg-white hover:bg-gray-50 text-gray-800 font-semibold py-4 px-6 rounded-xl shadow-lg border-2 border-gray-300 transform transition hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-300'
          >
            🔄 {t("results.newPrediction", { defaultValue: "New Prediction" })}
          </button>
        </div>

        <div className='mt-6 text-center text-gray-600 text-sm'>
          <p>
            💡{" "}
            {t("results.note", {
              defaultValue:
                "These predictions are estimates based on your input data and historical trends.",
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
