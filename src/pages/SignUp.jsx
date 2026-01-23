import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signUp as signUpService } from '../services/authService'

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

              <div>
                <label className="block text-sm font-medium text-gray-600">Profile Image URL</label>
                <input
                  name="profileImageUrl"
                  type="url"
                  value={professionalInfo.profileImageUrl}
                  onChange={handleProfessionalInfoChange}
                  placeholder="https://example.com/profile.jpg"
                  className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
                />
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
    </div>
  )
}

export default SignUp
