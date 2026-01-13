import { useState, useRef } from "react";
import ImageUpload from "../components/ImageUpload";

export default function SeedReadinessPage() {
  const fileInputRef = useRef(null);
  const resultRef = useRef(null);
  const [seedImage, setSeedImage] = useState(null);
  const [seedImagePreview, setSeedImagePreview] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [rawOutput, setRawOutput] = useState(null);

  // Handle image selection from camera or gallery
  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSeedImage(file);
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setSeedImagePreview(event.target?.result);
      };
      reader.readAsDataURL(file);
      // Clear previous results
      setResult(null);
    }
  };

  // Trigger camera capture
  const handleCameraCapture = (e) => {
    e.preventDefault();
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute("capture", "environment");
      fileInputRef.current.click();
    }
  };

  // Trigger gallery upload
  const handleGalleryUpload = (e) => {
    e.preventDefault();
    if (fileInputRef.current) {
      fileInputRef.current.removeAttribute("capture");
      fileInputRef.current.click();
    }
  };

  // Clear selected image
  const clearImage = () => {
    setSeedImage(null);
    setSeedImagePreview(null);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Analyze seed readiness
  const analyzeSeed = async () => {
    if (!seedImage) return;

    setAnalyzing(true);
    
    // Simulate API call - replace with actual backend endpoint
    setTimeout(() => {
      // Mock result
      setResult({
        readiness: "Ready for Planting",
        confidence: 92,
        recommendations: [
          "Seeds appear healthy and mature",
          "Good size and color consistency",
          "Recommended planting within 2 weeks"
        ],
        quality: {
          size: "Excellent",
          color: "Good",
          texture: "Healthy"
        }
      });
      setAnalyzing(false);
    }, 2000);

    // TODO: Replace with actual API call
    // const formData = new FormData();
    // formData.append('image', seedImage);
    // const response = await fetch('http://127.0.0.1:5000/api/seed-readiness', {
    //   method: 'POST',
    //   body: formData
    // });
    // const data = await response.json();
    // setResult(data);
    // setAnalyzing(false);
  };

  // Map backend model outputs to page result shape
  const handlePrediction = (data) => {
    if (!data) {
      setResult(null);
      setRawOutput(null);
      return;
    }
    // If data contains model keys, map to the UI's expected shape
    if (data.seed_readiness || data.sprout_length) {
      // keep raw model outputs so we can show exact labels + confidences
      setRawOutput(data);
      const seed = data.seed_readiness || { label: "unknown", confidence: 0 };
      const sprout = data.sprout_length || { label: "unknown", confidence: 0 };
      const shrivel = data.shrivel_level || { label: "unknown", confidence: 0 };
      const damage = data.damage_level || { label: "unknown", confidence: 0 };

      const fmt = (lbl) => String(lbl || "unknown").replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      const seedLabel = fmt(seed.label);
      const sproutLabel = fmt(sprout.label);
      const shrivelLabel = fmt(shrivel.label);
      const damageLabel = fmt(damage.label);
      const confidencePct = Math.round((seed.confidence || 0) * 100);

      const recommendations = [];
      if ((seed.label || "").toLowerCase().includes("ready")) {
        recommendations.push("Seeds look ready for planting — consider planting within 1–2 weeks.");
      } else {
        recommendations.push("Seeds may not be ready — consider waiting or checking moisture and maturity.");
      }
      recommendations.push(`Sprout length: ${sproutLabel}`);
      recommendations.push(`Damage level: ${damageLabel}`);
      if ((shrivel.label || "").toLowerCase().includes("high") || (shrivel.label || "").toLowerCase().includes("severe")) {
        recommendations.push("High shriveling detected — sort out badly shriveled seeds before planting.");
      }

      const mapped = {
        readiness: seedLabel,
        confidence: confidencePct,
        recommendations,
        quality: {
          size: sproutLabel,
          color: damageLabel,
          texture: shrivelLabel,
        },
      };

      setResult(mapped);
      // smooth-scroll to results for better UX
      setTimeout(() => {
        if (resultRef.current) resultRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 150);
      return;
    }

    // Otherwise, assume data already matches shape
    setResult(data);
    setRawOutput(null);
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-green-50 to-amber-50 py-8 px-4'>
      <div className='max-w-4xl mx-auto'>
        <div className='bg-white rounded-2xl shadow-xl p-8'>
          {/* Header */}
          <div className='text-center mb-8'>
            <h1 className='text-4xl font-bold text-emerald-800 mb-2'>
              🌾 Seed Readiness Predictor
            </h1>
            <p className='text-gray-600'>
              Upload a photo of your potato seeds to analyze their readiness for planting
            </p>
          </div>

          {/* Upload Section - uses centralized ImageUpload component */}
          <div className='bg-emerald-50 p-6 rounded-xl mb-6'>
            <h2 className='text-xl font-semibold text-emerald-800 mb-4'>
              📸 Upload Seed Photo
            </h2>
            <ImageUpload onResult={handlePrediction} />
          </div>

          {/* Results Section */}
          {result && (
            <div ref={resultRef} className='bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border-2 border-green-300 transition-all'>
              <h2 className='text-2xl font-bold text-green-800 mb-4 flex items-center gap-2'>
                ✅ Analysis Complete
              </h2>

              {/* Raw model outputs: show all 4 model predictions */}
              {rawOutput && (
                <div className='grid grid-cols-1 md:grid-cols-4 gap-3 mb-4'>
                  {[
                    ["seed_readiness", "Seed Readiness"],
                    ["sprout_length", "Sprout Length"],
                    ["shrivel_level", "Shrivel Level"],
                    ["damage_level", "Damage Level"],
                  ].map(([key, title]) => {
                    const val = rawOutput[key] || { label: "unknown", confidence: 0 };
                    const labelText = String(val.label || "unknown").replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
                    const pct = Math.round((val.confidence || 0) * 100);
                    return (
                      <div key={key} className='bg-white rounded-lg p-3 shadow-sm flex flex-col items-start'>
                        <div className='text-xs text-gray-500'>{title}</div>
                        <div className='mt-2 text-lg font-semibold text-emerald-700'>{labelText}</div>
                        <div className='mt-1 text-sm text-gray-600'>{pct}% confidence</div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Readiness Status */}
              <div className='bg-white rounded-lg p-4 mb-4 shadow-md'>
                <div className='flex items-center justify-between mb-2'>
                  <h3 className='text-lg font-semibold text-gray-800'>
                    Readiness Status
                  </h3>
                  <span className='bg-green-100 text-green-800 font-bold px-4 py-1 rounded-full'>
                    {result.readiness}
                  </span>
                </div>
                <div className='flex items-center gap-2'>
                  <div className='flex-1 bg-gray-200 rounded-full h-3'>
                    <div
                      className='bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full'
                      style={{ width: `${result.confidence}%` }}
                    ></div>
                  </div>
                  <span className='text-sm font-semibold text-gray-700'>
                    {result.confidence}%
                  </span>
                </div>
              </div>

              {/* Quality Metrics */}
              <div className='bg-white rounded-lg p-4 mb-4 shadow-md'>
                <h3 className='text-lg font-semibold text-gray-800 mb-3'>
                  Quality Metrics
                </h3>
                <div className='grid grid-cols-3 gap-3'>
                  <div className='text-center'>
                    <div className='text-2xl mb-1'>📏</div>
                    <div className='text-xs text-gray-600'>Size</div>
                    <div className='font-semibold text-emerald-700'>
                      {result.quality.size}
                    </div>
                  </div>
                  <div className='text-center'>
                    <div className='text-2xl mb-1'>🎨</div>
                    <div className='text-xs text-gray-600'>Color</div>
                    <div className='font-semibold text-emerald-700'>
                      {result.quality.color}
                    </div>
                  </div>
                  <div className='text-center'>
                    <div className='text-2xl mb-1'>✨</div>
                    <div className='text-xs text-gray-600'>Texture</div>
                    <div className='font-semibold text-emerald-700'>
                      {result.quality.texture}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className='bg-white rounded-lg p-4 shadow-md'>
                <h3 className='text-lg font-semibold text-gray-800 mb-3'>
                  💡 Recommendations
                </h3>
                <ul className='space-y-2'>
                  {result.recommendations.map((rec, index) => (
                    <li
                      key={index}
                      className='flex items-start gap-2 text-gray-700'
                    >
                      <span className='text-green-600 font-bold'>•</span>
                      <span className='text-sm'>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Info Cards */}
          <div className='mt-6 grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div className='bg-blue-50 p-4 rounded-lg'>
              <div className='text-2xl mb-2'>🎯</div>
              <h3 className='font-semibold text-blue-800 mb-1'>Accuracy</h3>
              <p className='text-xs text-gray-600'>
                AI-powered analysis with 95%+ accuracy rate
              </p>
            </div>
            <div className='bg-purple-50 p-4 rounded-lg'>
              <div className='text-2xl mb-2'>⚡</div>
              <h3 className='font-semibold text-purple-800 mb-1'>Fast Results</h3>
              <p className='text-xs text-gray-600'>
                Get instant feedback in seconds
              </p>
            </div>
            <div className='bg-pink-50 p-4 rounded-lg'>
              <div className='text-2xl mb-2'>📱</div>
              <h3 className='font-semibold text-pink-800 mb-1'>Mobile Ready</h3>
              <p className='text-xs text-gray-600'>
                Works on any device, anywhere
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
