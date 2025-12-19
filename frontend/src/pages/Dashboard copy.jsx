import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../components/LanguageSwitcher.jsx";

export default function Dashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);

  const cards = [
    {
      title: "Start New Input",
      titleKey: "nav.input",
      desc: "Enter field details, costs and constraints to get predictions.",
      descKey: "dashboard.cards.inputDesc",
      to: "app/cost/in",
      cta: "Go to Input Page",
      ctaKey: "dashboard.cards.inputCta",
      icon: "📝",
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    {
      title: "View Results",
      titleKey: "nav.results",
      desc: "Check predicted yield, revenue and key metrics.",
      descKey: "dashboard.cards.resultsDesc",
      to: "app/cost/results",
      cta: "Open Results",
      ctaKey: "dashboard.cards.resultsCta",
      icon: "📊",
      color: "from-blue-500 to-indigo-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      title: "Recommendations",
      titleKey: "nav.recommendations",
      desc: "See actionable fertilizer, irrigation and variety tips.",
      descKey: "dashboard.cards.recoDesc",
      to: "app/cost/recommendations",
      cta: "See Recommendations",
      ctaKey: "dashboard.cards.recoCta",
      icon: "💡",
      color: "from-purple-500 to-pink-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
  ];

  const quickStats = [
    {
      label: "Datasets",
      labelKey: "dashboard.stats.datasets",
      value: 3,
      icon: "📁",
      color: "text-blue-600",
    },
    {
      label: "Scenarios Run",
      labelKey: "dashboard.stats.scenariosRun",
      value: 12,
      icon: "🔄",
      color: "text-green-600",
    },
    {
      label: "Avg. Predicted Yield (t/ha)",
      labelKey: "dashboard.stats.avgYield",
      value: 18.7,
      icon: "🌾",
      color: "text-amber-600",
    },
  ];

  const recentActivities = [
    {
      action: 'Ran prediction for "Yala-Field-A"',
      actionKey: "dashboard.activity.prediction",
      actionVars: { scenario: "Yala-Field-A" },
      details: "Soil: Loam, Budget: LKR 120k",
      detailsKey: "dashboard.activity.details1",
      time: "2 hours ago",
      timeKey: "dashboard.activity.time2h",
      icon: "🚜",
      color: "bg-green-100 text-green-700",
    },
    {
      action: "Updated fertilizer cost assumptions",
      actionKey: "dashboard.activity.updateFertilizer",
      details: "New rate: LKR 85/kg",
      detailsKey: "dashboard.activity.details2",
      time: "5 hours ago",
      timeKey: "dashboard.activity.time5h",
      icon: "💰",
      color: "bg-blue-100 text-blue-700",
    },
    {
      action: 'Exported PDF report for "Maha-Scenario-03"',
      actionKey: "dashboard.activity.export",
      actionVars: { scenario: "Maha-Scenario-03" },
      details: "3.2 MB file downloaded",
      detailsKey: "dashboard.activity.details3",
      time: "1 day ago",
      timeKey: "dashboard.activity.time1d",
      icon: "📄",
      color: "bg-purple-100 text-purple-700",
    },
  ];

  const handleNavigate = (path) => {
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
                <span className='truncate'>
                  {t("app.title", {
                    defaultValue: "Potato Farm Analytics Dashboard",
                  })}
                </span>
              </h1>
              <p className='text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base'>
                {t("dashboard.subtitle", {
                  defaultValue:
                    "Quick access to inputs, results and recommendations.",
                })}
              </p>
            </div>
            <div className='hidden md:block shrink-0'>
              <div className='flex items-center space-x-4'>
                <LanguageSwitcher />
                <div className='text-right'>
                  <p className='text-xs text-gray-600'>
                    {t("dashboard.welcome", { defaultValue: "Welcome back," })}
                  </p>
                  <p className='text-base font-semibold text-gray-800'>
                    {t("dashboard.userPlaceholder", { defaultValue: "Farmer" })}
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
            {t("dashboard.quickStats", { defaultValue: "Quick Stats" })}
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
                  {t(stat.labelKey, { defaultValue: stat.label })}
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
            {t("dashboard.quickActions", { defaultValue: "Quick Actions" })}
          </h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'>
            {cards.map((card, i) => (
              <article
                key={i}
                role='button'
                tabIndex={0}
                aria-label={t(card.titleKey, { defaultValue: card.title })}
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
                    {t(card.titleKey, { defaultValue: card.title })}
                  </h3>
                  <p className='text-xs sm:text-sm/relaxed opacity-90'>
                    {t(card.descKey, { defaultValue: card.desc })}
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
                      {t(card.ctaKey, { defaultValue: card.cta })}
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
            {t("dashboard.recentActivity", { defaultValue: "Recent Activity" })}
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
                    {t(activity.actionKey, {
                      defaultValue: activity.action,
                      ...activity.actionVars,
                    })}
                  </p>
                  <p className='text-xs sm:text-sm text-gray-600 mt-1 truncate'>
                    {t(activity.detailsKey, { defaultValue: activity.details })}
                  </p>
                  <p className='text-[11px] sm:text-xs text-gray-500 mt-1 sm:mt-2'>
                    {t(activity.timeKey, { defaultValue: activity.time })}
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
              {t("dashboard.viewAllActivity", {
                defaultValue: "View all activity",
              })}
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
                {t("dashboard.quickTips", { defaultValue: "Quick Tips" })}
              </h3>
            </div>
            <ul className='space-y-2.5 sm:space-y-3'>
              <li className='flex items-start text-gray-700 text-sm sm:text-base'>
                <span className='text-green-600 mr-2'>✓</span>
                <span>
                  {t("dashboard.tips.tip1", {
                    defaultValue:
                      "Update soil test results every season for accurate predictions",
                  })}
                </span>
              </li>
              <li className='flex items-start text-gray-700 text-sm sm:text-base'>
                <span className='text-green-600 mr-2'>✓</span>
                <span>
                  {t("dashboard.tips.tip2", {
                    defaultValue:
                      "Monitor weather forecasts to optimize fertilizer application timing",
                  })}
                </span>
              </li>
              <li className='flex items-start text-gray-700 text-sm sm:text-base'>
                <span className='text-green-600 mr-2'>✓</span>
                <span>
                  {t("dashboard.tips.tip3", {
                    defaultValue:
                      "Compare multiple scenarios before final planting decisions",
                  })}
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
                {t("dashboard.systemStatus", { defaultValue: "System Status" })}
              </h3>
            </div>
            <div className='space-y-2.5 sm:space-y-3'>
              <div className='flex items-center justify-between p-3 bg-white rounded-lg'>
                <span className='text-xs sm:text-sm text-gray-700'>
                  {t("dashboard.modelVersion", {
                    defaultValue: "Model Version",
                  })}
                </span>
                <span className='text-xs sm:text-sm font-semibold text-gray-800'>
                  v2.3.1
                </span>
              </div>
              <div className='flex items-center justify-between p-3 bg-white rounded-lg'>
                <span className='text-xs sm:text-sm text-gray-700'>
                  {t("dashboard.lastUpdated", { defaultValue: "Last Updated" })}
                </span>
                <span className='text-xs sm:text-sm font-semibold text-gray-800'>
                  Nov 27, 2025
                </span>
              </div>
              <div className='flex items-center justify-between p-3 bg-white rounded-lg'>
                <span className='text-xs sm:text-sm text-gray-700'>
                  {t("dashboard.status", { defaultValue: "Status" })}
                </span>
                <span className='flex items-center text-xs sm:text-sm font-semibold text-green-600'>
                  <span className='w-2 h-2 bg-green-600 rounded-full mr-2'></span>
                  {t("dashboard.active", { defaultValue: "Active" })}
                </span>
              </div>
            </div>
          </article>
        </section>

        {/* Footer */}
        <footer className='mt-6 sm:mt-8 text-center text-gray-600 text-xs sm:text-sm'>
          <p>
            🌱{" "}
            {t("dashboard.footer", {
              defaultValue:
                "Powered by Advanced Machine Learning Models | Built for Sri Lankan Potato Farmers",
            })}
          </p>
        </footer>
      </main>
    </div>
  );
}
