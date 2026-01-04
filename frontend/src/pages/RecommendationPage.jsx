import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LanguageSwitcher from "../components/LanguageSwitcher.jsx";

const formatLKR = (n) =>
  n === null || n === undefined
    ? "N/A"
    : `LKR ${Math.round(n).toLocaleString()}`;

export default function RecommendationPage() {
  const navigate = useNavigate();

  const [analysis, setAnalysis] = useState(null);
  const [lastForm, setLastForm] = useState(null);
  const [selected, setSelected] = useState(0);

  // modal
  const [showModal, setShowModal] = useState(false);
  const [activeStrategy, setActiveStrategy] = useState(null);

  useEffect(() => {
    try {
      const raw = JSON.parse(sessionStorage.getItem("analysisResult"));
      const lf = JSON.parse(sessionStorage.getItem("lastForm"));
      setAnalysis(raw);
      setLastForm(lf);
    } catch (e) {
      console.error(e);
    }
  }, []);

  if (!analysis || analysis.status !== "ok") {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <button
          onClick={() => navigate("/")}
          className='bg-green-600 text-white px-6 py-3 rounded-xl'
        >
          Go to Input
        </button>
      </div>
    );
  }

  const { strategies } = analysis;
  const budget = Number(lastForm?.hands_on_money_lkr || 0);
  const WEEK_ORDER = ["week_1_2", "week_3_5", "week_6_9", "week_10_12"];

  return (
    <div className='min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6'>
      <div className='max-w-7xl mx-auto'>
        <div className='flex justify-end mb-4'>
          <LanguageSwitcher />
        </div>

        <h1 className='text-3xl font-bold text-center mb-6'>
          Smart Recommendations
        </h1>

        <div className='bg-white rounded-xl shadow p-6 mb-6 flex justify-between'>
          <div>
            <p className='text-gray-500'>Available Budget</p>
            <p className='text-2xl font-bold text-purple-600'>
              {formatLKR(budget)}
            </p>
          </div>
          <div>
            <p className='text-gray-500'>Strategies Found</p>
            <p className='text-2xl font-bold text-green-600'>
              {strategies.length}
            </p>
          </div>
        </div>

        {/* STRATEGY CARDS */}
        <div className='grid md:grid-cols-3 gap-6 mb-8'>
          {strategies.map((s, i) => (
            <div
              key={i}
              onClick={() => setSelected(i)}
              className={`bg-white rounded-2xl shadow-xl cursor-pointer border-4 ${
                selected === i ? "border-purple-500" : "border-transparent"
              }`}
            >
              <div className='p-6'>
                <h3 className='text-xl font-bold mb-2'>
                  {s.strategy} — {s.type}
                </h3>
                <p className='text-gray-600 mb-4'>{s.farmer_explanation}</p>

                <div className='space-y-2 text-sm'>
                  <p>Investment: {formatLKR(s.investment_lkr)}</p>
                  <p>Yield: {Math.round(s.expected_yield_kg)} kg</p>
                  <p className='text-green-600'>
                    Revenue: {formatLKR(s.revenue_lkr)}
                  </p>
                  <p className='text-purple-600 font-bold'>
                    Profit: {formatLKR(s.net_profit_lkr)}
                  </p>
                </div>

                <div className='mt-4'>
                  <span className='bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold'>
                    {s.roi_percent.toFixed(1)}% ROI
                  </span>
                </div>

                <button
                  className={`w-full mt-4 py-3 rounded-xl font-semibold ${
                    selected === i ? "bg-purple-600 text-white" : "bg-gray-100"
                  }`}
                >
                  {selected === i ? "✓ Selected" : "Select Strategy"}
                </button>

                {selected === i && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveStrategy(s);
                      setShowModal(true);
                    }}
                    className='w-full mt-3 py-3 rounded-xl bg-green-600 text-white font-semibold'
                  >
                    📋 View Action Plan
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ACTION PLAN MODAL */}
        {showModal && activeStrategy && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
            <div className='bg-white rounded-2xl shadow-xl max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto'>
              <div className='flex justify-between items-center mb-4'>
                <h2 className='text-2xl font-bold'>
                  🌱 Action Plan – {activeStrategy.strategy} (
                  {activeStrategy.type})
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className='text-2xl text-gray-500 hover:text-red-500'
                >
                  ✖
                </button>
              </div>

              {WEEK_ORDER.filter(
                (week) => activeStrategy.action_plan[week]
              ).map((week) => (
                <div
                  key={week}
                  className='mb-8 border-l-4 border-purple-500 pl-5'
                >
                  {/* Week Title */}
                  <h3 className='text-lg font-bold text-purple-700 mb-3 flex items-center'>
                    📅 {week.replaceAll("_", " ").toUpperCase()}
                  </h3>

                  {/* Action List */}
                  <ul className='space-y-3 text-gray-700 leading-relaxed'>
                    {[...new Set(activeStrategy.action_plan[week])].map(
                      (step, idx) => (
                        <li key={idx} className='flex gap-3'>
                          <span className='text-green-600 font-bold'>✔</span>
                          <span>{step}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              ))}

              <div className='text-right'>
                <button
                  onClick={() => setShowModal(false)}
                  className='bg-purple-600 text-white px-6 py-3 rounded-xl'
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        <div className='flex gap-4 mt-6'>
          <button
            onClick={() => navigate("/app/cost/results")}
            className='flex-1 bg-blue-600 text-white py-4 rounded-xl'
          >
            ← Back to Results
          </button>
          <button
            onClick={() => navigate("/")}
            className='flex-1 border py-4 rounded-xl'
          >
            New Analysis
          </button>
        </div>
      </div>
    </div>
  );
}
