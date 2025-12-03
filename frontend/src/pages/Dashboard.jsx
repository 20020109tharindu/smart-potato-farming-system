import { Link } from "react-router-dom";

export default function Dashboard() {
  /**
   *      kjfhjkdfhkjdhfjkdhfjkdjkfh
   */
  const cards = [
    {
      title: "Start New Input",
      desc: "Enter field details, costs and constraints to get predictions.",
      to: "/app/in",
      cta: "Go to Input Page",
    },
    {
      title: "View Results",
      desc: "Check predicted yield, revenue and key metrics.",
      to: "/app/results",
      cta: "Open Results",
    },
    {
      title: "Recommendations",
      desc: "See actionable fertilizer, irrigation and variety tips.",
      to: "/app/recommendations",
      cta: "See Recommendations",
    },
  ];

  const quickStats = [
    { label: "Datasets", value: 3 },
    { label: "Scenarios Run", value: 12 },
    { label: "Avg. Predicted Yield (t/ha)", value: 18.7 },
  ];

  return (
    <div className='max-w-6xl mx-auto p-6'>
      {/* Header */}
      <div className='mb-6'>
        <h2 className='text-3xl font-bold text-gray-900'>Dashboard</h2>
        <p className='text-gray-600'>
          Quick access to inputs, results and recommendations.
        </p>
      </div>

      {/* Quick stats */}
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8'>
        {quickStats.map((s, idx) => (
          <div key={idx} className='bg-white rounded-2xl shadow p-5'>
            <div className='text-sm text-gray-500'>{s.label}</div>
            <div className='text-2xl font-semibold'>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Navigation cards */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {cards.map((c, i) => (
          <div
            key={i}
            className='bg-white rounded-2xl shadow p-6 flex flex-col'
          >
            <h3 className='text-xl font-semibold mb-2'>{c.title}</h3>
            <p className='text-gray-600 flex-1'>{c.desc}</p>
            <Link
              to={c.to}
              className='mt-4 inline-flex items-center justify-center rounded-xl border border-green-600 px-4 py-2 font-medium text-green-700 hover:bg-green-50'
            >
              {c.cta}
            </Link>
          </div>
        ))}
      </div>

      {/* Recent activity (placeholder) */}
      <div className='mt-8 bg-white rounded-2xl shadow'>
        <div className='px-6 py-4 border-b'>
          <h4 className='font-semibold'>Recent Activity</h4>
        </div>
        <ul className='divide-y'>
          <li className='px-6 py-3 text-sm text-gray-700'>
            • Ran prediction for “Yala-Field-A” (Soil: Loam, Budget: LKR 120k)
          </li>
          <li className='px-6 py-3 text-sm text-gray-700'>
            • Updated fertilizer cost assumptions
          </li>
          <li className='px-6 py-3 text-sm text-gray-700'>
            • Exported PDF report for “Maha-Scenario-03”
          </li>
        </ul>
      </div>
    </div>
  );
}
