import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('agrotrends_user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error('Error parsing stored user:', error)
        localStorage.removeItem('agrotrends_user')
      }
    }
    setLoading(false)
  }, [])

  const signUp = (userData) => {
    const username = userData.username?.trim()
    const email = userData.email?.trim()
    const password = userData.password

    if (!username || !email || !password) {
      return { success: false, error: 'Please provide a username, email, and password' }
    }

    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long' }
    }

    const newUser = {
      id: Date.now(),
      username,
      email,
      role: userData.role || 'User',
      password,
      profileImage: userData.profileImage || null,
      createdAt: new Date().toISOString()
    }
    
    setUser(newUser)
    localStorage.setItem('agrotrends_user', JSON.stringify(newUser))
    return { success: true, user: newUser }
  }

  const signIn = (credentials) => {
    // Simulate sign in (in real app, this would call an API)
    const existingUser = localStorage.getItem('agrotrends_user')
    
    if (existingUser) {
      const parsedUser = JSON.parse(existingUser)
      const identifier = credentials.username?.trim()
      const password = credentials.password
      const identifierMatches = identifier && (parsedUser.email === identifier || parsedUser.username === identifier)
      const passwordMatches = !parsedUser.password || parsedUser.password === password

      if (identifierMatches && passwordMatches) {
        setUser(parsedUser)
        return { success: true, user: parsedUser }
      }
    }
    
    return { success: false, error: 'Invalid credentials' }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('agrotrends_user')
  }

  const updateProfile = (updatedData) => {
    if (!user) {
      return { success: false, error: 'No active session found' }
    }

    const updatedUser = {
      ...user,
      username: updatedData.username,
      email: updatedData.email,
      profileImage: typeof updatedData.profileImage === 'undefined' ? user.profileImage : updatedData.profileImage
    }

    if (updatedData.password) {
      updatedUser.password = updatedData.password
    }

    setUser(updatedUser)
    localStorage.setItem('agrotrends_user', JSON.stringify(updatedUser))
    return { success: true, user: updatedUser }
  }

  const value = {
    user,
    loading,
    signUp,
    signIn,
    logout,
    updateProfile,
    isAuthenticated: !!user
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
