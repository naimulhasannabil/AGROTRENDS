import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { signIn as signInService, adminSignIn } from '../services/authService'

function SignIn() {
  const { setUserData } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [formData, setFormData] = useState({
    email: location.state?.email || '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const successMessage = location.state?.message || ''
  const [loading, setLoading] = useState(false)
  const [isAdminMode, setIsAdminMode] = useState(false)

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    try {
      const requestBody = {
        email: formData.email,
        password: formData.password
      }

      // Use admin or regular sign-in based on mode
      const response = isAdminMode 
        ? await adminSignIn(requestBody)
        : await signInService(requestBody)
      
console.log(`=== ${isAdminMode ? 'ADMIN' : 'USER'} SIGNIN RESPONSE ====`)
      console.log('Full response:', response)
      console.log('Response data:', response.data)
      console.log('=======================')  
      
      // Clear old data first
      localStorage.removeItem('token')
      localStorage.removeItem('agrotrends_user')
      console.log('Old auth data cleared')
      
      let accessToken, userData
      
      if (isAdminMode) {
        // Admin API response structure
        if (!response.data?.payload?.accessToken) {
          console.error('❌ Admin sign-in failed: No access token')
          setError('Admin sign-in failed. Please try again.')
          return
        }
        
        accessToken = response.data.payload.accessToken
        userData = {
          ...response.data.payload.user,
          userType: ['SUPER_ADMIN'],
          isAdmin: true,
          roles: response.data.payload.user?.roles || []
        }
        
        console.log('Admin token:', accessToken.substring(0, 20) + '...')
        console.log('Admin user data:', userData)
      } else {
        // Regular user API response structure
        if (!response.data?.success || !response.data?.payload) {
          console.error('❌ Sign-in failed:', response.data?.message)
          setError(response.data?.message || 'Sign-in failed. Please try again.')
          return
        }
        
        const payload = response.data.payload
        accessToken = payload.accessToken
        
        // Ensure userTypes is always an array
        const userTypes = Array.isArray(payload.user.userTypes) 
          ? payload.user.userTypes 
          : [payload.user.userTypes].filter(Boolean)
        
        userData = {
          ...payload.user,
          userType: userTypes,
          userTypes: userTypes
        }
        
        console.log('User token:', accessToken?.substring(0, 20) + '...')
        console.log('User data:', userData)
        console.log('UserTypes array:', userTypes)
      }
      
      // Store token
      if (accessToken) {
        localStorage.setItem('token', accessToken)
        console.log('✓ Token stored successfully')
      } else {
        console.error('❌ No accessToken!')
        alert('Login failed: No authentication token received')
        return
      }
      
      // Store user data
      if (userData) {
        console.log('Processed user data:', userData)
        console.log('UserType:', userData.userType)
        console.log('Is Admin?', userData.isAdmin)
        
        setUserData(userData)
        console.log('User data stored in context')
      } else {
        console.error('❌ No user data!')
        alert('Login failed: No user data received')
        return
      }
      
      console.log('✓ Sign-in successful! Navigating to home page...')
      navigate('/')
    } catch (err) {
      // Handle different error types
      const errorMessage = err.response?.data?.message || ''
      const statusCode = err.response?.status
      
      if (statusCode === 401 || errorMessage.toLowerCase().includes('credential')) {
        // Bad credentials - could be wrong email or password
        setError('Invalid email or password. Please check your credentials and try again.')
      } else if (statusCode === 404 || errorMessage.toLowerCase().includes('not found') || errorMessage.toLowerCase().includes('user not found')) {
        setError('No account found with this email address.')
      } else if (errorMessage.toLowerCase().includes('password')) {
        setError('Incorrect password. Please try again.')
      } else {
        setError(errorMessage || 'Sign in failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-green-200">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg space-y-6">
        <h1 className="text-4xl font-bold text-center text-green-700">AgroTrends</h1>
        <h2 className="text-xl font-semibold text-center text-gray-700">
          {isAdminMode ? 'Admin Sign In' : 'Sign In'}
        </h2>
        
        {/* Admin Mode Toggle */}
        <div className="flex items-center justify-center space-x-2 py-2">
          <button
            type="button"
            onClick={() => setIsAdminMode(false)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              !isAdminMode 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            User Login
          </button>
          <button
            type="button"
            onClick={() => setIsAdminMode(true)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              isAdminMode 
                ? 'bg-red-600 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Admin Login
          </button>
        </div>

        {successMessage && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 text-sm text-center">{successMessage}</p>
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-600">Email</label>
            <input
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
            />
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white font-semibold py-2 rounded-lg hover:bg-green-700 transition-all disabled:bg-green-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <Link to="/sign-up" className="text-green-600 hover:text-green-700 font-semibold">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  )
}

export default SignIn
