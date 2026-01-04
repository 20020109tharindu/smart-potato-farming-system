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
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50'>
      {/* Premium Header */}
      <div className='bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white shadow-2xl'>
        <div className='max-w-6xl mx-auto px-6 py-8'>
          <h1 className='text-4xl font-extrabold mb-2 flex items-center gap-3'>
            <svg className='w-10 h-10' fill='currentColor' viewBox='0 0 24 24'>
              <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z'/>
            </svg>
            Potato Leaf Disease Predictor
          </h1>
          <p className='text-emerald-50 text-lg font-light'>Advanced AI-powered disease analysis and fertilizer recommendations</p>
        </div>
      </div>

      <div className='max-w-6xl mx-auto px-6 py-10'>
        {/* Main Container */}
        <div className='grid md:grid-cols-2 gap-10 mb-12'>
          {/* Left - Upload Section */}
          <div className='bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-shadow duration-300'>
            <div className='flex items-center gap-3 mb-8'>
              <div className='bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-xl shadow-lg'>
                <svg className='w-7 h-7 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' />
                </svg>
              </div>
              <div>
                <h2 className='text-2xl font-bold text-gray-900'>Upload Leaf</h2>
                <p className='text-sm text-gray-500'>Select a high-quality image</p>
              </div>
            </div>

            {/* Image Preview */}
            <div className='mb-6'>
              {preview ? (
                <div className='relative group'>
                  <img
                    src={preview}
                    alt='Leaf preview'
                    className='w-full h-80 object-cover rounded-xl border-2 border-green-200 group-hover:border-green-400 transition-colors'
                  />
                  <div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-xl transition-all'></div>
                  <button
                    onClick={() => {
                      setImage(null)
                      setPreview(null)
                    }}
                    className='absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 shadow-lg transition transform hover:scale-105'
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className='w-full h-80 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-3 border-dashed border-gray-300 flex items-center justify-center hover:border-green-400 hover:from-green-50 transition-all'>
                  <div className='text-center'>
                    <svg
                      className='w-20 h-20 mx-auto text-gray-400 mb-3'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={1.5}
                        d='M12 4v16m8-8H4'
                      />
                    </svg>
                    <p className='text-gray-600 font-semibold'>Drag image here or click below</p>
                    <p className='text-gray-400 text-sm mt-1'>PNG, JPG up to 5MB</p>
                  </div>
                </div>
              )}
            </div>

            {/* File Input */}
            <label className='block mb-5'>
              <span className='bg-green-600 text-white px-6 py-3 rounded-lg cursor-pointer hover:bg-green-700 inline-block font-semibold shadow-md hover:shadow-lg transition transform hover:scale-105'>
                📁 Choose Image
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
              <div className='bg-red-50 border-l-4 border-red-500 text-red-700 px-5 py-4 rounded-lg mb-5 flex items-start gap-3 animate-pulse'>
                <svg className='w-5 h-5 mt-0.5 flex-shrink-0' fill='currentColor' viewBox='0 0 20 20'>
                  <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z' clipRule='evenodd' />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className='flex gap-3'>
              <button
                onClick={handleAnalyze}
                disabled={!image || loading}
                className={`flex-1 px-6 py-3 rounded-lg font-bold transition transform ${
                  loading || !image
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700 hover:shadow-lg hover:scale-105 active:scale-95'
                }`}
              >
                {loading ? (
                  <span className='flex items-center justify-center gap-2'>
                    <svg className='animate-spin h-5 w-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
                    </svg>
                    Analyzing...
                  </span>
                ) : (
                  '🔍 Analyze Image'
                )}
              </button>
              <button
                onClick={handleReset}
                disabled={!image && !result}
                className={`px-6 py-3 rounded-lg font-bold transition transform ${
                  !image && !result
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    : 'bg-gray-600 text-white hover:bg-gray-700 hover:shadow-lg hover:scale-105 active:scale-95'
                }`}
              >
                ↻ Reset
              </button>
            </div>
          </div>

          {/* Right - Results Section */}
          <div className='bg-white rounded-xl shadow-lg p-8 border-t-4 border-blue-600'>
            <div className='flex items-center gap-3 mb-6'>
              <div className='bg-blue-100 p-3 rounded-lg'>
                <svg className='w-6 h-6 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 10V3L4 14h7v7l9-11h-7z' />
                </svg>
              </div>
              <h2 className='text-2xl font-bold text-gray-800'>Analysis Results</h2>
            </div>

            {result ? (
              <div className='space-y-5'>
                {/* Severity */}
                <div className='bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200'>
                  <p className='text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide'>Disease Severity</p>
                  <div className='flex items-end gap-2'>
                    <span className='text-5xl font-bold text-green-700'>{result.severity}</span>
                    <span className='text-2xl text-gray-600 mb-2'>%</span>
                  </div>
                  <div className='mt-4 bg-white rounded-lg p-2'>
                    <div className='w-full bg-gray-200 rounded-full h-3 overflow-hidden'>
                      <div 
                        className='bg-gradient-to-r from-green-400 to-green-600 h-full rounded-full transition-all duration-500'
                        style={{width: `${result.severity}%`}}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Stage Badge */}
                <div>
                  <p className='text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide'>Disease Stage</p>
                  <div
                    className={`inline-block px-6 py-3 rounded-xl border-2 font-bold text-lg shadow-md ${getStageColor(
                      result.stage
                    )}`}
                  >
                    {result.stage}
                  </div>
                </div>

                {/* Pixel Statistics */}
                <div className='bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-6'>
                  <p className='text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide'>📊 Area Analysis</p>
                  <div className='grid grid-cols-2 gap-4'>
                    <div className='bg-white rounded-lg p-4 border-l-4 border-blue-500'>
                      <p className='text-gray-600 text-sm font-semibold'>Total Leaf Pixels:</p>
                      <p className='font-bold text-gray-800 text-lg mt-1'>{result.leafPixels?.toLocaleString() || 0}</p>
                    </div>
                    <div className='bg-white rounded-lg p-4 border-l-4 border-red-500'>
                      <p className='text-gray-600 text-sm font-semibold'>Diseased Pixels:</p>
                      <p className='font-bold text-red-600 text-lg mt-1'>{result.diseasedPixels?.toLocaleString() || 0}</p>
                    </div>
                  </div>
                </div>

                {/* Recommendation */}
                {result.recommendation && (
                  <div className='bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-6'>
                    <p className='text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide'>💡 Fertilizer Recommendation</p>
                    <p className='text-gray-700 text-sm mb-4 leading-relaxed'>{result.recommendation.description}</p>
                    <div className='grid grid-cols-3 gap-3'>
                      <div className={`${getNutrientColor(result.recommendation.nitrogen)} rounded-lg p-3 text-center border-2 border-yellow-300`}>
                        <p className='text-xs font-bold text-gray-600 uppercase'>Nitrogen</p>
                        <p className='font-bold text-gray-800 mt-2 text-lg'>{result.recommendation.nitrogen}</p>
                      </div>
                      <div className={`${getNutrientColor(result.recommendation.phosphorus)} rounded-lg p-3 text-center border-2 border-orange-300`}>
                        <p className='text-xs font-bold text-gray-600 uppercase'>Phosphorus</p>
                        <p className='font-bold text-gray-800 mt-2 text-lg'>{result.recommendation.phosphorus}</p>
                      </div>
                      <div className={`${getNutrientColor(result.recommendation.potassium)} rounded-lg p-3 text-center border-2 border-red-300`}>
                        <p className='text-xs font-bold text-gray-600 uppercase'>Potassium</p>
                        <p className='font-bold text-gray-800 mt-2 text-lg'>{result.recommendation.potassium}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* View Details Button */}
                <button
                  onClick={handleViewResults}
                  className='w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-4 rounded-lg font-bold hover:shadow-lg transition transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2'
                >
                  <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' />
                  </svg>
                  View Detailed Results
                </button>
              </div>
            ) : (
              <div className='h-80 flex items-center justify-center'>
                <div className='text-center'>
                  <svg
                    className='w-24 h-24 mx-auto text-gray-200 mb-4'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={1.5}
                      d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                    />
                  </svg>
                  <p className='text-gray-500 font-semibold'>Upload and analyze an image to see results</p>
                  <p className='text-gray-400 text-sm mt-2'>Results will appear here</p>
                </div>
              </div>
            )}
          </div>
        </div>



        {/* Info Cards */}
        <div className='grid md:grid-cols-4 gap-4'>
          <div className='bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-lg p-6 border-l-4 border-green-600 hover:shadow-xl hover:scale-105 transition transform'>
            <div className='flex items-center gap-2 mb-2'>
              <span className='text-2xl'>✅</span>
              <h3 className='font-bold text-green-700'>Very Early</h3>
            </div>
            <p className='text-sm text-gray-600'><span className='font-semibold'>0-10%</span> - Focus on strengthening immunity</p>
          </div>
          <div className='bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl shadow-lg p-6 border-l-4 border-yellow-600 hover:shadow-xl hover:scale-105 transition transform'>
            <div className='flex items-center gap-2 mb-2'>
              <span className='text-2xl'>⚠️</span>
              <h3 className='font-bold text-yellow-700'>Early</h3>
            </div>
            <p className='text-sm text-gray-600'><span className='font-semibold'>11-30%</span> - Increase nutrient support</p>
          </div>
          <div className='bg-gradient-to-br from-orange-50 to-red-50 rounded-xl shadow-lg p-6 border-l-4 border-orange-600 hover:shadow-xl hover:scale-105 transition transform'>
            <div className='flex items-center gap-2 mb-2'>
              <span className='text-2xl'>🔴</span>
              <h3 className='font-bold text-orange-700'>Progressive</h3>
            </div>
            <p className='text-sm text-gray-600'><span className='font-semibold'>31-60%</span> - Critical nutrient boost needed</p>
          </div>
          <div className='bg-gradient-to-br from-red-50 to-rose-50 rounded-xl shadow-lg p-6 border-l-4 border-red-600 hover:shadow-xl hover:scale-105 transition transform'>
            <div className='flex items-center gap-2 mb-2'>
              <span className='text-2xl'>🚨</span>
              <h3 className='font-bold text-red-700'>Critical</h3>
            </div>
            <p className='text-sm text-gray-600'><span className='font-semibold'>61-100%</span> - Severe intervention required</p>
          </div>
        </div>
      </div>
    </div>
  )
}
