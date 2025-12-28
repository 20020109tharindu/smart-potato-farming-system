import { useState, useRef } from "react";

export default function SeedReadinessPage() {
  const fileInputRef = useRef(null);
  const [seedImage, setSeedImage] = useState(null);
  const [seedImagePreview, setSeedImagePreview] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

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

  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-8 px-4'>
      <div className='max-w-4xl mx-auto'>
        <div className='bg-white rounded-2xl shadow-xl p-8'>
          {/* Header */}
          <div className='text-center mb-8'>
            <h1 className='text-4xl font-bold text-purple-800 mb-2'>
              🌾 Seed Readiness Predictor
            </h1>
            <p className='text-gray-600'>
              Upload a photo of your potato seeds to analyze their readiness for planting
            </p>
          </div>

          {/* Upload Section */}
          <div className='bg-purple-50 p-6 rounded-xl mb-6'>
            <h2 className='text-xl font-semibold text-purple-800 mb-4'>
              📸 Upload Seed Photo
            </h2>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type='file'
              accept='image/*'
              onChange={handleImageSelect}
              className='hidden'
            />

            {/* Upload Buttons */}
            <div className='flex gap-3 mb-4'>
              <button
                type='button'
                onClick={handleCameraCapture}
                className='flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md transform transition hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 flex items-center justify-center gap-2'
              >
                📷 Take Photo
              </button>
              <button
                type='button'
                onClick={handleGalleryUpload}
                className='flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md transform transition hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-300 flex items-center justify-center gap-2'
              >
                🖼️ Upload Image
              </button>
            </div>

            {/* Image Preview */}
            {seedImagePreview ? (
              <div className='relative'>
                <div className='bg-white rounded-lg border-2 border-purple-300 p-4'>
                  <img
                    src={seedImagePreview}
                    alt='Seed preview'
                    className='w-full h-96 object-cover rounded-lg'
                  />
                  <div className='mt-4 bg-purple-100 p-3 rounded-lg'>
                    <p className='text-sm text-purple-700 font-medium'>
                      📄 File: {seedImage?.name}
                    </p>
                    <p className='text-xs text-purple-600'>
                      Size: {((seedImage?.size || 0) / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                <div className='mt-3 flex gap-2'>
                  <button
                    type='button'
                    onClick={analyzeSeed}
                    disabled={analyzing}
                    className='flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transform transition hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300 disabled:opacity-50 disabled:cursor-not-allowed'
                  >
                    {analyzing ? "🔍 Analyzing..." : "🚀 Analyze Seed"}
                  </button>
                  <button
                    type='button'
                    onClick={clearImage}
                    className='bg-red-100 hover:bg-red-200 text-red-700 font-semibold py-3 px-6 rounded-lg transition focus:outline-none focus:ring-4 focus:ring-red-300'
                  >
                    ✕ Clear
                  </button>
                </div>
              </div>
            ) : (
              <div className='bg-white border-2 border-dashed border-purple-300 rounded-lg p-12 text-center'>
                <div className='text-6xl mb-4'>🥔</div>
                <p className='text-gray-500 text-sm'>
                  No image selected yet. Click a button above to get started!
                </p>
              </div>
            )}
          </div>

          {/* Results Section */}
          {result && (
            <div className='bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border-2 border-green-300'>
              <h2 className='text-2xl font-bold text-green-800 mb-4 flex items-center gap-2'>
                ✅ Analysis Complete
              </h2>

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
                    <div className='font-semibold text-purple-700'>
                      {result.quality.size}
                    </div>
                  </div>
                  <div className='text-center'>
                    <div className='text-2xl mb-1'>🎨</div>
                    <div className='text-xs text-gray-600'>Color</div>
                    <div className='font-semibold text-purple-700'>
                      {result.quality.color}
                    </div>
                  </div>
                  <div className='text-center'>
                    <div className='text-2xl mb-1'>✨</div>
                    <div className='text-xs text-gray-600'>Texture</div>
                    <div className='font-semibold text-purple-700'>
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
