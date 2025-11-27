import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function InputPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Keep encoded values; translate only labels via t(key)
  const seasons = [
    { key: "season.maha", value: "0" },
    { key: "season.yala", value: "1" },
  ];

  const soilTypes = [
    { key: "soil.clay", value: "0" },
    { key: "soil.silty", value: "1" },
    { key: "soil.sandy", value: "2" },
    { key: "soil.loamy", value: "3" },
  ];

  const varieties = [
    { key: "var.granola", value: "0" },
    { key: "var.local", value: "1" },
    { key: "var.kufri", value: "2" },
  ];

  // District values as your backend expects; labels translated via keys
  const districts = [
    { key: "district.nuwara", value: "Nuwara Eliya" },
    { key: "district.badulla", value: "Badulla" },
    { key: "district.jaffna", value: "Jaffna" },
  ];

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const validate = () => {
    const newErrors = {};

    if (!form.season_type)
      newErrors.season_type = t("error.season", {
        defaultValue: "Please select a season",
      });

    if (!form.district)
      newErrors.district = t("error.district", {
        defaultValue: "Please select a district",
      });

    const fieldSize = parseFloat(form.field_size_acres);
    if (!form.field_size_acres)
      newErrors.field_size_acres = t("error.fieldSize.required", {
        defaultValue: "Field size is required",
      });
    else if (isNaN(fieldSize))
      newErrors.field_size_acres = t("error.fieldSize.number", {
        defaultValue: "Please enter a valid number",
      });
    else if (fieldSize <= 0)
      newErrors.field_size_acres = t("error.fieldSize.positive", {
        defaultValue: "Field size must be greater than 0",
      });
    else if (fieldSize > 5)
      newErrors.field_size_acres = t("error.fieldSize.max", {
        defaultValue: "Field size cannot exceed 5 acres",
      });

    if (!form.potato_variety)
      newErrors.potato_variety = t("error.variety", {
        defaultValue: "Please select a potato variety",
      });

    if (!form.soil_type)
      newErrors.soil_type = t("error.soil", {
        defaultValue: "Please select a soil type",
      });

    const fertilizer = parseFloat(form.planned_fertilizer_kg_per_acre);
    if (!form.planned_fertilizer_kg_per_acre)
      newErrors.planned_fertilizer_kg_per_acre = t(
        "error.fertilizer.required",
        { defaultValue: "Fertilizer amount is required" }
      );
    else if (isNaN(fertilizer))
      newErrors.planned_fertilizer_kg_per_acre = t("error.fertilizer.number", {
        defaultValue: "Please enter a valid number",
      });
    else if (fertilizer < 0)
      newErrors.planned_fertilizer_kg_per_acre = t(
        "error.fertilizer.negative",
        { defaultValue: "Fertilizer amount cannot be negative" }
      );

    const seedCost = parseFloat(form.seed_cost_lkr);
    if (!form.seed_cost_lkr)
      newErrors.seed_cost_lkr = t("error.seed.required", {
        defaultValue: "Seed cost is required",
      });
    else if (isNaN(seedCost))
      newErrors.seed_cost_lkr = t("error.seed.number", {
        defaultValue: "Please enter a valid number",
      });
    else if (seedCost < 0)
      newErrors.seed_cost_lkr = t("error.seed.negative", {
        defaultValue: "Seed cost cannot be negative",
      });

    const fertilizerCost = parseFloat(form.fertilizer_cost_lkr);
    if (!form.fertilizer_cost_lkr)
      newErrors.fertilizer_cost_lkr = t("error.fertCost.required", {
        defaultValue: "Fertilizer cost is required",
      });
    else if (isNaN(fertilizerCost))
      newErrors.fertilizer_cost_lkr = t("error.fertCost.number", {
        defaultValue: "Please enter a valid number",
      });
    else if (fertilizerCost < 0)
      newErrors.fertilizer_cost_lkr = t("error.fertCost.negative", {
        defaultValue: "Fertilizer cost cannot be negative",
      });

    const laborCost = parseFloat(form.labor_cost_lkr);
    if (!form.labor_cost_lkr)
      newErrors.labor_cost_lkr = t("error.labor.required", {
        defaultValue: "Labor cost is required",
      });
    else if (isNaN(laborCost))
      newErrors.labor_cost_lkr = t("error.labor.number", {
        defaultValue: "Please enter a valid number",
      });
    else if (laborCost < 0)
      newErrors.labor_cost_lkr = t("error.labor.negative", {
        defaultValue: "Labor cost cannot be negative",
      });

    const handsOnMoney = parseFloat(form.hands_on_money_lkr);
    if (!form.hands_on_money_lkr)
      newErrors.hands_on_money_lkr = t("error.capital.required", {
        defaultValue: "Available capital is required",
      });
    else if (isNaN(handsOnMoney))
      newErrors.hands_on_money_lkr = t("error.capital.number", {
        defaultValue: "Please enter a valid number",
      });
    else if (handsOnMoney < 150000)
      newErrors.hands_on_money_lkr = t("error.capital.min", {
        defaultValue: "Minimum capital required is LKR 150,000",
      });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submit = () => {
    if (validate()) {
      setSubmitted(true);
      // Persist so Results can read on refresh
      sessionStorage.setItem("lastForm", JSON.stringify(form));
      // Navigate to results with form
      navigate("/results", { state: { form } });
    } else {
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
              🥔 Potato Farm Analytics
            </h1>
            <p className='text-gray-600'>
              {t("input.subtitle", {
                defaultValue:
                  "Enter your farm details for yield and profit prediction",
              })}
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
                    {t("input.success", {
                      defaultValue: "Success! Redirecting to results…",
                    })}
                  </p>
                  <p className='text-sm'>
                    {t("input.successHint", {
                      defaultValue: "If not redirected, click Predict again.",
                    })}
                  </p>
                </div>
              </div>
              <button
                onClick={reset}
                className='mt-3 text-sm underline hover:text-green-900'
              >
                {t("input.submitAnother", {
                  defaultValue: "Submit another entry",
                })}
              </button>
            </div>
          )}

          <div className='space-y-6'>
            {/* Season & Location */}
            <div className='bg-green-50 p-6 rounded-xl'>
              <h2 className='text-xl font-semibold text-green-800 mb-4'>
                📅{" "}
                {t("section.seasonLocation", {
                  defaultValue: "Season & Location",
                })}
              </h2>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {/* Season */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    {t("label.season", { defaultValue: "Season" })} *
                  </label>
                  <select
                    name='season_type'
                    value={form.season_type}
                    onChange={handleChange}
                    className={`w-full border ${
                      errors.season_type ? "border-red-500" : "border-gray-300"
                    } rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white`}
                  >
                    <option value=''>
                      {t("select.season", { defaultValue: "Select Season" })}
                    </option>
                    {seasons.map((s) => (
                      <option key={s.value} value={s.value}>
                        {t(s.key)}
                      </option>
                    ))}
                  </select>
                  {errors.season_type && (
                    <p className='text-red-500 text-xs mt-1'>
                      {errors.season_type}
                    </p>
                  )}
                </div>

                {/* District */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    {t("label.district", { defaultValue: "District" })} *
                  </label>
                  <select
                    name='district'
                    value={form.district}
                    onChange={handleChange}
                    className={`w-full border ${
                      errors.district ? "border-red-500" : "border-gray-300"
                    } rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white`}
                  >
                    <option value=''>
                      {t("select.district", {
                        defaultValue: "Select District",
                      })}
                    </option>
                    {districts.map((d) => (
                      <option key={d.value} value={d.value}>
                        {t(d.key)}
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

            {/* Farm Details */}
            <div className='bg-blue-50 p-6 rounded-xl'>
              <h2 className='text-xl font-semibold text-blue-800 mb-4'>
                🌱 {t("section.farmDetails", { defaultValue: "Farm Details" })}
              </h2>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {/* Field size */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    {t("label.fieldSize", {
                      defaultValue: "Field Size (Acres)",
                    })}{" "}
                    *
                  </label>
                  <input
                    type='number'
                    name='field_size_acres'
                    value={form.field_size_acres}
                    onChange={handleChange}
                    placeholder={t("placeholder.fieldSize", {
                      defaultValue: "Max 5 acres",
                    })}
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

                {/* Variety */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    {t("label.variety", { defaultValue: "Potato Variety" })} *
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
                    <option value=''>
                      {t("select.variety", { defaultValue: "Select Variety" })}
                    </option>
                    {varieties.map((v) => (
                      <option key={v.value} value={v.value}>
                        {t(v.key)}
                      </option>
                    ))}
                  </select>
                  {errors.potato_variety && (
                    <p className='text-red-500 text-xs mt-1'>
                      {errors.potato_variety}
                    </p>
                  )}
                </div>

                {/* Soil */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    {t("label.soil", { defaultValue: "Soil Type" })} *
                  </label>
                  <select
                    name='soil_type'
                    value={form.soil_type}
                    onChange={handleChange}
                    className={`w-full border ${
                      errors.soil_type ? "border-red-500" : "border-gray-300"
                    } rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white`}
                  >
                    <option value=''>
                      {t("select.soil", { defaultValue: "Select Soil Type" })}
                    </option>
                    {soilTypes.map((s) => (
                      <option key={s.value} value={s.value}>
                        {t(s.key)}
                      </option>
                    ))}
                  </select>
                  {errors.soil_type && (
                    <p className='text-red-500 text-xs mt-1'>
                      {errors.soil_type}
                    </p>
                  )}
                </div>

                {/* Planned fertilizer */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    {t("label.fertilizerPlan", {
                      defaultValue: "Planned Fertilizer (kg/acre)",
                    })}{" "}
                    *
                  </label>
                  <input
                    type='number'
                    name='planned_fertilizer_kg_per_acre'
                    value={form.planned_fertilizer_kg_per_acre}
                    onChange={handleChange}
                    placeholder={t("placeholder.fertilizer", {
                      defaultValue: "Enter amount",
                    })}
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

            {/* Cost Details */}
            <div className='bg-amber-50 p-6 rounded-xl'>
              <h2 className='text-xl font-semibold text-amber-800 mb-4'>
                💰{" "}
                {t("section.costDetails", {
                  defaultValue: "Cost Details (LKR)",
                })}
              </h2>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {/* Seed cost */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    {t("label.seedCost", { defaultValue: "Seed Cost" })} *
                  </label>
                  <input
                    type='number'
                    name='seed_cost_lkr'
                    value={form.seed_cost_lkr}
                    onChange={handleChange}
                    placeholder={t("placeholder.seedCost", {
                      defaultValue: "Enter seed cost",
                    })}
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

                {/* Fertilizer cost */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    {t("label.fertCost", { defaultValue: "Fertilizer Cost" })} *
                  </label>
                  <input
                    type='number'
                    name='fertilizer_cost_lkr'
                    value={form.fertilizer_cost_lkr}
                    onChange={handleChange}
                    placeholder={t("placeholder.fertCost", {
                      defaultValue: "Enter fertilizer cost",
                    })}
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

                {/* Labor cost */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    {t("label.laborCost", { defaultValue: "Labor Cost" })} *
                  </label>
                  <input
                    type='number'
                    name='labor_cost_lkr'
                    value={form.labor_cost_lkr}
                    onChange={handleChange}
                    placeholder={t("placeholder.laborCost", {
                      defaultValue: "Enter labor cost",
                    })}
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

                {/* Capital */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    {t("label.capital", { defaultValue: "Available Capital" })}{" "}
                    *
                  </label>
                  <input
                    type='number'
                    name='hands_on_money_lkr'
                    value={form.hands_on_money_lkr}
                    onChange={handleChange}
                    placeholder={t("placeholder.capital", {
                      defaultValue: "Min LKR 150,000",
                    })}
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

            {/* Submit */}
            <button
              onClick={submit}
              className='w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transform transition hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300'
            >
              {t("cta.predict", { defaultValue: "🚀 Predict Yield & Profit" })}
            </button>
          </div>
        </div>

        <div className='mt-6 text-center text-gray-600 text-sm'>
          <p>
            {t("input.allRequired", {
              defaultValue: "* All fields are required",
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
