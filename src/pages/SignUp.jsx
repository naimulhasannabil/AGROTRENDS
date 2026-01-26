import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signUp as signUpService } from '../services/authService'
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { notification } from 'antd'

function SignUp() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    countryCode: '+880',
    mobileNumber: '',
    userType: 'CONSUMER'
  })
  
  const [professionalInfo, setProfessionalInfo] = useState({
    designation: '',
    specialities: '',
    profileImageUrl: '',
    institution: '',
    professionalStatement: ''
  })
  
  // Image upload states
  const [_selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [crop, setCrop] = useState({ unit: '%', width: 100, height: 100, x: 0, y: 0, aspect: 1 })
  const [completedCrop, setCompletedCrop] = useState(null)
  const [showCropModal, setShowCropModal] = useState(false)
  const [uploading, setUploading] = useState(false)
  const imgRef = useRef(null)
  const fileInputRef = useRef(null)
  
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Clear any existing auth data when component mounts
  useEffect(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('agrotrends_user')
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleProfessionalInfoChange = (e) => {
    const { name, value } = e.target
    setProfessionalInfo(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setError('Image size must be less than 10MB')
        return
      }
      
      const reader = new FileReader()
      reader.onload = () => {
        setSelectedImage(file)
        setImagePreview(reader.result)
        setShowCropModal(true)
      }
      reader.readAsDataURL(file)
    }
  }

  const getCroppedImg = async () => {
    if (!completedCrop || !imgRef.current) return null

    const canvas = document.createElement('canvas')
    const scaleX = imgRef.current.naturalWidth / imgRef.current.width
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height
    canvas.width = completedCrop.width
    canvas.height = completedCrop.height
    const ctx = canvas.getContext('2d')

    ctx.drawImage(
      imgRef.current,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    )

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob)
      }, 'image/jpeg', 0.9)
    })
  }

  const handleUploadImage = async () => {
    try {
      setUploading(true)
      setError('')
      
      const croppedBlob = await getCroppedImg()
      if (!croppedBlob) {
        setError('Failed to crop image')
        return
      }

      // Convert blob to base64
      const reader = new FileReader()
      reader.readAsDataURL(croppedBlob)
      reader.onloadend = async () => {
        const base64data = reader.result.split(',')[1]
        
        // Upload to ImgBB
        const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY || '3df18933133843953dea4ab8c5859e84'
        
        try {
          const formData = new FormData()
          formData.append('image', base64data)
          
          const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
            method: 'POST',
            body: formData
          })
          
          const result = await response.json()
          
          if (result.success) {
            setProfessionalInfo(prev => ({
              ...prev,
              profileImageUrl: result.data.url
            }))
            
            setShowCropModal(false)
            setSelectedImage(null)
            setImagePreview(null)
            notification.success({
              title: 'Success',
              description: 'Profile image uploaded successfully!',
              placement: 'topRight'
            })
          } else {
            setError('Failed to upload image. Please try again.')
          }
        } catch (uploadError) {
          console.error('ImgBB upload error:', uploadError)
          setError('Failed to upload image. Please try again.')
        }
      }
    } catch (err) {
      console.error('Error uploading image:', err)
      setError('Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveImage = () => {
    setProfessionalInfo(prev => ({ ...prev, profileImageUrl: '' }))
    setSelectedImage(null)
    setImagePreview(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Build request body
      const requestBody = {
        name: formData.name,
        email: formData.email,
        userType: [formData.userType],
        countryCode: formData.countryCode,
        mobileNumber: formData.mobileNumber,
        password: formData.password
      }

      // Add professional info if userType is AUTHOR
      if (formData.userType === 'AUTHOR') {
        requestBody.professionalInfoRequest = {
          designation: professionalInfo.designation,
          specialities: professionalInfo.specialities.split(',').map(s => s.trim()).filter(s => s),
          profileImageUrl: professionalInfo.profileImageUrl,
          institution: professionalInfo.institution,
          professionalStatement: professionalInfo.professionalStatement
        }
      }

      const response = await signUpService(requestBody)
      
      console.log('=== SIGNUP RESPONSE ====')
      console.log('Full response:', response)
      console.log('Response data:', response.data)
      console.log('Payload:', response.data?.payload)
      console.log('Backend userTypes:', response.data?.payload?.userTypes)
      console.log('=======================')
      
      // Backend signup doesn't return token - user must sign in
      // Data is wrapped in payload object
      if (response.data?.success && response.data?.payload) {
        console.log('✓ Sign-up successful!')
        console.log('User registered with userTypes:', response.data.payload.userTypes)
        console.log('Redirecting to sign-in page...')
        
        // Navigate to sign-in with success message
        navigate('/sign-in', { 
          state: { 
            message: 'Account created successfully! Please sign in.',
            email: formData.email 
          } 
        })
      } else {
        console.error('No data in signup response!')
        setError(response.data?.message || 'Registration failed. Please try again.')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-green-200">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg space-y-6">
        <h1 className="text-4xl font-bold text-center text-green-700">AgroTrends</h1>
        <h2 className="text-xl font-semibold text-center text-gray-700">Create an Account</h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-600">Name</label>
            <input
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., John Doe"
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">Email</label>
            <input
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g., johndoe@gmail.com"
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-600">Code</label>
              <input
                name="countryCode"
                type="text"
                required
                value={formData.countryCode}
                onChange={handleChange}
                placeholder="+880"
                className="w-full mt-1 px-2 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-600">Mobile Number</label>
              <input
                name="mobileNumber"
                type="text"
                required
                value={formData.mobileNumber}
                onChange={handleChange}
                placeholder="1717397409"
                className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">Password</label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2 text-gray-500 text-sm"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">User Type</label>
            <select
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
            >
              <option value="CONSUMER">Consumer</option>
              <option value="AUTHOR">Author</option>
            </select>
          </div>

          {/* Professional Information Section - Only for AUTHOR userType */}
          {formData.userType === 'AUTHOR' && (
            <div className="border-t pt-4 space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">Professional Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-600">Designation</label>
                <input
                  name="designation"
                  type="text"
                  required
                  value={professionalInfo.designation}
                  onChange={handleProfessionalInfoChange}
                  placeholder="e.g., Agricultural Scientist"
                  className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">Specialities (comma separated)</label>
                <input
                  name="specialities"
                  type="text"
                  required
                  value={professionalInfo.specialities}
                  onChange={handleProfessionalInfoChange}
                  placeholder="e.g., Crop Science, Soil Management"
                  className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">Institution</label>
                <input
                  name="institution"
                  type="text"
                  required
                  value={professionalInfo.institution}
                  onChange={handleProfessionalInfoChange}
                  placeholder="e.g., Agricultural University"
                  className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
                />
              </div>

              {/* Profile Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Profile Image</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Upload Image
                  </button>
                  
                  {professionalInfo.profileImageUrl && (
                    <div className="relative inline-block">
                      <img 
                        src={professionalInfo.profileImageUrl} 
                        alt="Profile preview" 
                        className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">Professional Statement</label>
                <textarea
                  name="professionalStatement"
                  required
                  value={professionalInfo.professionalStatement}
                  onChange={handleProfessionalInfoChange}
                  placeholder="Brief statement about your professional background"
                  rows="3"
                  className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white font-semibold py-2 rounded-lg hover:bg-green-700 transition-all disabled:bg-green-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/sign-in" className="text-green-600 hover:text-green-700 font-semibold">
            Sign In
          </Link>
        </p>
      </div>

      {/* Image Crop Modal */}
      {showCropModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4">Crop Profile Image</h3>
              
              {imagePreview && (
                <div className="mb-4">
                  <ReactCrop
                    crop={crop}
                    onChange={(c) => setCrop(c)}
                    onComplete={(c) => setCompletedCrop(c)}
                    aspect={1}
                  >
                    <img
                      ref={imgRef}
                      src={imagePreview}
                      alt="Crop preview"
                      className="max-w-full h-auto"
                    />
                  </ReactCrop>
                </div>
              )}

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
                  {error}
                </div>
              )}

              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowCropModal(false)
                    setSelectedImage(null)
                    setImagePreview(null)
                    setError('')
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={uploading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleUploadImage}
                  disabled={uploading || !completedCrop}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SignUp
