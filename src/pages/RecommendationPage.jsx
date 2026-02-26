import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  TrendingUp,
  DollarSign,
  Package,
  Target,
  AlertCircle,
  CheckCircle2,
  Award,
  BarChart3,
  Zap,
  RefreshCw,
  Calendar,
  X,
  Check,
} from "lucide-react";

const formatLKR = (n) =>
  n === null || n === undefined
    ? "N/A"
    : `LKR ${Math.round(n).toLocaleString()}`;

export default function RecommendationPage() {
  const navigate = useNavigate();

  const [analysis, setAnalysis] = useState(null);
  const [lastForm, setLastForm] = useState(null);
  const [selected, setSelected] = useState(0);
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
      <div className='min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center px-4'>
        <div className='bg-white rounded-2xl shadow-2xl p-12 max-w-md text-center'>
          <div className='bg-amber-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6'>
            <AlertCircle className='w-10 h-10 text-amber-600' />
          </div>
          <h2 className='text-3xl font-bold text-gray-900 mb-4'>
            No Data Found
          </h2>
          <p className='text-gray-600 mb-8 leading-relaxed'>
            Please complete the input form first to get personalized
            recommendations.
          </p>
          <button
            onClick={() => navigate("/app/cost/in")}
            className='w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all'
          >
            Go to Input Form
          </button>
        </div>
      </div>
    );
  }

  const { strategies } = analysis;
  const budget = Number(lastForm?.hands_on_money_lkr || 0);
  const WEEK_ORDER = ["week_1_2", "week_3_5", "week_6_9", "week_10_12"];
  const WEEK_LABELS = {
    week_1_2: "Weeks 1–2",
    week_3_5: "Weeks 3–5",
    week_6_9: "Weeks 6–9",
    week_10_12: "Weeks 10–12",
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50'>
      {/* Header */}
      <div className='bg-white/80 backdrop-blur-sm border-b border-emerald-100 sticky top-0 z-10'>
        <div className='max-w-7xl mx-auto px-6 py-4 flex items-center justify-between'>
          <button
            onClick={() => navigate("/app/cost/results")}
            className='flex items-center gap-2 text-gray-700 hover:text-emerald-600 transition-colors'
          >
            <ArrowLeft className='w-5 h-5' />
            <span className='font-medium'>Back to Results</span>
          </button>
          <div className='flex items-center gap-3'>
            <div className='bg-gradient-to-br from-purple-500 to-indigo-600 p-2 rounded-xl'>
              <Zap className='w-6 h-6 text-white' />
            </div>
            <div>
              <h1 className='text-xl font-bold text-gray-900'>AgriSense AI</h1>
              <p className='text-xs text-gray-600'>
                Step 3 of 3 — Investment Strategies
              </p>
            </div>
          </div>
          <div className='text-sm text-gray-600' />
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-6 py-12'>
        {/* Hero Section */}
        <div className='text-center mb-12'>
          <div className='inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-4'>
            <Zap className='w-4 h-4' />
            Budget-Optimized Strategies
          </div>
          <h2 className='text-4xl font-bold text-gray-900 mb-3'>
            Smart Investment Recommendations
          </h2>
          <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
            AI-powered strategies tailored to your available capital and farm
            conditions
          </p>
        </div>

        {/* Budget Overview */}
        <div className='bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-8 mb-8 text-white shadow-xl'>
          <div className='grid md:grid-cols-2 gap-8'>
            <div className='flex items-center gap-4'>
              <div className='bg-white/20 backdrop-blur-sm rounded-full p-4'>
                <DollarSign className='w-8 h-8' />
              </div>
              <div>
                <p className='text-purple-100 text-sm mb-1'>Available Budget</p>
                <p className='text-4xl font-bold'>{formatLKR(budget)}</p>
              </div>
            </div>
            <div className='flex items-center gap-4'>
              <div className='bg-white/20 backdrop-blur-sm rounded-full p-4'>
                <Target className='w-8 h-8' />
              </div>
              <div>
                <p className='text-purple-100 text-sm mb-1'>
                  Investment Strategies Found
                </p>
                <p className='text-4xl font-bold'>{strategies.length}</p>
                <p className='text-purple-100 text-sm'>
                  Optimized for your capital
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Strategy Cards */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12'>
          {strategies.map((s, i) => {
            const isSelected = selected === i;
            const isBest = i === 0;

            const gradients = [
              "from-amber-400 to-orange-500",
              "from-blue-500 to-purple-600",
              "from-emerald-500 to-teal-600",
            ];

            const icons = [
              <Award className='w-8 h-8' key='award' />,
              <BarChart3 className='w-8 h-8' key='chart' />,
              <Package className='w-8 h-8' key='package' />,
            ];

            const emojis = ["🌟", "⚖️", "💰"];

            return (
              <div
                key={i}
                onClick={() => setSelected(i)}
                className={`bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-200 hover:shadow-2xl hover:-translate-y-1 cursor-pointer ${
                  isSelected ? "ring-4 ring-purple-500 ring-offset-2" : ""
                } ${isBest ? "relative" : ""}`}
              >
                {isBest && (
                  <div className='absolute top-4 right-4 z-10 bg-amber-400 text-amber-900 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1'>
                    <Zap className='w-3 h-3' />
                    BEST ROI
                  </div>
                )}

                {/* Header */}
                <div
                  className={`bg-gradient-to-br ${gradients[i]} p-6 text-white relative overflow-hidden`}
                >
                  <div className='absolute top-0 right-0 opacity-10 transform scale-150'>
                    {icons[i]}
                  </div>
                  <div className='relative'>
                    <div className='text-5xl mb-3'>{emojis[i]}</div>
                    <h3 className='text-2xl font-bold mb-1'>{s.strategy}</h3>
                    <p className='text-sm opacity-90 mb-3'>
                      {s.type !== "Other"
                        ? `Variety: ${s.type}`
                        : "Best Available"}
                    </p>
                    <div className='bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 inline-block'>
                      <span className='text-xs font-semibold'>Expected: </span>
                      <span className='font-bold'>
                        {s.expected_yield_per_acre.toFixed(0)} kg/acre
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className='p-6'>
                  {/* Explanation */}
                  <div className='bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4 mb-6'>
                    <p className='text-sm text-gray-700 leading-relaxed'>
                      {s.farmer_explanation}
                    </p>
                  </div>

                  {/* Key Metrics */}
                  <div className='space-y-3 mb-6'>
                    <MetricRow
                      label='Investment'
                      value={formatLKR(s.investment_lkr)}
                    />
                    <MetricRow
                      label='Expected Yield'
                      value={`${Math.round(s.expected_yield_kg).toLocaleString()} kg`}
                    />
                    <MetricRow
                      label='Revenue'
                      value={formatLKR(s.revenue_lkr)}
                      color='green'
                    />
                    <MetricRow
                      label='Net Profit'
                      value={formatLKR(s.net_profit_lkr)}
                      color='purple'
                    />
                  </div>

                  {/* ROI Badge */}
                  <div className='mb-6'>
                    <div
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm ${
                        s.roi_percent > 100
                          ? "bg-green-100 text-green-700"
                          : s.roi_percent > 50
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      <TrendingUp className='w-4 h-4' />
                      {s.roi_percent.toFixed(1)}% ROI
                    </div>
                  </div>

                  {/* Price per kg */}
                  <div className='bg-gray-50 rounded-lg px-4 py-3 mb-6 flex items-center justify-between'>
                    <span className='text-sm text-gray-600'>Price / kg</span>
                    <span className='font-bold text-gray-900 font-mono'>
                      LKR {s.expected_price_per_kg.toFixed(2)}
                    </span>
                  </div>

                  {/* Select Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelected(i);
                    }}
                    className={`w-full py-3 rounded-xl font-semibold transition-all ${
                      isSelected
                        ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {isSelected ? (
                      <span className='flex items-center justify-center gap-2'>
                        <CheckCircle2 className='w-5 h-5' />
                        Selected Strategy
                      </span>
                    ) : (
                      "Select This Strategy"
                    )}
                  </button>

                  {/* Action Plan Button — always visible, highlighted when selected */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelected(i);
                      setActiveStrategy(s);
                      setShowModal(true);
                    }}
                    className={`w-full mt-3 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                      isSelected
                        ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:shadow-lg"
                        : "border-2 border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                    }`}
                  >
                    <Calendar className='w-5 h-5' />
                    View Action Plan
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className='grid md:grid-cols-2 gap-6 mb-8'>
          <button
            onClick={() => navigate("/app/cost/results")}
            className='group bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-5 px-8 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all flex items-center justify-center gap-3'
          >
            <ArrowLeft className='w-6 h-6 group-hover:-translate-x-1 transition-transform' />
            Back to Results
          </button>

          <button
            onClick={() => navigate("/app/cost/in")}
            className='group bg-white text-gray-800 font-semibold py-5 px-8 rounded-xl shadow-lg hover:shadow-2xl border-2 border-gray-300 hover:border-emerald-500 transform hover:-translate-y-1 transition-all flex items-center justify-center gap-3'
          >
            <RefreshCw className='w-6 h-6 group-hover:rotate-180 transition-transform duration-500' />
            New Analysis
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────
          ACTION PLAN MODAL
      ───────────────────────────────────── */}
      {showModal && activeStrategy && (
        <div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col'>
            {/* Modal Header */}
            <div className='bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-white'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <Calendar className='w-8 h-8' />
                  <div>
                    <h2 className='text-2xl font-bold'>Weekly Action Plan</h2>
                    <p className='text-emerald-100 text-sm'>
                      {activeStrategy.strategy} Strategy
                      {activeStrategy.type !== "Other"
                        ? ` — ${activeStrategy.type} Variety`
                        : ""}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className='bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors'
                >
                  <X className='w-6 h-6' />
                </button>
              </div>

              {/* Quick stats in modal header */}
              <div className='grid grid-cols-3 gap-4 mt-6'>
                <div className='bg-white/15 rounded-xl p-3 text-center'>
                  <div className='text-emerald-100 text-xs mb-1'>
                    Expected Yield
                  </div>
                  <div className='font-bold text-lg'>
                    {Math.round(
                      activeStrategy.expected_yield_kg,
                    ).toLocaleString()}{" "}
                    kg
                  </div>
                </div>
                <div className='bg-white/15 rounded-xl p-3 text-center'>
                  <div className='text-emerald-100 text-xs mb-1'>
                    Net Profit
                  </div>
                  <div className='font-bold text-lg'>
                    {formatLKR(activeStrategy.net_profit_lkr)}
                  </div>
                </div>
                <div className='bg-white/15 rounded-xl p-3 text-center'>
                  <div className='text-emerald-100 text-xs mb-1'>ROI</div>
                  <div className='font-bold text-lg'>
                    {activeStrategy.roi_percent.toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className='flex-1 overflow-y-auto p-8'>
              <div className='space-y-8'>
                {WEEK_ORDER.filter(
                  (week) => activeStrategy.action_plan[week],
                ).map((week, idx) => {
                  const filteredWeeks = WEEK_ORDER.filter(
                    (w) => activeStrategy.action_plan[w],
                  );
                  const phaseColors = [
                    {
                      bg: "from-blue-50 to-indigo-50",
                      border: "border-blue-200",
                      badge: "bg-blue-500",
                      num: "bg-blue-100 text-blue-700",
                    },
                    {
                      bg: "from-green-50 to-emerald-50",
                      border: "border-green-200",
                      badge: "bg-green-500",
                      num: "bg-green-100 text-green-700",
                    },
                    {
                      bg: "from-amber-50 to-yellow-50",
                      border: "border-amber-200",
                      badge: "bg-amber-500",
                      num: "bg-amber-100 text-amber-700",
                    },
                    {
                      bg: "from-rose-50 to-pink-50",
                      border: "border-rose-200",
                      badge: "bg-rose-500",
                      num: "bg-rose-100 text-rose-700",
                    },
                  ];
                  const theme = phaseColors[idx] || phaseColors[0];

                  return (
                    <div key={week} className='relative'>
                      {/* Timeline connector */}
                      {idx < filteredWeeks.length - 1 && (
                        <div className='absolute left-5 top-12 bottom-0 w-0.5 bg-gradient-to-b from-gray-300 to-gray-100' />
                      )}

                      <div className='flex gap-6'>
                        {/* Step badge */}
                        <div className='flex-shrink-0'>
                          <div
                            className={`${theme.badge} rounded-full w-11 h-11 flex items-center justify-center text-white font-bold text-lg shadow-md`}
                          >
                            {idx + 1}
                          </div>
                        </div>

                        {/* Week Content */}
                        <div
                          className={`flex-1 bg-gradient-to-br ${theme.bg} rounded-xl p-6 border-2 ${theme.border}`}
                        >
                          <div className='flex items-center gap-3 mb-5'>
                            <Calendar className='w-5 h-5 text-gray-500' />
                            <h3 className='text-lg font-bold text-gray-900'>
                              {WEEK_LABELS[week]}
                            </h3>
                            <span
                              className={`ml-auto text-xs font-semibold px-3 py-1 rounded-full ${theme.num}`}
                            >
                              Phase {idx + 1}
                            </span>
                          </div>

                          <ul className='space-y-3'>
                            {[...new Set(activeStrategy.action_plan[week])].map(
                              (step, stepIdx) => (
                                <li
                                  key={stepIdx}
                                  className='flex items-start gap-3 bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow'
                                >
                                  <div className='flex-shrink-0 mt-0.5'>
                                    <div className='bg-emerald-100 rounded-full p-1'>
                                      <Check className='w-4 h-4 text-emerald-600' />
                                    </div>
                                  </div>
                                  <span className='text-gray-700 leading-relaxed text-sm'>
                                    {step}
                                  </span>
                                </li>
                              ),
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className='border-t border-gray-200 p-6 bg-gray-50'>
              <div className='flex gap-4'>
                <button
                  onClick={() => setShowModal(false)}
                  className='flex-1 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition-all'
                >
                  Close Action Plan
                </button>
                {/* <button className='flex-1 bg-white border-2 border-emerald-500 text-emerald-600 font-semibold py-3 px-6 rounded-xl hover:bg-emerald-50 transition-all flex items-center justify-center gap-2'>
                  <Package className='w-5 h-5' />
                  Export as PDF
                </button> */}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MetricRow({ label, value, color = "gray" }) {
  const colorClasses = {
    gray: "bg-gray-50 text-gray-700",
    green: "bg-green-50 text-green-700",
    purple: "bg-purple-50 text-purple-700",
  };

  return (
    <div
      className={`flex items-center justify-between p-3 ${colorClasses[color]} rounded-lg`}
    >
      <span className='text-sm font-medium text-gray-700'>{label}</span>
      <span
        className={`font-bold ${
          color === "green"
            ? "text-green-600"
            : color === "purple"
              ? "text-purple-600"
              : "text-gray-900"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
