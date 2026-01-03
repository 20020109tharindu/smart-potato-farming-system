import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function DiseasePredictor() {
  const navigate = useNavigate()
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)

  const compressImage = (file, callback) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (event) => {
      const img = new Image()
      img.src = event.target.result
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height
        
        // Reduce size if too large
        const maxWidth = 800
        const maxHeight = 800
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width)
            width = maxWidth
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height)
            height = maxHeight
          }
        }
        
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)
        
        canvas.toBlob(
          (blob) => {
            const compressedFile = new File([blob], file.name, { type: 'image/jpeg' })
            callback(compressedFile)
          },
          'image/jpeg',
          0.8
        )
      }
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setError('')
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file')
        return
      }

      // Validate file size (max 5MB before compression)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB')
        return
      }

      // Compress image before storing
      compressImage(file, (compressedFile) => {
        setImage(compressedFile)
        
        // Create preview
        const reader = new FileReader()
        reader.onloadend = () => {
          setPreview(reader.result)
        }
        reader.readAsDataURL(compressedFile)
      })
    }
  }

  const getStageColor = (stage) => {
    switch (stage) {
      case 'Very Early':
        return 'bg-green-100 text-green-800 border-green-300'
      case 'Early':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'Progressive':
        return 'bg-orange-100 text-orange-800 border-orange-300'
      case 'Critical':
        return 'bg-red-100 text-red-800 border-red-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getNutrientColor = (level) => {
    switch (level) {
      case 'Medium':
        return 'bg-yellow-50'
      case 'High':
        return 'bg-orange-50'
      case 'Very High':
        return 'bg-red-50'
      case 'Maximum':
        return 'bg-red-100'
      default:
        return 'bg-green-50'
    }
  }

  const handleAnalyze = async () => {
    if (!image) {
      setError('Please select an image first')
      return
    }

    try {
      setLoading(true)
      setError('')

      // Convert image to base64
      const reader = new FileReader()
      reader.onload = async () => {
        try {
          console.log('Sending image to backend...')
          const imageData = reader.result
          console.log('Image data size:', imageData.length)

          const response = await fetch('http://127.0.0.1:5000/api/analyze-leaf', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: JSON.stringify({
              image: imageData,
            }),
          })

          console.log('Response status:', response.status)
          console.log('Response headers:', response.headers)

          const contentType = response.headers.get('content-type')
          if (!contentType || !contentType.includes('application/json')) {
            throw new Error(`Expected JSON response, got ${contentType}`)
          }

          const data = await response.json()
          console.log('Response data:', data)

          if (!response.ok) {
            throw new Error(data.error || `Analysis failed with status ${response.status}`)
          }

          if (data.success) {
            setResult(data)
            setError('')
          } else {
            throw new Error(data.error || 'Analysis returned unsuccessful')
          }
        } catch (err) {
          console.error('Detailed error:', err)
          setError(err.message || 'Failed to analyze image. Check browser console for details.')
        } finally {
          setLoading(false)
        }
      }
      reader.onerror = () => {
        setError('Failed to read image file')
        setLoading(false)
      }
      reader.readAsDataURL(image)
    } catch (err) {
      console.error('Error:', err)
      setError(err.message || 'An error occurred')
      setLoading(false)
    }
  }

  const handleReset = () => {
    setImage(null)
    setPreview(null)
    setResult(null)
    setError('')
  }

  const handleViewResults = () => {
    if (result) {
      navigate('/results', { state: { result } })
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-green-50 to-white p-6'>
      <div className='max-w-6xl mx-auto'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-green-700 mb-2'>Potato Leaf Disease Predictor</h1>
          <p className='text-gray-600'>Upload a leaf image to analyze disease severity and get fertilizer recommendations</p>
        </div>

        {/* Main Container */}
        <div className='grid md:grid-cols-2 gap-6 mb-6'>
          {/* Left - Upload Section */}
          <div className='bg-white rounded-lg shadow-md p-6'>
            <h2 className='text-xl font-bold text-gray-800 mb-4'>Upload Leaf Image</h2>

            {/* Image Preview */}
            <div className='mb-4'>
              {preview ? (
                <div className='relative'>
                  <img
                    src={preview}
                    alt='Leaf preview'
                    className='w-full h-80 object-cover rounded-lg border-2 border-green-200'
                  />
                  <button
                    onClick={() => {
                      setImage(null)
                      setPreview(null)
                    }}
                    className='absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600'
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className='w-full h-80 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center'>
                  <div className='text-center'>
                    <svg
                      className='w-16 h-16 mx-auto text-gray-400 mb-2'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M12 4v16m8-8H4'
                      />
                    </svg>
                    <p className='text-gray-500'>No image selected</p>
                  </div>
                </div>
              )}
            </div>

            {/* File Input */}
            <label className='block mb-4'>
              <span className='bg-green-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-green-700 inline-block'>
                Choose Image
              </span>
              <input
                type='file'
                accept='image/*'
                onChange={handleImageChange}
                disabled={loading}
                className='hidden'
              />
            </label>

            {/* Error Message */}
            {error && (
              <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4'>
                {error}
              </div>
            )}

            {/* Action Buttons */}
            <div className='flex gap-2'>
              <button
                onClick={handleAnalyze}
                disabled={!image || loading}
                className={`flex-1 px-4 py-2 rounded-lg font-semibold transition ${
                  loading || !image
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {loading ? 'Analyzing...' : 'Analyze Image'}
              </button>
              <button
                onClick={handleReset}
                disabled={!image && !result}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  !image && !result
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    : 'bg-gray-600 text-white hover:bg-gray-700'
                }`}
              >
                Reset
              </button>
            </div>
          </div>

          {/* Right - Results Section */}
          <div className='bg-white rounded-lg shadow-md p-6'>
            <h2 className='text-xl font-bold text-gray-800 mb-4'>Analysis Results</h2>

            {result ? (
              <div className='space-y-4'>
                {/* Severity */}
                <div>
                  <p className='text-sm font-semibold text-gray-600 mb-2'>Disease Severity</p>
                  <div className='bg-gray-100 rounded-lg p-4'>
                    <div className='flex items-end gap-2'>
                      <span className='text-3xl font-bold text-green-700'>{result.severity}</span>
                      <span className='text-gray-600 mb-1'>%</span>
                    </div>
                  </div>
                </div>

                {/* Stage Badge */}
                <div>
                  <p className='text-sm font-semibold text-gray-600 mb-2'>Disease Stage</p>
                  <div
                    className={`inline-block px-4 py-2 rounded-lg border-2 font-semibold ${getStageColor(
                      result.stage
                    )}`}
                  >
                    {result.stage}
                  </div>
                </div>

                {/* Pixel Statistics */}
                <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
                  <p className='text-sm font-semibold text-gray-700 mb-2'>Area Analysis</p>
                  <div className='grid grid-cols-2 gap-2 text-sm'>
                    <div>
                      <p className='text-gray-600'>Total Leaf Pixels:</p>
                      <p className='font-bold text-gray-800'>{result.leafPixels?.toLocaleString() || 0}</p>
                    </div>
                    <div>
                      <p className='text-gray-600'>Diseased Pixels:</p>
                      <p className='font-bold text-red-600'>{result.diseasedPixels?.toLocaleString() || 0}</p>
                    </div>
                  </div>
                </div>

                {/* Recommendation */}
                {result.recommendation && (
                  <div>
                    <p className='text-sm font-semibold text-gray-600 mb-2'>Fertilizer Recommendation</p>
                    <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3'>
                      <p className='text-gray-700 text-sm'>{result.recommendation.description}</p>
                      <div className='grid grid-cols-3 gap-2'>
                        <div className={`${getNutrientColor(result.recommendation.nitrogen)} rounded p-2 text-center`}>
                          <p className='text-xs font-semibold text-gray-600'>Nitrogen</p>
                          <p className='font-bold text-gray-800'>{result.recommendation.nitrogen}</p>
                        </div>
                        <div className={`${getNutrientColor(result.recommendation.phosphorus)} rounded p-2 text-center`}>
                          <p className='text-xs font-semibold text-gray-600'>Phosphorus</p>
                          <p className='font-bold text-gray-800'>{result.recommendation.phosphorus}</p>
                        </div>
                        <div className={`${getNutrientColor(result.recommendation.potassium)} rounded p-2 text-center`}>
                          <p className='text-xs font-semibold text-gray-600'>Potassium</p>
                          <p className='font-bold text-gray-800'>{result.recommendation.potassium}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* View Details Button */}
                <button
                  onClick={handleViewResults}
                  className='w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition'
                >
                  View Detailed Results
                </button>
              </div>
            ) : (
              <div className='h-80 flex items-center justify-center'>
                <div className='text-center'>
                  <svg
                    className='w-16 h-16 mx-auto text-gray-300 mb-2'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                    />
                  </svg>
                  <p className='text-gray-500'>Upload and analyze an image to see results</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Visualization Section */}
        {result && result.visualizations && (
          <div className='bg-white rounded-lg shadow-md p-6 mb-6'>
            <h2 className='text-xl font-bold text-gray-800 mb-4'>Disease Visualization</h2>
            <div className='grid md:grid-cols-3 gap-4'>
              {/* Leaf Area */}
              <div>
                <p className='text-sm font-semibold text-gray-700 mb-2 text-center'>Leaf Area (Green)</p>
                {result.visualizations.leafArea ? (
                  <img
                    src={result.visualizations.leafArea}
                    alt='Leaf area'
                    className='w-full h-64 object-cover rounded-lg border-2 border-green-200'
                  />
                ) : (
                  <div className='w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center'>
                    <p className='text-gray-500'>No visualization</p>
                  </div>
                )}
              </div>

              {/* Disease Area */}
              <div>
                <p className='text-sm font-semibold text-gray-700 mb-2 text-center'>Disease Area (Red)</p>
                {result.visualizations.diseaseArea ? (
                  <img
                    src={result.visualizations.diseaseArea}
                    alt='Disease area'
                    className='w-full h-64 object-cover rounded-lg border-2 border-red-200'
                  />
                ) : (
                  <div className='w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center'>
                    <p className='text-gray-500'>No visualization</p>
                  </div>
                )}
              </div>

              {/* Combined */}
              <div>
                <p className='text-sm font-semibold text-gray-700 mb-2 text-center'>Combined Analysis</p>
                {result.visualizations.combined ? (
                  <img
                    src={result.visualizations.combined}
                    alt='Combined analysis'
                    className='w-full h-64 object-cover rounded-lg border-2 border-blue-200'
                  />
                ) : (
                  <div className='w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center'>
                    <p className='text-gray-500'>No visualization</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Info Cards */}
        <div className='grid md:grid-cols-4 gap-4'>
          <div className='bg-white rounded-lg shadow p-4 border-l-4 border-green-600'>
            <h3 className='font-bold text-green-700 mb-2'>Very Early (0-10%)</h3>
            <p className='text-sm text-gray-600'>Focus on strengthening immunity</p>
          </div>
          <div className='bg-white rounded-lg shadow p-4 border-l-4 border-yellow-600'>
            <h3 className='font-bold text-yellow-700 mb-2'>Early (11-30%)</h3>
            <p className='text-sm text-gray-600'>Increase nutrient support</p>
          </div>
          <div className='bg-white rounded-lg shadow p-4 border-l-4 border-orange-600'>
            <h3 className='font-bold text-orange-700 mb-2'>Progressive (31-60%)</h3>
            <p className='text-sm text-gray-600'>Critical nutrient boost needed</p>
          </div>
          <div className='bg-white rounded-lg shadow p-4 border-l-4 border-red-600'>
            <h3 className='font-bold text-red-700 mb-2'>Critical (61-100%)</h3>
            <p className='text-sm text-gray-600'>Severe intervention required</p>
          </div>
        </div>
      </div>
    </div>
  )
}
