import { useState } from "react";

export default function InputPage() {
  const [form, setForm] = useState({
    season_type: "",
    district: "",
    field_size_acres: "",
    potato_variety: "",
    soil_type: "",
    planned_fertilizer_kg_per_acre: "",
    seed_cost_lkr: "",
    fertilizer_cost_lkr: "",
    labor_cost_lkr: "",
    hands_on_money_lkr: "",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const districts = ["Nuwara Eliya", "Badulla", "Jaffna"];

  // Varieties with encoded values for backend
  const varieties = [
    { label: "Granola", value: "0" },
    { label: "Local", value: "1" },
    { label: "Kufri", value: "2" },
  ];

  // Seasons with encoded values for backend
  const seasons = [
    { label: "Maha", value: "0" },
    { label: "Yala", value: "1" },
  ];

  // Soil types with encoded values for backend
  const soilTypes = [
    { label: "Clay", value: "0" },
    { label: "Silty", value: "1" },
    { label: "Sandy", value: "2" },
    { label: "Loamy", value: "3" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validate = () => {
    const newErrors = {};

    // Season validation
    if (!form.season_type) {
      newErrors.season_type = "Please select a season";
    }

    // District validation
    if (!form.district) {
      newErrors.district = "Please select a district";
    }

    // Field size validation
    const fieldSize = parseFloat(form.field_size_acres);
    if (!form.field_size_acres) {
      newErrors.field_size_acres = "Field size is required";
    } else if (isNaN(fieldSize)) {
      newErrors.field_size_acres = "Please enter a valid number";
    } else if (fieldSize <= 0) {
      newErrors.field_size_acres = "Field size must be greater than 0";
    } else if (fieldSize > 5) {
      newErrors.field_size_acres = "Field size cannot exceed 5 acres";
    }

    // Potato variety validation
    if (!form.potato_variety) {
      newErrors.potato_variety = "Please select a potato variety";
    }

    // Soil type validation
    if (!form.soil_type) {
      newErrors.soil_type = "Please select a soil type";
    }

    // Fertilizer validation
    const fertilizer = parseFloat(form.planned_fertilizer_kg_per_acre);
    if (!form.planned_fertilizer_kg_per_acre) {
      newErrors.planned_fertilizer_kg_per_acre =
        "Fertilizer amount is required";
    } else if (isNaN(fertilizer)) {
      newErrors.planned_fertilizer_kg_per_acre = "Please enter a valid number";
    } else if (fertilizer < 0) {
      newErrors.planned_fertilizer_kg_per_acre =
        "Fertilizer amount cannot be negative";
    }

    // Seed cost validation
    const seedCost = parseFloat(form.seed_cost_lkr);
    if (!form.seed_cost_lkr) {
      newErrors.seed_cost_lkr = "Seed cost is required";
    } else if (isNaN(seedCost)) {
      newErrors.seed_cost_lkr = "Please enter a valid number";
    } else if (seedCost < 0) {
      newErrors.seed_cost_lkr = "Seed cost cannot be negative";
    }

    // Fertilizer cost validation
    const fertilizerCost = parseFloat(form.fertilizer_cost_lkr);
    if (!form.fertilizer_cost_lkr) {
      newErrors.fertilizer_cost_lkr = "Fertilizer cost is required";
    } else if (isNaN(fertilizerCost)) {
      newErrors.fertilizer_cost_lkr = "Please enter a valid number";
    } else if (fertilizerCost < 0) {
      newErrors.fertilizer_cost_lkr = "Fertilizer cost cannot be negative";
    }

    // Labor cost validation
    const laborCost = parseFloat(form.labor_cost_lkr);
    if (!form.labor_cost_lkr) {
      newErrors.labor_cost_lkr = "Labor cost is required";
    } else if (isNaN(laborCost)) {
      newErrors.labor_cost_lkr = "Please enter a valid number";
    } else if (laborCost < 0) {
      newErrors.labor_cost_lkr = "Labor cost cannot be negative";
    }

    // Available capital validation
    const handsOnMoney = parseFloat(form.hands_on_money_lkr);
    if (!form.hands_on_money_lkr) {
      newErrors.hands_on_money_lkr = "Available capital is required";
    } else if (isNaN(handsOnMoney)) {
      newErrors.hands_on_money_lkr = "Please enter a valid number";
    } else if (handsOnMoney < 150000) {
      newErrors.hands_on_money_lkr = "Minimum capital required is LKR 150,000";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submit = () => {
    if (validate()) {
      setSubmitted(true);
      console.log("Form Data:", form);

      // Scroll to top to see success message
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Scroll to first error
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const reset = () => {
    setForm({
      season_type: "",
      district: "",
      field_size_acres: "",
      potato_variety: "",
      soil_type: "",
      planned_fertilizer_kg_per_acre: "",
      seed_cost_lkr: "",
      fertilizer_cost_lkr: "",
      labor_cost_lkr: "",
      hands_on_money_lkr: "",
    });
    setErrors({});
    setSubmitted(false);
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8 px-4'>
      <div className='max-w-4xl mx-auto'>
        <div className='bg-white rounded-2xl shadow-xl p-8'>
          <div className='text-center mb-8'>
            <h1 className='text-4xl font-bold text-green-800 mb-2'>
              🥔 Potato Farm Analytics - By Hashini
            </h1>
            <p className='text-gray-600'>
              Enter your farm details for yield and profit prediction
            </p>
          </div>

          {submitted && (
            <div className='bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded'>
              <div className='flex items-center'>
                <div className='flex-shrink-0'>
                  <svg
                    className='h-5 w-5'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                      clipRule='evenodd'
                    />
                  </svg>
                </div>
                <div className='ml-3'>
                  <p className='font-medium'>
                    Success! Your data has been submitted.
                  </p>
                  <p className='text-sm'>
                    In the actual app, you would be redirected to the results
                    page.
                  </p>
                </div>
              </div>
              <button
                onClick={reset}
                className='mt-3 text-sm underline hover:text-green-900'
              >
                Submit another entry
              </button>
            </div>
          )}

          <div className='space-y-6'>
            {/* Season & Location Section */}
            <div className='bg-green-50 p-6 rounded-xl'>
              <h2 className='text-xl font-semibold text-green-800 mb-4'>
                📅 Season & Location
              </h2>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Season *
                  </label>
                  <select
                    name='season_type'
                    value={form.season_type}
                    onChange={handleChange}
                    className={`w-full border ${
                      errors.season_type ? "border-red-500" : "border-gray-300"
                    } rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white`}
                  >
                    <option value=''>Select Season</option>
                    {seasons.map((season) => (
                      <option key={season.value} value={season.value}>
                        {season.label}
                      </option>
                    ))}
                  </select>
                  {errors.season_type && (
                    <p className='text-red-500 text-xs mt-1'>
                      {errors.season_type}
                    </p>
                  )}
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    District *
                  </label>
                  <select
                    name='district'
                    value={form.district}
                    onChange={handleChange}
                    className={`w-full border ${
                      errors.district ? "border-red-500" : "border-gray-300"
                    } rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white`}
                  >
                    <option value=''>Select District</option>
                    {districts.map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                  {errors.district && (
                    <p className='text-red-500 text-xs mt-1'>
                      {errors.district}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Farm Details Section */}
            <div className='bg-blue-50 p-6 rounded-xl'>
              <h2 className='text-xl font-semibold text-blue-800 mb-4'>
                🌱 Farm Details
              </h2>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Field Size (Acres) *
                  </label>
                  <input
                    type='number'
                    name='field_size_acres'
                    value={form.field_size_acres}
                    onChange={handleChange}
                    placeholder='Max 5 acres'
                    step='0.1'
                    min='0.1'
                    max='5'
                    className={`w-full border ${
                      errors.field_size_acres
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  />
                  {errors.field_size_acres && (
                    <p className='text-red-500 text-xs mt-1'>
                      {errors.field_size_acres}
                    </p>
                  )}
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Potato Variety *
                  </label>
                  <select
                    name='potato_variety'
                    value={form.potato_variety}
                    onChange={handleChange}
                    className={`w-full border ${
                      errors.potato_variety
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white`}
                  >
                    <option value=''>Select Variety</option>
                    {varieties.map((variety) => (
                      <option key={variety.value} value={variety.value}>
                        {variety.label}
                      </option>
                    ))}
                  </select>
                  {errors.potato_variety && (
                    <p className='text-red-500 text-xs mt-1'>
                      {errors.potato_variety}
                    </p>
                  )}
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Soil Type *
                  </label>
                  <select
                    name='soil_type'
                    value={form.soil_type}
                    onChange={handleChange}
                    className={`w-full border ${
                      errors.soil_type ? "border-red-500" : "border-gray-300"
                    } rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white`}
                  >
                    <option value=''>Select Soil Type</option>
                    {soilTypes.map((soil) => (
                      <option key={soil.value} value={soil.value}>
                        {soil.label}
                      </option>
                    ))}
                  </select>
                  {errors.soil_type && (
                    <p className='text-red-500 text-xs mt-1'>
                      {errors.soil_type}
                    </p>
                  )}
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Planned Fertilizer (kg/acre) *
                  </label>
                  <input
                    type='number'
                    name='planned_fertilizer_kg_per_acre'
                    value={form.planned_fertilizer_kg_per_acre}
                    onChange={handleChange}
                    placeholder='Enter amount'
                    step='0.1'
                    min='0'
                    className={`w-full border ${
                      errors.planned_fertilizer_kg_per_acre
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  />
                  {errors.planned_fertilizer_kg_per_acre && (
                    <p className='text-red-500 text-xs mt-1'>
                      {errors.planned_fertilizer_kg_per_acre}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Cost Details Section */}
            <div className='bg-amber-50 p-6 rounded-xl'>
              <h2 className='text-xl font-semibold text-amber-800 mb-4'>
                💰 Cost Details (LKR)
              </h2>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Seed Cost *
                  </label>
                  <input
                    type='number'
                    name='seed_cost_lkr'
                    value={form.seed_cost_lkr}
                    onChange={handleChange}
                    placeholder='Enter seed cost'
                    step='0.01'
                    min='0'
                    className={`w-full border ${
                      errors.seed_cost_lkr
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-lg p-3 focus:ring-2 focus:ring-amber-500 focus:border-transparent`}
                  />
                  {errors.seed_cost_lkr && (
                    <p className='text-red-500 text-xs mt-1'>
                      {errors.seed_cost_lkr}
                    </p>
                  )}
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Fertilizer Cost *
                  </label>
                  <input
                    type='number'
                    name='fertilizer_cost_lkr'
                    value={form.fertilizer_cost_lkr}
                    onChange={handleChange}
                    placeholder='Enter fertilizer cost'
                    step='0.01'
                    min='0'
                    className={`w-full border ${
                      errors.fertilizer_cost_lkr
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-lg p-3 focus:ring-2 focus:ring-amber-500 focus:border-transparent`}
                  />
                  {errors.fertilizer_cost_lkr && (
                    <p className='text-red-500 text-xs mt-1'>
                      {errors.fertilizer_cost_lkr}
                    </p>
                  )}
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Labor Cost *
                  </label>
                  <input
                    type='number'
                    name='labor_cost_lkr'
                    value={form.labor_cost_lkr}
                    onChange={handleChange}
                    placeholder='Enter labor cost'
                    step='0.01'
                    min='0'
                    className={`w-full border ${
                      errors.labor_cost_lkr
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-lg p-3 focus:ring-2 focus:ring-amber-500 focus:border-transparent`}
                  />
                  {errors.labor_cost_lkr && (
                    <p className='text-red-500 text-xs mt-1'>
                      {errors.labor_cost_lkr}
                    </p>
                  )}
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Available Capital *
                  </label>
                  <input
                    type='number'
                    name='hands_on_money_lkr'
                    value={form.hands_on_money_lkr}
                    onChange={handleChange}
                    placeholder='Min LKR 150,000'
                    step='0.01'
                    min='150000'
                    className={`w-full border ${
                      errors.hands_on_money_lkr
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-lg p-3 focus:ring-2 focus:ring-amber-500 focus:border-transparent`}
                  />
                  {errors.hands_on_money_lkr && (
                    <p className='text-red-500 text-xs mt-1'>
                      {errors.hands_on_money_lkr}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={submit}
              className='w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transform transition hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300'
            >
              🚀 Predict Yield & Profit
            </button>
          </div>
        </div>

        <div className='mt-6 text-center text-gray-600 text-sm'>
          <p>* All fields are required</p>
        </div>
      </div>
    </div>
  );
}
