import { createContext, useContext, useState, useEffect } from 'react'
import { signOut as signOutService, updateProfile as updateProfileService } from '../services/authService'

const AuthContext = createContext()

// Custom hook to use auth context
const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Auth Provider Component
function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('agrotrends_user')
    const token = localStorage.getItem('token')
    
    console.log('Loading user on mount - storedUser exists:', !!storedUser)
    console.log('Loading user on mount - token exists:', !!token)
    
    // Only load user if both user data and token exist
    if (storedUser && token) {
      try {
        const parsedUser = JSON.parse(storedUser)
        console.log('Parsed user from localStorage:', parsedUser)
        console.log('User userType:', parsedUser.userType)
        setUser(parsedUser)
      } catch (error) {
        console.error('Error parsing stored user:', error)
        localStorage.removeItem('agrotrends_user')
        localStorage.removeItem('token')
      }
    } else {
      console.log('No complete auth data found')
      // Clear any partial data
      localStorage.removeItem('agrotrends_user')
      localStorage.removeItem('token')
    }
    setLoading(false)
  }, [])

   const logout = async () => {
    try {
      // Call sign-out API
      await signOutService()
    } catch (error) {
      console.error('Sign out error:', error)
    } finally {
      // Clear local data regardless of API call result
      setUser(null)
      localStorage.removeItem('agrotrends_user')
      localStorage.removeItem('token')
    }
  }

  const setUserData = (userData) => {
    // Set user data from API response (after sign in or sign up)
    // Backend returns userTypes (plural), we store as both userTypes and userType
    console.log('setUserData called with:', userData)
    console.log('Received userType:', userData.userType)
    console.log('Received userTypes:', userData.userTypes)
    
    const userToStore = {
      ...userData,
      id: userData.id || Date.now(),
      createdAt: userData.createdAt || userData.createdDate || new Date().toISOString(),
      // Ensure we have userType for frontend (converted from userTypes if needed)
      userType: userData.userType || userData.userTypes || [],
      // Keep original userTypes from backend
      userTypes: userData.userTypes || userData.userType || []
    }
    
    console.log('User to store:', userToStore)
    console.log('Final userType:', userToStore.userType)
    console.log('Final userTypes:', userToStore.userTypes)
    
    setUser(userToStore)
    localStorage.setItem('agrotrends_user', JSON.stringify(userToStore))
    
    console.log('✓ User stored in state and localStorage')
    console.log('Is AUTHOR?', userToStore.userType?.includes('AUTHOR'))
    console.log('Is CONSUMER?', userToStore.userType?.includes('CONSUMER'))
    
    return { success: true, user: userToStore }
  }

  const updateProfile = async (updatedData) => {
    if (!user) {
      return { success: false, error: 'No active session found' }
    }

    try {
      // Call backend API to update profile
      const response = await updateProfileService(updatedData)
      
      // Update local state with response data
      const updatedUser = {
        ...user,
        ...response.data,
        // Preserve fields that might not be in response
        id: response.data.id || user.id,
        createdAt: response.data.createdAt || user.createdAt
      }

      setUser(updatedUser)
      localStorage.setItem('agrotrends_user', JSON.stringify(updatedUser))
      return { success: true, user: updatedUser }
    } catch (error) {
      console.error('Update profile error:', error)
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to update profile'
      }
    }
  }

  const value = {
    user,
    loading,
    logout,
    updateProfile,
    setUserData,
    isAuthenticated: !!user
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Export both
export { AuthProvider, useAuth }
