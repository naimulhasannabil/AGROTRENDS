import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useMe, useUpdateUser } from '../services/query'

function UserProfile() {
  const {user,  logout } = useAuth()
  const {data: me, refetch: refetchUser, isLoading, isRefetching} = useMe();
  const { mutateAsync: updateProfileMutation } = useUpdateUser();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [profileData, setProfileData] = useState(null)
  
  // Debug logging
  console.log('UserProfile - Current user:', user)
  console.log('UserProfile - userType:', user?.userType)
  console.log('UserProfile - Full profile data:', profileData)
  
  // Get display name and role from profile data or user object
  const displayName = me?.name || profileData?.name || user?.name || user?.username || 'User'
  const displayRole = profileData?.userTypes?.[0] || user?.userType?.[0] || user?.role || 'User'
  const displayEmail = profileData?.email || user?.email || ''
  const displayMobile = profileData?.mobileNumber || user?.mobileNumber || ''
  
  console.log('UserProfile - displayName:', displayName)
  console.log('UserProfile - displayRole:', displayRole)
  
  const [editForm, setEditForm] = useState({
    name: user?.name || user?.username || '',
    email: user?.email || '',
    mobileNumber: user?.mobileNumber || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [previewImage, setPreviewImage] = useState(user?.profileImageUrl || user?.profileImage || null)
  const [errorMessage, setErrorMessage] = useState('')
  const fileInputRef = useRef(null)

  // Fetch user profile data when dropdown opens
  useEffect(() => {
    const fetchProfile = async () => {
      if (isDropdownOpen && user && !profileData) {
        try {
          const response = me;
          console.log('Fetched profile data:', response)
          setProfileData(response)
        } catch (error) {
          console.error('Failed to fetch profile:', error)
          // Use fallback to user data from auth context
        } finally {
          // Ensure profileData is at least set to user data if API call fails
        }
      }
    }
    fetchProfile()
  }, [isDropdownOpen, user, profileData])

  // Update form when profile data or user data changes
  useEffect(() => {
    const dataSource = profileData || user
    if (dataSource) {
      setEditForm({
        name: dataSource?.name || dataSource?.username || '',
        email: dataSource?.email || '',
        mobileNumber: dataSource?.mobileNumber || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      setPreviewImage(dataSource?.profileImageUrl || dataSource?.profileImage || null)
    }
  }, [profileData, user])

  const handleLogout = async () => {
    await logout()
    setIsDropdownOpen(false)
  }

  const handleImageChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      setErrorMessage('Image size should be less than 5MB')
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewImage(reader.result)
    }
    reader.readAsDataURL(file)
    setErrorMessage('')
  }

  const resetEditState = (referenceUser = profileData || user) => {
    setEditForm({
      name: referenceUser?.name || referenceUser?.username || '',
      email: referenceUser?.email || '',
      mobileNumber: referenceUser?.mobileNumber || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
    setPreviewImage(referenceUser?.profileImageUrl || referenceUser?.profileImage || null)
    setErrorMessage('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleUpdateProfile = async (event) => {
    event.preventDefault()
    setErrorMessage('')

    const updateData = {
      userId: me.id
    }
    let hasChanges = false

    // Check and add name if changed
    const trimmedName = editForm.name.trim()
    const currentName = user?.name || user?.username || ''
    if (trimmedName && trimmedName !== currentName) {
      updateData.name = trimmedName
      hasChanges = true
    }

    // Check and add email if changed
    const trimmedEmail = editForm.email.trim()
    const currentEmail = profileData?.email || user?.email || ''
    if (trimmedEmail && trimmedEmail !== currentEmail) {
      updateData.email = trimmedEmail
      hasChanges = true
    }

    // Check and add mobile number if changed
    const trimmedMobile = editForm.mobileNumber.trim()
    const currentMobile = profileData?.mobileNumber || user?.mobileNumber || ''
    if (trimmedMobile && trimmedMobile !== currentMobile) {
      updateData.mobileNumber = trimmedMobile
      hasChanges = true
    }

    // Check and add profile image if changed
    const currentImage = user?.profileImageUrl || user?.profileImage || null
    if (previewImage !== currentImage) {
      updateData.profileImageUrl = previewImage
      hasChanges = true
    }

    // Handle password update separately
    if (editForm.newPassword) {
      if (editForm.newPassword.length < 6) {
        setErrorMessage('New password must be at least 6 characters long')
        return
      }

      if (editForm.newPassword !== editForm.confirmPassword) {
        setErrorMessage('New passwords do not match')
        return
      }

      if (!editForm.currentPassword) {
        setErrorMessage('Please enter your current password to change it')
        return
      }

      updateData.password = editForm.newPassword
      updateData.currentPassword = editForm.currentPassword
  
      await updateProfileMutation(updateData)
      hasChanges = true
    }

    // Check if user filled password fields without new password
    if (!editForm.newPassword && (editForm.currentPassword || editForm.confirmPassword)) {
      setErrorMessage('Enter a new password to update it')
      return
    }

    // If no changes detected
    if (!hasChanges) {
      setErrorMessage('No changes detected')
      return
    }

    try {
      console.log('Updating profile with data:', updateData)
      const result = await updateProfileMutation(updateData)
      console.log('Update result:', result)
      
      if (result?.success) {
        // Refresh profile data from API
        refetchUser
        setProfileData(me)
        resetEditState(me)
        setIsEditMode(false)
        setErrorMessage('')
      } else if (result?.error) {
        setErrorMessage(result.error)
      }
    } catch (error) {
      console.error('Profile update error:', error)
      setErrorMessage(error.response?.data?.message || 'Failed to update profile. Please try again.')
    }
  }

  if (!user || isLoading || isRefetching) return (
    <div className="flex items-center space-x-2 bg-primary-50 p-2 rounded-lg">
      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-600 to-blue-600 animate-pulse"></div>
      <div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
    )

  return (
    <div className="relative">
      {/* Profile Button */}
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center space-x-2 bg-primary-50 hover:bg-primary-100 p-2 rounded-lg transition-colors"
      >
        {(user.profileImageUrl || user.profileImage) ? (
          <img
            src={user.profileImageUrl || user.profileImage}
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-600 to-blue-600 flex items-center justify-center text-white font-semibold">
            {displayName?.charAt(0).toUpperCase() || 'U'}
          </div>
        )}
        <svg 
          className={`w-4 h-4 text-gray-600 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsDropdownOpen(false)}
          />
          
          {/* Dropdown Content */}
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 overflow-hidden">
            {!isEditMode ? (
              <>
                {/* Profile Header */}
                <div className="bg-gradient-to-r from-primary-600 to-blue-600 p-4 text-white">
                  <div className="flex items-center space-x-3">
                    {(user.profileImageUrl || user.profileImage) ? (
                      <img
                        src={user.profileImageUrl || user.profileImage}
                        alt="Profile"
                        className="w-12 h-12 rounded-full object-cover border-2 border-white/30"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-xl font-bold">
                        {displayName?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-lg">{displayName}</h3>
                      <p className="text-xs text-white/80">{displayEmail}</p>
                    </div>
                  </div>
                </div>

                {/* Profile Info */}
                <div className="p-4 space-y-3">
                 
                  
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-sm text-gray-600">Email</span>
                    <span className="text-sm font-medium text-gray-800">
                      {displayEmail}
                    </span>
                  </div>
                  
                  {displayMobile && (
                    <div className="flex items-center justify-between py-2 border-b">
                      <span className="text-sm text-gray-600">Mobile</span>
                      <span className="text-sm font-medium text-gray-800">
                        {displayMobile}
                      </span>
                    </div>
                  )}
                  
                 
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-sm text-gray-600">Member Since</span>
                    <span className="text-sm font-medium text-gray-800">
                      {profileData?.creationDate 
                        ? new Date(profileData.creationDate).toLocaleDateString()
                        : user?.createdAt 
                        ? new Date(user.createdAt).toLocaleDateString()
                        : 'N/A'
                      }
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-2 border-t bg-gray-50">
                  <button
                    onClick={() => {
                      resetEditState()
                      setIsEditMode(true)
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span>Edit Profile</span>
                  </button>
                  
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Edit Profile Form */}
                <div className="bg-gradient-to-r from-primary-600 to-blue-600 p-4 text-white">
                  <h3 className="font-semibold text-lg">Edit Profile</h3>
                </div>

                <form onSubmit={handleUpdateProfile} className="p-4 space-y-4 max-h-96 overflow-y-auto">
                  {errorMessage && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-md text-sm">
                      {errorMessage}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Profile Picture
                    </label>
                    <div className="flex items-center space-x-4">
                      {previewImage ? (
                        <img
                          src={previewImage}
                          alt="Preview"
                          className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-primary-600 to-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                          {editForm.username?.charAt(0).toUpperCase() || 'U'}
                        </div>
                      )}
                      <div>
                        <input
                          type="file"
                          ref={fileInputRef}
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium"
                        >
                          Choose Image
                        </button>
                        {previewImage && (
                          <button
                            type="button"
                            onClick={() => {
                              setPreviewImage(null)
                              if (fileInputRef.current) {
                                fileInputRef.current.value = ''
                              }
                            }}
                            className="ml-2 px-4 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors text-sm font-medium"
                          >
                            Remove
                          </button>
                        )}
                        <p className="text-xs text-gray-500 mt-1">JPG, PNG up to 5MB</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(event) => setEditForm({ ...editForm, name: event.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Update your name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(event) => setEditForm({ ...editForm, email: event.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Update your email"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      value={editForm.mobileNumber}
                      onChange={(event) => setEditForm({ ...editForm, mobileNumber: event.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Update your mobile number"
                    />
                  </div>

                  <div className="pt-3 border-t border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Change Password (optional)</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Current Password
                        </label>
                        <input
                          type="password"
                          value={editForm.currentPassword}
                          onChange={(event) => setEditForm({ ...editForm, currentPassword: event.target.value })}
                          placeholder="Enter current password"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          New Password
                        </label>
                        <input
                          type="password"
                          value={editForm.newPassword}
                          onChange={(event) => setEditForm({ ...editForm, newPassword: event.target.value })}
                          placeholder="Enter new password"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          value={editForm.confirmPassword}
                          onChange={(event) => setEditForm({ ...editForm, confirmPassword: event.target.value })}
                          placeholder="Confirm new password"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <button
                      type="submit"
                      className="flex-1 bg-primary-600 text-white py-2 rounded-md hover:bg-primary-700 transition-colors font-medium"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        resetEditState()
                        setIsEditMode(false)
                      }}
                      className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-300 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default UserProfile
