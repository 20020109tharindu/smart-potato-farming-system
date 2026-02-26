import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);

  const cards = [
    {
      title: "Start New Input",
      desc: "Enter field details, costs and constraints to get predictions.",
      to: "/app/cost/in",
      cta: "Go to Input Page",
      icon: "📝",
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    {
      title: "View Results",
      desc: "Check predicted yield, revenue and key metrics.",
      to: "/app/cost/results",
      cta: "Open Results",
      icon: "📊",
      color: "from-blue-500 to-indigo-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      title: "Recommendations",
      desc: "See actionable fertilizer, irrigation and variety tips.",
      to: "/app/cost/recommendations",
      cta: "See Recommendations",
      icon: "💡",
      color: "from-purple-500 to-pink-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
  ];

  const quickStats = [
    {
      label: "Datasets",
      value: 3,
      icon: "📁",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "Scenarios Run",
      value: 12,
      icon: "🔄",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: "Avg. Predicted Yield (t/ha)",
      value: 18.7,
      icon: "🌾",
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
  ];

  const recentActivities = [
    {
      action: 'Ran prediction for "Yala-Field-A"',
      details: "Soil: Loam, Budget: LKR 120k",
      time: "2 hours ago",
      icon: "🚜",
      color: "bg-green-100 text-green-700",
    },
    {
      action: "Updated fertilizer cost assumptions",
      details: "New rate: LKR 85/kg",
      time: "5 hours ago",
      icon: "💰",
      color: "bg-blue-100 text-blue-700",
    },
    {
      action: 'Exported PDF report for "Maha-Scenario-03"',
      details: "3.2 MB file downloaded",
      time: "1 day ago",
      icon: "📄",
      color: "bg-purple-100 text-purple-700",
    },
  ];

  const handleNavigate = (path) => {
    console.log("Navigate to:", path);
    navigate(path);
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50'>
      {/* Header Section with Wave Pattern */}
      <div className='relative bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 overflow-hidden'>
        <div className='absolute inset-0 opacity-10'>
          <svg
            className='w-full h-full'
            viewBox='0 0 1440 320'
            preserveAspectRatio='none'
          >
            <path
              fill='#ffffff'
              d='M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,165.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'
            ></path>
          </svg>
        </div>

        <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
          <div className='flex items-center justify-between flex-wrap gap-6'>
            <div className='flex-1'>
              <div className='flex items-center mb-3'>
                <div className='w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center text-4xl mr-4'>
                  🥔
                </div>
                <div>
                  <h1 className='text-3xl md:text-4xl font-bold text-white mb-1'>
                    Potato Farm Analytics
                  </h1>
                  <p className='text-white/90 text-sm md:text-base'>
                    Smart farming decisions powered by data
                  </p>
                </div>
              </div>
            </div>

            <div className='hidden md:flex items-center space-x-4'>
              <div className='text-right'>
                <p className='text-white/80 text-sm'>Welcome back,</p>
                <p className='text-white text-lg font-semibold'>Farmer</p>
              </div>
              <div className='w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg'>
                <span className='text-2xl font-bold bg-gradient-to-br from-green-600 to-blue-600 bg-clip-text text-transparent'>
                  F
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8'>
        {/* Quick Stats with Enhanced Design */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-10'>
          {quickStats.map((stat, idx) => (
            <div
              key={idx}
              className='bg-white rounded-2xl shadow-xl p-6 border-l-4 border-transparent hover:border-blue-500 transform transition hover:scale-105 hover:shadow-2xl'
            >
              <div className='flex items-center justify-between mb-4'>
                <div className={`${stat.bgColor} p-4 rounded-xl`}>
                  <span className='text-4xl'>{stat.icon}</span>
                </div>
                <div className={`text-5xl font-bold ${stat.color}`}>
                  {stat.value}
                </div>
              </div>
              <p className='text-gray-700 font-semibold text-lg'>
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Quick Actions with Premium Design */}
        <div className='mb-10'>
          <div className='flex items-center justify-between mb-6'>
            <h2 className='text-3xl font-bold text-gray-800 flex items-center'>
              <span className='bg-gradient-to-br from-blue-500 to-purple-500 p-3 rounded-xl mr-3 text-white'>
                🎯
              </span>
              Quick Actions
            </h2>
            <span className='text-sm text-gray-500 hidden md:block'>
              Choose an action to get started
            </span>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {cards.map((card, i) => (
              <div
                key={i}
                className={`group bg-white rounded-3xl shadow-xl overflow-hidden border-2 ${card.borderColor} transform transition hover:scale-105 hover:shadow-2xl cursor-pointer relative`}
                onMouseEnter={() => setHoveredCard(i)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => handleNavigate(card.to)}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                ></div>

                <div className={`relative p-8 bg-gradient-to-br ${card.color}`}>
                  <div className='absolute top-4 right-4 opacity-20'>
                    <div className='text-7xl'>{card.icon}</div>
                  </div>
                  <div className='relative z-10'>
                    <div className='text-6xl mb-4'>{card.icon}</div>
                    <h3 className='text-2xl font-bold text-white mb-2'>
                      {card.title}
                    </h3>
                    <p className='text-white/90 text-sm leading-relaxed'>
                      {card.desc}
                    </p>
                  </div>
                </div>

                <div className={`p-6 ${card.bgColor} relative z-10`}>
                  <button
                    className={`w-full py-4 px-6 rounded-xl font-semibold transition transform ${
                      hoveredCard === i
                        ? "bg-white shadow-xl scale-105"
                        : "bg-white/80"
                    } text-gray-800 flex items-center justify-center group-hover:shadow-lg`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNavigate(card.to);
                    }}
                  >
                    <span>{card.cta}</span>
                    <svg
                      className='w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M13 7l5 5m0 0l-5 5m5-5H6'
                      />
                    </svg>
                  </button>
                </div>

                {i === 0 && (
                  <div className='absolute top-4 right-4 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full shadow-lg'>
                    Popular
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Two Column Layout */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10'>
          {/* Recent Activity - Takes 2 columns */}
          <div className='lg:col-span-2 bg-white rounded-3xl shadow-xl p-8 border border-gray-100'>
            <h2 className='text-2xl font-bold text-gray-800 mb-6 flex items-center'>
              <span className='bg-gradient-to-br from-green-500 to-blue-500 p-2 rounded-lg mr-3 text-white'>
                📈
              </span>
              Recent Activity
            </h2>
            <div className='space-y-4'>
              {recentActivities.map((activity, idx) => (
                <div
                  key={idx}
                  className='flex items-start p-5 rounded-2xl hover:bg-gray-50 transition border border-transparent hover:border-gray-200 group cursor-pointer'
                >
                  <div
                    className={`${activity.color} rounded-2xl p-4 mr-4 text-2xl transform group-hover:scale-110 transition-transform`}
                  >
                    {activity.icon}
                  </div>
                  <div className='flex-1'>
                    <p className='font-bold text-gray-800 text-base mb-1'>
                      {activity.action}
                    </p>
                    <p className='text-sm text-gray-600 mb-2'>
                      {activity.details}
                    </p>
                    <p className='text-xs text-gray-500 flex items-center'>
                      <svg
                        className='w-3 h-3 mr-1'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                      >
                        <path
                          fillRule='evenodd'
                          d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z'
                          clipRule='evenodd'
                        />
                      </svg>
                      {activity.time}
                    </p>
                  </div>
                  <button className='text-gray-400 hover:text-blue-600 transition opacity-0 group-hover:opacity-100'>
                    <svg
                      className='w-6 h-6'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M9 5l7 7-7 7'
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            <div className='mt-6 pt-6 border-t border-gray-200'>
              <button className='text-blue-600 hover:text-blue-700 font-semibold flex items-center transition group'>
                <span>View all activity</span>
                <svg
                  className='w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M13 7l5 5m0 0l-5 5m5-5H6'
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Performance Insights - Right Column */}
          <div className='bg-gradient-to-br from-purple-600 to-indigo-700 rounded-3xl shadow-xl p-8 text-white border border-purple-500'>
            <div className='flex items-center mb-6'>
              <span className='text-3xl mr-3'>📊</span>
              <h3 className='text-2xl font-bold'>Performance Insights</h3>
            </div>

            <div className='space-y-6'>
              <div className='bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20'>
                <div className='flex items-center justify-between mb-3'>
                  <span className='text-purple-100 text-sm font-medium'>
                    Success Rate
                  </span>
                  <span className='text-2xl font-bold'>94%</span>
                </div>
                <div className='w-full bg-white/20 rounded-full h-2.5'>
                  <div
                    className='bg-yellow-400 h-2.5 rounded-full'
                    style={{ width: "94%" }}
                  ></div>
                </div>
              </div>

              <div className='bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20'>
                <div className='flex items-center justify-between mb-3'>
                  <span className='text-purple-100 text-sm font-medium'>
                    Avg. Profit Margin
                  </span>
                  <span className='text-2xl font-bold'>32%</span>
                </div>
                <div className='w-full bg-white/20 rounded-full h-2.5'>
                  <div
                    className='bg-green-400 h-2.5 rounded-full'
                    style={{ width: "32%" }}
                  ></div>
                </div>
              </div>

              <div className='bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20'>
                <div className='flex items-center justify-between mb-3'>
                  <span className='text-purple-100 text-sm font-medium'>
                    Cost Efficiency
                  </span>
                  <span className='text-2xl font-bold'>87%</span>
                </div>
                <div className='w-full bg-white/20 rounded-full h-2.5'>
                  <div
                    className='bg-blue-400 h-2.5 rounded-full'
                    style={{ width: "87%" }}
                  ></div>
                </div>
              </div>
            </div>

            <div className='mt-8 pt-6 border-t border-white/20'>
              <button className='w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white font-semibold py-3 px-6 rounded-xl transition-all flex items-center justify-center group'>
                <span>View Detailed Analytics</span>
                <svg
                  className='w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M13 7l5 5m0 0l-5 5m5-5H6'
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Tips Section - Full Width */}
        <div className='bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-3xl shadow-xl p-8 border-2 border-amber-200 mb-10'>
          <div className='flex items-center mb-6'>
            <span className='text-4xl mr-3'>💡</span>
            <h3 className='text-2xl font-bold text-gray-800'>
              Farming Best Practices
            </h3>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div className='bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition'>
              <div className='text-3xl mb-3'>🌱</div>
              <h4 className='font-bold text-gray-800 mb-2'> Seed Readiness</h4>
              <p className='text-sm text-gray-600'>
                Update soil test results every season for accurate yield
                predictions
              </p>
            </div>
            <div className='bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition'>
              <div className='text-3xl mb-3'>🌤️</div>
              <h4 className='font-bold text-gray-800 mb-2'>Soil Health</h4>
              <p className='text-sm text-gray-600'>
                Track forecasts to optimize fertilizer application timing
              </p>
            </div>
            <div className='bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition'>
              <div className='text-3xl mb-3'>📊</div>
              <h4 className='font-bold text-gray-800 mb-2'>
                Diesease Predictor
              </h4>
              <p className='text-sm text-gray-600'>
                Compare multiple scenarios before making final planting
                decisions
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className='text-center pb-8'>
          <div className='inline-flex items-center bg-white rounded-full px-6 py-3 shadow-lg'>
            <span className='text-2xl mr-3'>🌱</span>
            <p className='text-gray-700 font-medium'>
              Powered by Advanced Machine Learning | Built for Sri Lankan Potato
              Farmers
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
