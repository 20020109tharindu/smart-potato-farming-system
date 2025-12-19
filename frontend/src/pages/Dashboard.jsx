<<<<<<< HEAD
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function Dashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);

  const cards = [
    {
      key: "input",
      to: "/in",
      icon: "📝",
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    {
      key: "results",
      to: "/results",
      icon: "📊",
      color: "from-blue-500 to-indigo-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      key: "reco",
      to: "/recommendations",
      icon: "💡",
      color: "from-purple-500 to-pink-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
  ];

  const quickStats = [
    {
      labelKey: "dashboard.stats.datasets",
      value: 3,
      icon: "📁",
      color: "text-blue-600",
    },
    {
      labelKey: "dashboard.stats.scenariosRun",
      value: 12,
      icon: "🔄",
      color: "text-green-600",
    },
    {
      labelKey: "dashboard.stats.avgYield",
      value: 18.7,
      icon: "🌾",
      color: "text-amber-600",
=======
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
>>>>>>> 0aa9b2edbeefa0bcf539f487f7fb2785e38743d4
    },
  ];

  const recentActivities = [
    {
<<<<<<< HEAD
      key: "dashboard.activity.prediction",
      params: { scenario: "Yala-Field-A" },
      detailsKey: "dashboard.activity.details1",
      timeKey: "dashboard.activity.time2h",
=======
      action: 'Ran prediction for "Yala-Field-A"',
      details: "Soil: Loam, Budget: LKR 120k",
      time: "2 hours ago",
>>>>>>> 0aa9b2edbeefa0bcf539f487f7fb2785e38743d4
      icon: "🚜",
      color: "bg-green-100 text-green-700",
    },
    {
<<<<<<< HEAD
      key: "dashboard.activity.updateFertilizer",
      detailsKey: "dashboard.activity.details2",
      timeKey: "dashboard.activity.time5h",
=======
      action: "Updated fertilizer cost assumptions",
      details: "New rate: LKR 85/kg",
      time: "5 hours ago",
>>>>>>> 0aa9b2edbeefa0bcf539f487f7fb2785e38743d4
      icon: "💰",
      color: "bg-blue-100 text-blue-700",
    },
    {
<<<<<<< HEAD
      key: "dashboard.activity.export",
      params: { scenario: "Maha-Scenario-03" },
      detailsKey: "dashboard.activity.details3",
      timeKey: "dashboard.activity.time1d",
=======
      action: 'Exported PDF report for "Maha-Scenario-03"',
      details: "3.2 MB file downloaded",
      time: "1 day ago",
>>>>>>> 0aa9b2edbeefa0bcf539f487f7fb2785e38743d4
      icon: "📄",
      color: "bg-purple-100 text-purple-700",
    },
  ];

  const handleNavigate = (path) => {
<<<<<<< HEAD
    navigate(path);
  };

  const onCardKeyDown = (e, to) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleNavigate(to);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50'>
      {/* Header */}
      <header className='bg-white shadow-sm border-b border-gray-200'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6'>
          <div className='flex items-start sm:items-center justify-between gap-4'>
            <div className='min-w-0'>
              <h1 className='text-2xl sm:text-4xl font-bold text-gray-800 leading-tight flex items-center flex-wrap'>
                <span className='text-3xl sm:text-5xl mr-2 sm:mr-3'>🥔</span>
                <span className='truncate'>{t("dashboard.title")}</span>
              </h1>
              <p className='text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base'>
                {t("dashboard.subtitle")}
              </p>
            </div>
            <div className='hidden md:block shrink-0'>
              <div className='flex items-center space-x-4'>
                <LanguageSwitcher />
                <div className='text-right'>
                  <p className='text-xs text-gray-600'>
                    {t("dashboard.welcome")}
                  </p>
                  <p className='text-base font-semibold text-gray-800'>
                    {t("dashboard.userPlaceholder")}
                  </p>
                </div>
                <div
                  aria-hidden='true'
                  className='w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold'
                >
                  F
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8'>
        {/* Quick Stats */}
        <section aria-labelledby='quick-stats' className='mb-6 sm:mb-8'>
          <h2 id='quick-stats' className='sr-only'>
            {t("dashboard.quickStats")}
          </h2>
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6'>
            {quickStats.map((stat, idx) => (
              <div
                key={idx}
                className='bg-white rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100 transform transition motion-safe:hover:scale-[1.02] hover:shadow-xl'
              >
                <div className='flex items-center justify-between mb-3 sm:mb-4'>
                  <div className='text-3xl sm:text-4xl' aria-hidden='true'>
                    {stat.icon}
                  </div>
                  <div
                    className={`text-3xl sm:text-4xl font-bold ${stat.color}`}
                  >
                    {stat.value}
                  </div>
                </div>
                <p className='text-gray-600 font-medium text-sm sm:text-base'>
                  {t(stat.labelKey)}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section aria-labelledby='quick-actions' className='mb-6 sm:mb-8'>
          <h2
            id='quick-actions'
            className='text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center'
          >
            <span className='mr-2'>🎯</span>
            {t("dashboard.quickActions")}
          </h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'>
            {cards.map((card, i) => (
              <article
                key={i}
                role='button'
                tabIndex={0}
                aria-label={t(`dashboard.cards.${card.key}Title`)}
                className={`bg-white rounded-2xl shadow-lg overflow-hidden border-2 ${
                  card.borderColor
                } transform transition motion-safe:hover:scale-[1.02] hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-${
                  card.color?.includes("green")
                    ? "green-300"
                    : card.color?.includes("blue")
                    ? "blue-300"
                    : "purple-300"
                } cursor-pointer`}
                onMouseEnter={() => setHoveredCard(i)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => handleNavigate(card.to)}
                onKeyDown={(e) => onCardKeyDown(e, card.to)}
              >
                {/* Header */}
                <div
                  className={`p-5 sm:p-6 bg-gradient-to-r ${card.color} text-white`}
                >
                  <div
                    className='text-4xl sm:text-5xl mb-2 sm:mb-3'
                    aria-hidden='true'
                  >
                    {card.icon}
                  </div>
                  <h3 className='text-xl sm:text-2xl font-bold mb-1 sm:mb-2'>
                    {t(`dashboard.cards.${card.key}Title`)}
                  </h3>
                  <p className='text-xs sm:text-sm/relaxed opacity-90'>
                    {t(`dashboard.cards.${card.key}Desc`)}
                  </p>
                </div>

                {/* Footer */}
                <div className={`p-4 sm:p-6 ${card.bgColor}`}>
                  <button
                    type='button'
                    className={`w-full py-2.5 sm:py-3 px-4 rounded-xl font-semibold transition transform ${
                      hoveredCard === i
                        ? "bg-white shadow-lg motion-safe:scale-105"
                        : "bg-white/70"
                    } text-gray-800 flex items-center justify-center`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNavigate(card.to);
                    }}
                  >
                    <span className='text-sm sm:text-base'>
                      {t(`dashboard.cards.${card.key}Cta`)}
                    </span>
                    <svg
                      className='w-4 h-4 sm:w-5 sm:h-5 ml-2'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                      aria-hidden='true'
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
              </article>
            ))}
          </div>
        </section>

        {/* Recent Activity */}
        <section
          aria-labelledby='recent-activity'
          className='bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 border border-gray-100'
        >
          <h2
            id='recent-activity'
            className='text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center'
          >
            <span className='mr-2'>📈</span>
            {t("dashboard.recentActivity")}
          </h2>

          {/* Mobile: compact, scrollable list; Desktop: full list */}
          <div className='space-y-3 sm:space-y-4 max-h-80 sm:max-h-none overflow-y-auto pr-1'>
            {recentActivities.map((activity, idx) => (
              <div
                key={idx}
                className='flex items-start p-3 sm:p-4 rounded-xl hover:bg-gray-50 transition'
              >
                <div
                  className={`${activity.color} rounded-full p-2.5 sm:p-3 mr-3 sm:mr-4 text-xl sm:text-2xl shrink-0`}
                  aria-hidden='true'
                >
                  {activity.icon}
                </div>
                <div className='flex-1 min-w-0'>
                  <p className='font-semibold text-gray-800 text-sm sm:text-base truncate'>
                    {activity.key
                      ? t(activity.key, activity.params)
                      : activity.action}
                  </p>
                  <p className='text-xs sm:text-sm text-gray-600 mt-1 truncate'>
                    {activity.detailsKey
                      ? t(activity.detailsKey, activity.detailsParams)
                      : activity.details}
                  </p>
                  <p className='text-[11px] sm:text-xs text-gray-500 mt-1 sm:mt-2'>
                    {activity.timeKey ? t(activity.timeKey) : activity.time}
                  </p>
                </div>
                <button
                  type='button'
                  className='ml-2 text-gray-400 hover:text-gray-600 transition shrink-0'
                  aria-label='Open activity'
                >
                  <svg
                    className='w-4 h-4 sm:w-5 sm:h-5'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                    aria-hidden='true'
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

          <div className='mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200'>
            <button
              type='button'
              className='text-blue-600 hover:text-blue-700 font-semibold flex items-center transition text-sm sm:text-base'
            >
              {t("dashboard.viewAllActivity")}
              <svg
                className='w-4 h-4 ml-2'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                aria-hidden='true'
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
        </section>

        {/* Info Cards */}
        <section className='grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mt-6 sm:mt-8'>
          {/* Tips */}
          <article className='bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-lg p-4 sm:p-6 border-2 border-amber-200'>
            <div className='flex items-center mb-3 sm:mb-4'>
              <span
                className='text-2xl sm:text-3xl mr-2 sm:mr-3'
                aria-hidden='true'
              >
                💡
              </span>
              <h3 className='text-lg sm:text-xl font-bold text-gray-800'>
                {t("dashboard.quickTips")}
              </h3>
            </div>
            <ul className='space-y-2.5 sm:space-y-3'>
              <li className='flex items-start text-gray-700 text-sm sm:text-base'>
                <span className='text-green-600 mr-2'>✓</span>
                <span>
                  Update soil test results every season for accurate predictions
                </span>
              </li>
              <li className='flex items-start text-gray-700 text-sm sm:text-base'>
                <span className='text-green-600 mr-2'>✓</span>
                <span>
                  Monitor weather forecasts to optimize fertilizer application
                  timing
                </span>
              </li>
              <li className='flex items-start text-gray-700 text-sm sm:text-base'>
                <span className='text-green-600 mr-2'>✓</span>
                <span>
                  Compare multiple scenarios before final planting decisions
                </span>
              </li>
            </ul>
          </article>

          {/* System Status */}
          <article className='bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg p-4 sm:p-6 border-2 border-green-200'>
            <div className='flex items-center mb-3 sm:mb-4'>
              <span
                className='text-2xl sm:text-3xl mr-2 sm:mr-3'
                aria-hidden='true'
              >
                ⚙️
              </span>
              <h3 className='text-lg sm:text-xl font-bold text-gray-800'>
                {t("dashboard.systemStatus")}
              </h3>
            </div>
            <div className='space-y-2.5 sm:space-y-3'>
              <div className='flex items-center justify-between p-3 bg-white rounded-lg'>
                <span className='text-xs sm:text-sm text-gray-700'>
                  {t("dashboard.modelVersion")}
                </span>
                <span className='text-xs sm:text-sm font-semibold text-gray-800'>
                  v2.3.1
                </span>
              </div>
              <div className='flex items-center justify-between p-3 bg-white rounded-lg'>
                <span className='text-xs sm:text-sm text-gray-700'>
                  {t("dashboard.lastUpdated")}
                </span>
                <span className='text-xs sm:text-sm font-semibold text-gray-800'>
                  Nov 27, 2025
                </span>
              </div>
              <div className='flex items-center justify-between p-3 bg-white rounded-lg'>
                <span className='text-xs sm:text-sm text-gray-700'>
                  {t("dashboard.status")}
                </span>
                <span className='flex items-center text-xs sm:text-sm font-semibold text-green-600'>
                  <span className='w-2 h-2 bg-green-600 rounded-full mr-2'></span>
                  {t("dashboard.active")}
                </span>
              </div>
            </div>
          </article>
        </section>

        {/* Footer */}
        <footer className='mt-6 sm:mt-8 text-center text-gray-600 text-xs sm:text-sm'>
          <p>🌱 {t("dashboard.footer")}</p>
        </footer>
      </main>
=======
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
                {/* Decorative gradient overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                ></div>

                {/* Card Header */}
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

                {/* Card Footer */}
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

                {/* Badge */}
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

          {/* System Status - Takes 1 column */}
          <div className='bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl shadow-xl p-8 border-2 border-green-200'>
            <div className='flex items-center mb-6'>
              <span className='text-4xl mr-3'>⚙️</span>
              <h3 className='text-2xl font-bold text-gray-800'>
                System Status
              </h3>
            </div>

            <div className='space-y-4'>
              <div className='bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition'>
                <div className='flex justify-between items-center mb-2'>
                  <span className='text-sm text-gray-600 font-medium'>
                    Model Version
                  </span>
                  <span className='text-lg font-bold text-gray-800'>
                    v2.3.1
                  </span>
                </div>
                <div className='h-2 bg-gray-200 rounded-full overflow-hidden'>
                  <div className='h-full bg-gradient-to-r from-green-400 to-blue-500 w-full'></div>
                </div>
              </div>

              <div className='bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition'>
                <div className='flex justify-between items-center'>
                  <span className='text-sm text-gray-600 font-medium'>
                    Last Updated
                  </span>
                  <span className='text-sm font-semibold text-gray-800'>
                    Nov 27, 2025
                  </span>
                </div>
              </div>

              <div className='bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition'>
                <div className='flex justify-between items-center'>
                  <span className='text-sm text-gray-600 font-medium'>
                    Status
                  </span>
                  <span className='flex items-center text-sm font-bold text-green-600'>
                    <span className='relative flex h-3 w-3 mr-2'>
                      <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75'></span>
                      <span className='relative inline-flex rounded-full h-3 w-3 bg-green-500'></span>
                    </span>
                    Active
                  </span>
                </div>
              </div>

              <div className='bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-4 text-white mt-6'>
                <p className='text-sm font-medium mb-2'>💡 Quick Tip</p>
                <p className='text-xs leading-relaxed opacity-90'>
                  Update soil test results every season for more accurate
                  predictions.
                </p>
              </div>
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
              <h4 className='font-bold text-gray-800 mb-2'>Soil Management</h4>
              <p className='text-sm text-gray-600'>
                Update soil test results every season for accurate yield
                predictions
              </p>
            </div>
            <div className='bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition'>
              <div className='text-3xl mb-3'>🌤️</div>
              <h4 className='font-bold text-gray-800 mb-2'>
                Weather Monitoring
              </h4>
              <p className='text-sm text-gray-600'>
                Track forecasts to optimize fertilizer application timing
              </p>
            </div>
            <div className='bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition'>
              <div className='text-3xl mb-3'>📊</div>
              <h4 className='font-bold text-gray-800 mb-2'>
                Scenario Planning
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
>>>>>>> 0aa9b2edbeefa0bcf539f487f7fb2785e38743d4
    </div>
  );
}
