import { useState, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'

function UserProfile() {
  const { user, logout, updateProfile } = useAuth()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editForm, setEditForm] = useState({
    username: user?.username || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [previewImage, setPreviewImage] = useState(user?.profileImage || null)
  const [errorMessage, setErrorMessage] = useState('')
  const fileInputRef = useRef(null)

  const handleLogout = () => {
    logout()
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

  const resetEditState = (referenceUser = user) => {
    setEditForm({
      username: referenceUser?.username || '',
      email: referenceUser?.email || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
    setPreviewImage(referenceUser?.profileImage || null)
    setErrorMessage('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleUpdateProfile = (event) => {
    event.preventDefault()
    setErrorMessage('')

    const trimmedUsername = editForm.username.trim()
    const trimmedEmail = editForm.email.trim()

    if (!trimmedUsername || !trimmedEmail) {
      setErrorMessage('Username and email are required')
      return
    }

    if (editForm.newPassword) {
      if (editForm.newPassword.length < 6) {
        setErrorMessage('New password must be at least 6 characters long')
        return
      }

      if (editForm.newPassword !== editForm.confirmPassword) {
        setErrorMessage('New passwords do not match')
        return
      }

      if (user?.password && editForm.currentPassword !== user.password) {
        setErrorMessage('Current password is incorrect')
        return
      }
    } else if (editForm.currentPassword || editForm.confirmPassword) {
      setErrorMessage('Enter a new password to update it')
      return
    }

    const updateData = {
      username: trimmedUsername,
      email: trimmedEmail,
      profileImage: previewImage || null
    }

    if (editForm.newPassword) {
      updateData.password = editForm.newPassword
    }

    const result = updateProfile(updateData)
    if (result?.success) {
      resetEditState(result.user)
      setIsEditMode(false)
    } else if (result?.error) {
      setErrorMessage(result.error)
    }
  }

  if (!user) return null

  return (
    <div className="relative">
      {/* Profile Button */}
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center space-x-2 bg-primary-50 hover:bg-primary-100 p-2 rounded-lg transition-colors"
      >
        {user.profileImage ? (
          <img
            src={user.profileImage}
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-600 to-blue-600 flex items-center justify-center text-white font-semibold">
            {user.username?.charAt(0).toUpperCase() || 'U'}
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
                    {user.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt="Profile"
                        className="w-12 h-12 rounded-full object-cover border-2 border-white/30"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-xl font-bold">
                        {user.username?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-lg">{user.username}</h3>
                      <p className="text-xs text-white/80">{user.email}</p>
                    </div>
                  </div>
                </div>

                {/* Profile Info */}
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-sm text-gray-600">Role</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      user.role === 'Admin' 
                        ? 'bg-purple-100 text-purple-700' 
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {user.role}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-sm text-gray-600">Member Since</span>
                    <span className="text-sm font-medium text-gray-800">
                      {new Date(user.createdAt).toLocaleDateString()}
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
                      Username
                    </label>
                    <input
                      type="text"
                      value={editForm.username}
                      onChange={(event) => setEditForm({ ...editForm, username: event.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
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
                      required
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
