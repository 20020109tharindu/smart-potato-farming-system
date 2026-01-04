import { useMemo, useState } from "react";
import {
  Sprout,
  TrendingUp,
  MapPin,
  Droplets,
  DollarSign,
  Package,
  Users,
  Award,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Info,
  Calculator,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function InputPage() {
  // const navigate = useNavigate();

  const [form, setForm] = useState({
    season_type: "",
    district: "",
    field_size_acres: "",
    soil_type: "",
    crop_quality: "",
    planned_fertilizer_kg_per_acre: "",
    seed_cost_lkr: "",
    fertilizer_cost_lkr: "",
    labor_cost_lkr: "",
    hands_on_money_lkr: "",
  });
  const navigate = useNavigate();

  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const districts = ["Nuwara_Eliya", "Badulla"];
  const seasons = [
    { label: "Maha", value: "Maha" },
    { label: "Yala", value: "Yala" },
  ];
  const soilTypes = [
    { label: "Clay Loam", value: "Clay_Loam" },
    { label: "Sandy Loam", value: "Sandy_Loam" },
    { label: "Loam", value: "Loam" },
  ];
  const cropQualities = [
    { label: "Low", value: "Low" },
    { label: "Medium", value: "Medium" },
    { label: "High", value: "High" },
  ];

  const CONFIG = {
    fieldSize: { min: 0.01, max: 1000, maxDecimals: 3 },
    fertilizerKgPerAcre: { min: 0, max: 5000, maxDecimals: 2 },
    currency: { min: 0, max: 100000000, maxDecimals: 2 },
  };

  const toNumber = (v) => {
    if (v === "" || v === null || v === undefined) return NaN;
    const n = Number(String(v).replace(/,/g, ""));
    return Number.isFinite(n) ? n : NaN;
  };

  const hasMaxDecimals = (value, maxDecimals) => {
    if (value === "" || value == null) return true;
    const s = String(value);
    if (!s.includes(".")) return true;
    return s.split(".")[1].length <= maxDecimals;
  };

  const isNonNegativeNumber = (value) => {
    const n = toNumber(value);
    return !Number.isNaN(n) && n >= 0;
  };

  const isPositiveNumber = (value) => {
    const n = toNumber(value);
    return !Number.isNaN(n) && n > 0;
  };

  const validateField = (name, value) => {
    const v = typeof value === "string" ? value.trim() : value;

    switch (name) {
      case "season_type":
      case "district":
      case "soil_type":
      case "crop_quality":
        if (!v) return "This field is required.";
        return "";

      case "field_size_acres": {
        if (v === "") return "Field size is required.";
        if (!isPositiveNumber(v)) return "Enter a number greater than 0.";
        if (!hasMaxDecimals(v, CONFIG.fieldSize.maxDecimals))
          return `Max ${CONFIG.fieldSize.maxDecimals} decimal places allowed.`;
        const n = toNumber(v);
        if (n < CONFIG.fieldSize.min)
          return `Minimum is ${CONFIG.fieldSize.min} acre(s).`;
        if (n > CONFIG.fieldSize.max)
          return `Value seems too large (max ${CONFIG.fieldSize.max}).`;
        return "";
      }

      case "planned_fertilizer_kg_per_acre": {
        if (v === "") return "Fertilizer amount is required.";
        if (!isNonNegativeNumber(v)) return "Enter a valid number ≥ 0.";
        if (!hasMaxDecimals(v, CONFIG.fertilizerKgPerAcre.maxDecimals))
          return `Max ${CONFIG.fertilizerKgPerAcre.maxDecimals} decimal places.`;
        const n = toNumber(v);
        if (n < CONFIG.fertilizerKgPerAcre.min)
          return `Minimum ${CONFIG.fertilizerKgPerAcre.min}.`;
        if (n > CONFIG.fertilizerKgPerAcre.max)
          return `Value seems too large (max ${CONFIG.fertilizerKgPerAcre.max}).`;
        return "";
      }

      case "seed_cost_lkr":
      case "fertilizer_cost_lkr":
      case "labor_cost_lkr":
      case "hands_on_money_lkr": {
        if (v === "") return "This cost is required.";
        if (!isNonNegativeNumber(v)) return "Enter a valid number ≥ 0.";
        if (!hasMaxDecimals(v, CONFIG.currency.maxDecimals))
          return `Max ${CONFIG.currency.maxDecimals} decimal places.`;
        const n = toNumber(v);
        if (n < CONFIG.currency.min)
          return `Minimum is ${CONFIG.currency.min}.`;
        if (n > CONFIG.currency.max) return "Value exceeds allowed maximum.";
        return "";
      }

      default:
        return "";
    }
  };

  const validateAll = (currentForm = form) => {
    const newErrors = {};
    Object.entries(currentForm).forEach(([k, v]) => {
      const err = validateField(k, v);
      if (err) newErrors[k] = err;
    });

    const seed = toNumber(currentForm.seed_cost_lkr || 0);
    const fert = toNumber(currentForm.fertilizer_cost_lkr || 0);
    const labor = toNumber(currentForm.labor_cost_lkr || 0);
    const capital = toNumber(currentForm.hands_on_money_lkr || 0);
    const totalCost =
      (Number.isNaN(seed) ? 0 : seed) +
      (Number.isNaN(fert) ? 0 : fert) +
      (Number.isNaN(labor) ? 0 : labor);

    const allCostsAreNumbers =
      !Number.isNaN(seed) &&
      !Number.isNaN(fert) &&
      !Number.isNaN(labor) &&
      !Number.isNaN(capital);

    if (allCostsAreNumbers && capital < totalCost) {
      newErrors.hands_on_money_lkr =
        "Available capital is less than the total estimated cost (seed + fertilizer + labour).";
    }

    return newErrors;
  };

  const totals = useMemo(() => {
    const seed = toNumber(form.seed_cost_lkr) || 0;
    const fert = toNumber(form.fertilizer_cost_lkr) || 0;
    const labor = toNumber(form.labor_cost_lkr) || 0;
    const capital = toNumber(form.hands_on_money_lkr) || 0;
    const totalCost = seed + fert + labor;
    const difference = Number.isFinite(capital) ? capital - totalCost : NaN;
    return { seed, fert, labor, capital, totalCost, difference };
  }, [
    form.seed_cost_lkr,
    form.fertilizer_cost_lkr,
    form.labor_cost_lkr,
    form.hands_on_money_lkr,
  ]);

  const isFormValid = useMemo(() => {
    const newErrors = validateAll();
    return Object.keys(newErrors).length === 0;
  }, [form]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const err = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: err }));

    if (
      [
        "seed_cost_lkr",
        "fertilizer_cost_lkr",
        "labor_cost_lkr",
        "hands_on_money_lkr",
      ].includes(name)
    ) {
      const cross = validateAll({ ...form, [name]: value });
      setErrors((prev) => ({ ...prev, ...cross }));
    }
  };

  const handleSubmit = async () => {
    const allTouched = Object.keys(form).reduce(
      (acc, k) => ({ ...acc, [k]: true }),
      {}
    );
    setTouched(allTouched);

    const newErrors = validateAll();
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    setSubmitting(true);
    try {
      const payload = {
        season: form.season_type,
        district: form.district,
        field_size_acres: Number(form.field_size_acres),
        soil_type: form.soil_type,
        planned_fertilizer_kg_per_acre: Number(
          form.planned_fertilizer_kg_per_acre
        ),
        seed_cost_lkr: Number(form.seed_cost_lkr),
        fertilizer_cost_lkr: Number(form.fertilizer_cost_lkr),
        labor_cost_lkr: Number(form.labor_cost_lkr),
        crop_quality: form.crop_quality,
        hands_on_money_lkr: Number(form.hands_on_money_lkr),
      };

      const res = await fetch("http://127.0.0.1:5000/potato_analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Server error");

      const data = await res.json();
      sessionStorage.setItem("analysisResult", JSON.stringify(data));
      sessionStorage.setItem("lastForm", JSON.stringify(form));

      // ✅ THIS IS THE KEY LINE
      navigate("/app/cost/results");
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        _submission: err.message || "Submission failed.",
      }));
    } finally {
      setSubmitting(false);
    }
  };

  const showFieldError = (field) => Boolean(errors[field] && touched[field]);

  return (
    <div className='min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50'>
      {/* Header */}
      <div className='bg-white/80 backdrop-blur-sm border-b border-emerald-100 sticky top-0 z-10'>
        <div className='max-w-5xl mx-auto px-6 py-4 flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='bg-gradient-to-br from-emerald-500 to-teal-600 p-2 rounded-xl'>
              <Sprout className='w-6 h-6 text-white' />
            </div>
            <div>
              <h1 className='text-xl font-bold text-gray-900'>AgriSense AI</h1>
              <p className='text-xs text-gray-600'>Validated Profit Analysis</p>
            </div>
          </div>
          <div className='flex items-center gap-2 text-emerald-600'>
            <Sparkles className='w-4 h-4' />
            <span className='text-sm font-medium'>
              Research-Grade Validation
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='max-w-5xl mx-auto px-6 py-12'>
        {/* Hero Section */}
        <div className='text-center mb-12'>
          <div className='inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-4'>
            <CheckCircle2 className='w-4 h-4' />
            Enhanced Input Validation
          </div>
          <h2 className='text-4xl font-bold text-gray-900 mb-3'>
            Optimize Your Potato Cultivation
          </h2>
          <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
            Research-validated input system with real-time validation and
            intelligent cost analysis
          </p>
        </div>

        {/* Submission Error Alert */}
        {errors._submission && (
          <div className='mb-6 bg-red-50 border-l-4 border-red-500 rounded-lg p-4 flex items-start gap-3'>
            <AlertCircle className='w-5 h-5 text-red-500 flex-shrink-0 mt-0.5' />
            <div>
              <h4 className='font-semibold text-red-900 mb-1'>
                Submission Error
              </h4>
              <p className='text-red-700 text-sm'>{errors._submission}</p>
            </div>
          </div>
        )}

        {/* Form Card */}
        <div className='bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden'>
          <div className='bg-gradient-to-r from-emerald-500 to-teal-600 px-8 py-6'>
            <h3 className='text-2xl font-bold text-white'>
              Field Analysis Parameters
            </h3>
            <p className='text-emerald-50 mt-1'>
              All fields validated for research accuracy
            </p>
          </div>

          <div className='p-8'>
            {/* Season & Location */}
            <div className='grid md:grid-cols-2 gap-6 mb-6'>
              <FieldGroup
                label='Cultivation Season'
                icon={<Droplets className='w-5 h-5' />}
                required
              >
                <SelectField
                  name='season_type'
                  value={form.season_type}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={
                    showFieldError("season_type") ? errors.season_type : null
                  }
                  options={seasons}
                  placeholder='Select Season'
                />
              </FieldGroup>

              <FieldGroup
                label='District'
                icon={<MapPin className='w-5 h-5' />}
                required
              >
                <SelectField
                  name='district'
                  value={form.district}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={showFieldError("district") ? errors.district : null}
                  options={districts.map((d) => ({
                    label: d.replace(/_/g, " "),
                    value: d,
                  }))}
                  placeholder='Select District'
                />
              </FieldGroup>
            </div>

            {/* Farm Details */}
            <div className='grid md:grid-cols-2 gap-6 mb-6'>
              <FieldGroup
                label='Field Size (Acres)'
                icon={<Sprout className='w-5 h-5' />}
                required
                hint={`Min ${CONFIG.fieldSize.min}, max ${CONFIG.fieldSize.maxDecimals} decimals`}
              >
                <InputField
                  type='text'
                  inputMode='decimal'
                  name='field_size_acres'
                  value={form.field_size_acres}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onFocus={() => setFocusedField("field_size_acres")}
                  error={
                    showFieldError("field_size_acres")
                      ? errors.field_size_acres
                      : null
                  }
                  focused={focusedField === "field_size_acres"}
                  placeholder='e.g., 5.5'
                />
              </FieldGroup>

              <FieldGroup
                label='Soil Type'
                icon={<Package className='w-5 h-5' />}
                required
              >
                <SelectField
                  name='soil_type'
                  value={form.soil_type}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={showFieldError("soil_type") ? errors.soil_type : null}
                  options={soilTypes}
                  placeholder='Select Soil Type'
                />
              </FieldGroup>

              <FieldGroup
                label='Planned Fertilizer (kg/acre)'
                icon={<Droplets className='w-5 h-5' />}
                required
                hint={`Max ${CONFIG.fertilizerKgPerAcre.max} kg`}
              >
                <InputField
                  type='text'
                  inputMode='decimal'
                  name='planned_fertilizer_kg_per_acre'
                  value={form.planned_fertilizer_kg_per_acre}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onFocus={() =>
                    setFocusedField("planned_fertilizer_kg_per_acre")
                  }
                  error={
                    showFieldError("planned_fertilizer_kg_per_acre")
                      ? errors.planned_fertilizer_kg_per_acre
                      : null
                  }
                  focused={focusedField === "planned_fertilizer_kg_per_acre"}
                  placeholder='e.g., 150'
                />
              </FieldGroup>

              <FieldGroup
                label='Crop Quality'
                icon={<Award className='w-5 h-5' />}
                required
              >
                <SelectField
                  name='crop_quality'
                  value={form.crop_quality}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={
                    showFieldError("crop_quality") ? errors.crop_quality : null
                  }
                  options={cropQualities}
                  placeholder='Select Quality'
                />
              </FieldGroup>
            </div>

            {/* Cost Section Header */}
            <div className='flex items-center gap-3 mb-4 mt-8'>
              <div className='flex-1 h-px bg-gradient-to-r from-transparent via-emerald-200 to-transparent'></div>
              <div className='flex items-center gap-2 text-emerald-700'>
                <Calculator className='w-5 h-5' />
                <span className='font-semibold'>Financial Parameters</span>
              </div>
              <div className='flex-1 h-px bg-gradient-to-r from-transparent via-emerald-200 to-transparent'></div>
            </div>

            {/* Cost Inputs */}
            <div className='grid md:grid-cols-2 gap-6 mb-6'>
              <FieldGroup
                label='Seed Cost (LKR)'
                icon={<DollarSign className='w-5 h-5' />}
                required
              >
                <InputField
                  type='text'
                  inputMode='decimal'
                  name='seed_cost_lkr'
                  value={form.seed_cost_lkr}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onFocus={() => setFocusedField("seed_cost_lkr")}
                  error={
                    showFieldError("seed_cost_lkr")
                      ? errors.seed_cost_lkr
                      : null
                  }
                  focused={focusedField === "seed_cost_lkr"}
                  placeholder='e.g., 50000'
                />
              </FieldGroup>

              <FieldGroup
                label='Fertilizer Cost (LKR)'
                icon={<DollarSign className='w-5 h-5' />}
                required
              >
                <InputField
                  type='text'
                  inputMode='decimal'
                  name='fertilizer_cost_lkr'
                  value={form.fertilizer_cost_lkr}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onFocus={() => setFocusedField("fertilizer_cost_lkr")}
                  error={
                    showFieldError("fertilizer_cost_lkr")
                      ? errors.fertilizer_cost_lkr
                      : null
                  }
                  focused={focusedField === "fertilizer_cost_lkr"}
                  placeholder='e.g., 75000'
                />
              </FieldGroup>

              <FieldGroup
                label='Labor Cost (LKR)'
                icon={<Users className='w-5 h-5' />}
                required
              >
                <InputField
                  type='text'
                  inputMode='decimal'
                  name='labor_cost_lkr'
                  value={form.labor_cost_lkr}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onFocus={() => setFocusedField("labor_cost_lkr")}
                  error={
                    showFieldError("labor_cost_lkr")
                      ? errors.labor_cost_lkr
                      : null
                  }
                  focused={focusedField === "labor_cost_lkr"}
                  placeholder='e.g., 100000'
                />
              </FieldGroup>

              <FieldGroup
                label='Available Capital (LKR)'
                icon={<DollarSign className='w-5 h-5' />}
                required
              >
                <InputField
                  type='text'
                  inputMode='decimal'
                  name='hands_on_money_lkr'
                  value={form.hands_on_money_lkr}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onFocus={() => setFocusedField("hands_on_money_lkr")}
                  error={
                    showFieldError("hands_on_money_lkr")
                      ? errors.hands_on_money_lkr
                      : null
                  }
                  focused={focusedField === "hands_on_money_lkr"}
                  placeholder='e.g., 250000'
                />
              </FieldGroup>
            </div>

            {/* Cost Summary Card */}
            <div
              className={`rounded-xl p-6 mb-6 ${
                totals.difference < 0
                  ? "bg-red-50 border-2 border-red-200"
                  : "bg-emerald-50 border-2 border-emerald-200"
              }`}
            >
              <div className='flex items-center gap-2 mb-4'>
                <Calculator
                  className={`w-5 h-5 ${
                    totals.difference < 0 ? "text-red-600" : "text-emerald-600"
                  }`}
                />
                <h4
                  className={`font-bold ${
                    totals.difference < 0 ? "text-red-900" : "text-emerald-900"
                  }`}
                >
                  Financial Summary
                </h4>
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <p className='text-sm text-gray-600 mb-1'>
                    Total Estimated Cost
                  </p>
                  <p className='text-2xl font-bold text-gray-900'>
                    LKR {totals.totalCost.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className='text-sm text-gray-600 mb-1'>
                    Available Capital
                  </p>
                  <p className='text-2xl font-bold text-gray-900'>
                    LKR{" "}
                    {Number.isFinite(totals.capital)
                      ? totals.capital.toLocaleString()
                      : "—"}
                  </p>
                </div>
                <div className='col-span-2'>
                  <p className='text-sm text-gray-600 mb-1'>Capital Balance</p>
                  <p
                    className={`text-2xl font-bold ${
                      totals.difference < 0
                        ? "text-red-600"
                        : "text-emerald-600"
                    }`}
                  >
                    {totals.difference < 0 ? "−" : "+"} LKR{" "}
                    {Number.isFinite(totals.difference)
                      ? Math.abs(totals.difference).toLocaleString()
                      : "—"}
                  </p>
                  {totals.difference < 0 && (
                    <p className='text-sm text-red-600 mt-2 flex items-center gap-2'>
                      <AlertCircle className='w-4 h-4' />
                      Insufficient capital to cover estimated costs
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={!isFormValid || submitting}
              className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-3 ${
                !isFormValid || submitting
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:shadow-xl transform hover:-translate-y-0.5"
              }`}
            >
              {submitting ? (
                <>
                  <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin' />
                  Processing Analysis...
                </>
              ) : (
                <>
                  <TrendingUp className='w-5 h-5' />
                  Generate Profit Analysis
                  <Sparkles className='w-5 h-5' />
                </>
              )}
            </button>

            {/* Validation Info */}
            <div className='mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4'>
              <div className='flex items-start gap-3'>
                <Info className='w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5' />
                <div className='text-sm text-blue-900'>
                  <p className='font-semibold mb-1'>
                    Research-Grade Validation Active
                  </p>
                  <p className='text-blue-700'>
                    All inputs undergo strict validation: required field checks,
                    numeric range validation, decimal precision limits, and
                    cross-field business rule verification (capital adequacy).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FieldGroup({ label, icon, children, required, hint }) {
  return (
    <div className='space-y-2'>
      <label className='flex items-center gap-2 text-sm font-semibold text-gray-700'>
        <span className='text-emerald-600'>{icon}</span>
        {label}
        {required && <span className='text-red-500'>*</span>}
      </label>
      {children}
      {hint && <p className='text-xs text-gray-500'>{hint}</p>}
    </div>
  );
}

function InputField({ error, focused, onFocus, onBlur, ...props }) {
  return (
    <div>
      <input
        {...props}
        onFocus={(e) => {
          if (onFocus) onFocus(e);
        }}
        onBlur={(e) => {
          if (onBlur) onBlur(e);
        }}
        className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:bg-white ${
          error
            ? "border-red-300 focus:border-red-500 bg-red-50"
            : focused
            ? "border-emerald-500 shadow-sm"
            : "border-gray-200 hover:border-gray-300 focus:border-emerald-500"
        }`}
      />
      {error && (
        <p className='mt-1.5 text-sm text-red-600 flex items-center gap-1'>
          <AlertCircle className='w-3.5 h-3.5' />
          {error}
        </p>
      )}
    </div>
  );
}

function SelectField({ options, error, placeholder, ...props }) {
  return (
    <div>
      <select
        {...props}
        className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:bg-white cursor-pointer ${
          error
            ? "border-red-300 focus:border-red-500 bg-red-50"
            : "border-gray-200 hover:border-gray-300 focus:border-emerald-500"
        }`}
      >
        <option value=''>{placeholder || "Select..."}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p className='mt-1.5 text-sm text-red-600 flex items-center gap-1'>
          <AlertCircle className='w-3.5 h-3.5' />
          {error}
        </p>
      )}
    </div>
  );
}
