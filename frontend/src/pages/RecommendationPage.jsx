import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function RecommendationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { i18n } = useTranslation();
  <p className='text-xs opacity-60'>lang: {i18n.language}</p>;

  const [form, setForm] = useState(null);
  const [strategies, setStrategies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStrategy, setSelectedStrategy] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const fromState = location.state?.form;
      const fromStorage = sessionStorage.getItem("lastForm");
      const parsedStorage = fromStorage ? JSON.parse(fromStorage) : null;

      const mockData = {
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

      const data = fromState || parsedStorage || mockData;
      setForm(data);
      if (!data) {
        setLoading(false);
        return;
      }

      const options = [
        {
          name: t("reco.premiumName", {
            defaultValue: "Premium Strategy - Granola",
          }),
          seedAmount: t("reco.seedAmt60", { defaultValue: "60kg" }),
          cost: 55000,
          yield: 3100,
          description: t("reco.premiumDesc", {
            defaultValue: "High-quality variety with excellent market value",
          }),
          benefits: [
            t("reco.benefit.bestPrice", { defaultValue: "Best market price" }),
            t("reco.benefit.diseaseRes", { defaultValue: "Disease resistant" }),
            t("reco.benefit.shelf", { defaultValue: "Long shelf life" }),
          ],
          icon: "🌟",
        },
        {
          name: t("reco.balancedName", {
            defaultValue: "Balanced Strategy - Kufri",
          }),
          seedAmount: t("reco.seedAmt40", { defaultValue: "40kg" }),
          cost: 48000,
          yield: 2800,
          description: t("reco.balancedDesc", {
            defaultValue: "Reliable variety with consistent yields",
          }),
          benefits: [
            t("reco.benefit.goodRes", { defaultValue: "Good resistance" }),
            t("reco.benefit.moderateCost", { defaultValue: "Moderate cost" }),
            t("reco.benefit.proven", { defaultValue: "Proven results" }),
          ],
          icon: "⚖️",
        },
        {
          name: t("reco.budgetName", {
            defaultValue: "Budget Strategy - Local",
          }),
          seedAmount: t("reco.seedAmt30", { defaultValue: "30kg" }),
          cost: 42000,
          yield: 2400,
          description: t("reco.budgetDesc", {
            defaultValue: "Cost-effective option for small budgets",
          }),
          benefits: [
            t("reco.benefit.lowestInvest", {
              defaultValue: "Lowest investment",
            }),
            t("reco.benefit.localAdapt", { defaultValue: "Local adaptation" }),
            t("reco.benefit.quickROI", { defaultValue: "Quick ROI" }),
          ],
          icon: "💰",
        },
      ];

      const money = Number(data.hands_on_money_lkr);
      const filtered = options.filter((o) => o.cost <= money);

      const enriched = filtered.map((strategy) => {
        const marketPrice = 180;
        const revenue = strategy.yield * marketPrice;
        const profit = revenue - strategy.cost;
        const roi = ((profit / strategy.cost) * 100).toFixed(1);
        return { ...strategy, revenue, profit, roi, marketPrice };
      });

      setStrategies(enriched);
      setLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [location.state, t]);

  const handleBackToResults = () => {
    // In actual app: nav("/app/results")
    alert("Navigate back to results page");
  };

  const handleNewPrediction = () => {
    // In actual app: nav("/")
    window.location.reload();
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600 mb-4'></div>
          <p className='text-gray-600 text-lg'>
            {t("reco.loading", {
              defaultValue: "Generating recommendations...",
            })}
          </p>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4'>
        <div className='bg-white rounded-2xl shadow-xl p-8 max-w-md text-center'>
          <div className='text-6xl mb-4'>📋</div>
          <h2 className='text-2xl font-bold text-gray-800 mb-3'>
            {t("reco.noData", { defaultValue: "No Data Found" })}
          </h2>
          <p className='text-gray-600 mb-6'>
            {t("reco.noDataHint", {
              defaultValue:
                "Please complete the input form first to get personalized recommendations.",
            })}
          </p>
          <button
            onClick={handleNewPrediction}
            className='bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transform transition hover:scale-105'
          >
            {t("reco.gotoInput", { defaultValue: "Go to Input Form" })}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8 px-4'>
      <div className='max-w-6xl mx-auto'>
        {/* Language */}
        <div className='flex justify-end mb-4'>
          <LanguageSwitcher />
        </div>

        {/* Header */}
        <div className='text-center mb-8'>
          <div className='inline-block bg-purple-100 rounded-full p-4 mb-4'>
            <svg
              className='w-12 h-12 text-purple-600'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
              />
            </svg>
          </div>
          <h1 className='text-4xl font-bold text-gray-800 mb-2'>
            {t("reco.title", { defaultValue: "Smart Recommendations" })}
          </h1>
          <p className='text-gray-600'>
            {t("reco.subtitle", {
              defaultValue:
                "Budget-aware strategies tailored to your available capital",
            })}
          </p>
        </div>

        {/* Budget Info */}
        <div className='bg-white rounded-2xl shadow-xl p-6 mb-8'>
          <div className='flex items-center justify-between flex-wrap gap-4'>
            <div>
              <p className='text-sm text-gray-600 mb-1'>
                {t("reco.budget", { defaultValue: "Your Available Budget" })}
              </p>
              <p className='text-3xl font-bold text-purple-600'>
                LKR {Number(form.hands_on_money_lkr).toLocaleString()}
              </p>
            </div>
            <div className='text-right'>
              <p className='text-sm text-gray-600 mb-1'>
                {t("reco.countLabel", { defaultValue: "Strategies Found" })}
              </p>
              <p className='text-3xl font-bold text-green-600'>
                {strategies.length}
              </p>
            </div>
          </div>
        </div>

        {/* No Strategies */}
        {strategies.length === 0 && (
          <div className='bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-6 rounded-lg shadow-md mb-8'>
            <div className='flex items-center'>
              <svg
                className='h-6 w-6 mr-3'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z'
                  clipRule='evenodd'
                />
              </svg>
              <div>
                <p className='font-bold'>
                  {t("reco.insufficient", {
                    defaultValue: "Insufficient Budget",
                  })}
                </p>
                <p className='text-sm'>
                  {t("reco.insufficientHint", {
                    defaultValue:
                      "Your available capital is lower than the minimum required. Consider increasing your budget.",
                  })}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Strategies */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8'>
          {strategies.map((strategy, index) => (
            <div
              key={index}
              className={`bg-white rounded-2xl shadow-xl overflow-hidden transform transition hover:scale-105 cursor-pointer ${
                selectedStrategy === index ? "ring-4 ring-purple-500" : ""
              }`}
              onClick={() => setSelectedStrategy(index)}
            >
              {/* Card Header */}
              <div
                className={`p-6 text-white ${
                  index === 0
                    ? "bg-gradient-to-br from-yellow-500 to-orange-500"
                    : index === 1
                    ? "bg-gradient-to-br from-blue-500 to-purple-500"
                    : "bg-gradient-to-br from-green-500 to-teal-500"
                }`}
              >
                <div className='text-5xl mb-3'>{strategy.icon}</div>
                <h3 className='text-2xl font-bold mb-1'>{strategy.name}</h3>
                <p className='text-sm opacity-90'>{strategy.seedAmount}</p>
              </div>

              {/* Card Body */}
              <div className='p-6'>
                <p className='text-gray-600 text-sm mb-4'>
                  {strategy.description}
                </p>

                <div className='space-y-3 mb-4'>
                  <div className='flex justify-between items-center p-3 bg-gray-50 rounded-lg'>
                    <span className='text-sm text-gray-600'>
                      {t("reco.invest", { defaultValue: "Investment" })}
                    </span>
                    <span className='font-bold text-gray-800'>
                      LKR {strategy.cost.toLocaleString()}
                    </span>
                  </div>

                  <div className='flex justify-between items-center p-3 bg-gray-50 rounded-lg'>
                    <span className='text-sm text-gray-600'>
                      {t("reco.expectedYield", {
                        defaultValue: "Expected Yield",
                      })}
                    </span>
                    <span className='font-bold text-gray-800'>
                      {strategy.yield.toLocaleString()} kg
                    </span>
                  </div>

                  <div className='flex justify-between items-center p-3 bg-gray-50 rounded-lg'>
                    <span className='text-sm text-gray-600'>
                      {t("reco.revenue", { defaultValue: "Revenue" })}
                    </span>
                    <span className='font-bold text-green-600'>
                      LKR {strategy.revenue.toLocaleString()}
                    </span>
                  </div>

                  <div className='flex justify-between items-center p-3 bg-gray-50 rounded-lg'>
                    <span className='text-sm text-gray-600'>
                      {t("reco.netProfit", { defaultValue: "Net Profit" })}
                    </span>
                    <span className='font-bold text-purple-600'>
                      LKR {strategy.profit.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className='mb-4'>
                  <div
                    className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${
                      parseFloat(strategy.roi) > 100
                        ? "bg-green-100 text-green-700"
                        : parseFloat(strategy.roi) > 50
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    <span className='text-lg'>📈</span> {strategy.roi}%{" "}
                    {t("reco.roi", { defaultValue: "ROI" })}
                  </div>
                </div>

                <div className='mb-4'>
                  <p className='text-xs font-semibold text-gray-500 uppercase mb-2'>
                    {t("reco.keyBenefits", { defaultValue: "Key Benefits" })}
                  </p>
                  <ul className='space-y-2'>
                    {strategy.benefits.map((benefit, i) => (
                      <li
                        key={i}
                        className='flex items-start text-sm text-gray-700'
                      >
                        <svg
                          className='w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0'
                          fill='currentColor'
                          viewBox='0 0 20 20'
                        >
                          <path
                            fillRule='evenodd'
                            d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                            clipRule='evenodd'
                          />
                        </svg>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  className={`w-full py-3 rounded-xl font-semibold transition ${
                    selectedStrategy === index
                      ? "bg-purple-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedStrategy(index);
                  }}
                >
                  {selectedStrategy === index
                    ? t("reco.selected", { defaultValue: "✓ Selected" })
                    : t("reco.select", { defaultValue: "Select Strategy" })}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        {strategies.length > 0 && (
          <div className='bg-white rounded-2xl shadow-xl p-8 mb-8'>
            <h2 className='text-2xl font-bold text-gray-800 mb-6 flex items-center'>
              <span className='text-3xl mr-3'>📊</span>
              {t("reco.comparison", { defaultValue: "Strategy Comparison" })}
            </h2>

            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead>
                  <tr className='border-b-2 border-gray-2 00'>
                    <th className='text-left py-3 px-4 text-gray-600 font-semibold'>
                      {t("reco.col.strategy", { defaultValue: "Strategy" })}
                    </th>
                    <th className='text-right py-3 px-4 text-gray-600 font-semibold'>
                      {t("reco.col.investment", { defaultValue: "Investment" })}
                    </th>
                    <th className='text-right py-3 px-4 text-gray-600 font-semibold'>
                      {t("reco.col.yield", { defaultValue: "Yield" })}
                    </th>
                    <th className='text-right py-3 px-4 text-gray-600 font-semibold'>
                      {t("reco.col.revenue", { defaultValue: "Revenue" })}
                    </th>
                    <th className='text-right py-3 px-4 text-gray-600 font-semibold'>
                      {t("reco.col.profit", { defaultValue: "Profit" })}
                    </th>
                    <th className='text-right py-3 px-4 text-gray-600 font-semibold'>
                      {t("reco.col.roi", { defaultValue: "ROI" })}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {strategies.map((strategy, index) => (
                    <tr
                      key={index}
                      className='border-b border-gray-100 hover:bg-gray-50'
                    >
                      <td className='py-4 px-4'>
                        <div className='flex items-center'>
                          <span className='text-2xl mr-2'>{strategy.icon}</span>
                          <div>
                            <p className='font-semibold text-gray-800'>
                              {strategy.name}
                            </p>
                            <p className='text-xs text-gray-500'>
                              {strategy.seedAmount}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className='text-right py-4 px-4 text-gray-700'>
                        LKR {strategy.cost.toLocaleString()}
                      </td>
                      <td className='text-right py-4 px-4 text-gray-700'>
                        {strategy.yield.toLocaleString()} kg
                      </td>
                      <td className='text-right py-4 px-4 text-green-600 font-semibold'>
                        LKR {strategy.revenue.toLocaleString()}
                      </td>
                      <td className='text-right py-4 px-4 text-purple-600 font-semibold'>
                        LKR {strategy.profit.toLocaleString()}
                      </td>
                      <td className='text-right py-4 px-4'>
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${
                            parseFloat(strategy.roi) > 100
                              ? "bg-green-100 text-green-700"
                              : parseFloat(strategy.roi) > 50
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {strategy.roi}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className='flex flex-col sm:flex-row gap-4'>
          <button
            onClick={handleBackToResults}
            className='flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transform transition hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300'
          >
            ← {t("reco.backToResults", { defaultValue: "Back to Results" })}
          </button>

          <button
            onClick={handleNewPrediction}
            className='flex-1 bg-white hover:bg-gray-50 text-gray-800 font-semibold py-4 px-6 rounded-xl shadow-lg border-2 border-gray-300 transform transition hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-300'
          >
            🔄 {t("reco.newAnalysis", { defaultValue: "New Analysis" })}
          </button>
        </div>

        <div className='mt-6 text-center text-gray-600 text-sm'>
          <p>
            💡{" "}
            {t("reco.footer", {
              defaultValue:
                "All recommendations are based on your available budget.",
            })}{" "}
            LKR {Number(form.hands_on_money_lkr).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
