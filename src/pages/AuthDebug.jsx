import { useAuth } from '../contexts/AuthContext'
import { useEffect, useState } from 'react'

function AuthDebug() {
  const { user, isAuthenticated } = useAuth()
  const [localStorageData, setLocalStorageData] = useState({})

  useEffect(() => {
    // Read localStorage data
    const token = localStorage.getItem('token')
    const storedUser = localStorage.getItem('agrotrends_user')
    
    setLocalStorageData({
      hasToken: !!token,
      token: token ? token.substring(0, 30) + '...' : 'NO TOKEN',
      hasUser: !!storedUser,
      storedUser: storedUser ? JSON.parse(storedUser) : null
    })
  }, [user])

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">🔍 Auth Debug Panel</h1>
        
        {/* Context State */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">📦 AuthContext State</h2>
          <div className="space-y-2">
            <div className="flex items-center justify-between py-2 border-b">
              <span className="font-medium">isAuthenticated:</span>
              <span className={`px-3 py-1 rounded ${isAuthenticated ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {isAuthenticated ? '✅ TRUE' : '❌ FALSE'}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <span className="font-medium">user exists:</span>
              <span className={`px-3 py-1 rounded ${user ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {user ? '✅ YES' : '❌ NO'}
              </span>
            </div>
          </div>
          
          {user && (
            <div className="mt-4 p-4 bg-gray-50 rounded">
              <h3 className="font-semibold mb-2">User Object:</h3>
              <pre className="text-xs overflow-auto">{JSON.stringify(user, null, 2)}</pre>
            </div>
          )}
        </div>

        {/* LocalStorage State */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-purple-600">💾 LocalStorage State</h2>
          <div className="space-y-2">
            <div className="flex items-center justify-between py-2 border-b">
              <span className="font-medium">Token exists:</span>
              <span className={`px-3 py-1 rounded ${localStorageData.hasToken ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {localStorageData.hasToken ? '✅ YES' : '❌ NO'}
              </span>
            </div>
            {localStorageData.hasToken && (
              <div className="py-2 border-b">
                <span className="font-medium">Token:</span>
                <code className="block mt-1 p-2 bg-gray-100 rounded text-xs break-all">
                  {localStorageData.token}
                </code>
              </div>
            )}
            <div className="flex items-center justify-between py-2 border-b">
              <span className="font-medium">User data exists:</span>
              <span className={`px-3 py-1 rounded ${localStorageData.hasUser ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {localStorageData.hasUser ? '✅ YES' : '❌ NO'}
              </span>
            </div>
          </div>
          
          {localStorageData.storedUser && (
            <div className="mt-4 p-4 bg-gray-50 rounded">
              <h3 className="font-semibold mb-2">Stored User Object:</h3>
              <pre className="text-xs overflow-auto">{JSON.stringify(localStorageData.storedUser, null, 2)}</pre>
            </div>
          )}
        </div>

        {/* UserType Analysis */}
        {user && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-green-600">👤 UserType Analysis</h2>
            <div className="space-y-2">
              <div className="py-2 border-b">
                <span className="font-medium">userType value:</span>
                <code className="ml-2 p-1 bg-gray-100 rounded">{JSON.stringify(user.userType)}</code>
              </div>
              <div className="py-2 border-b">
                <span className="font-medium">userType type:</span>
                <code className="ml-2 p-1 bg-gray-100 rounded">{typeof user.userType}</code>
              </div>
              <div className="py-2 border-b">
                <span className="font-medium">Is Array:</span>
                <span className={`ml-2 px-2 py-1 rounded ${Array.isArray(user.userType) ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {Array.isArray(user.userType) ? '✅ YES' : '❌ NO'}
                </span>
              </div>
              <div className="py-2 border-b">
                <span className="font-medium">Is AUTHOR:</span>
                <span className={`ml-2 px-2 py-1 rounded ${user.userType?.includes('AUTHOR') ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                  {user.userType?.includes('AUTHOR') ? '✅ YES' : '❌ NO'}
                </span>
              </div>
              <div className="py-2 border-b">
                <span className="font-medium">Is CONSUMER:</span>
                <span className={`ml-2 px-2 py-1 rounded ${user.userType?.includes('CONSUMER') ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                  {user.userType?.includes('CONSUMER') ? '✅ YES' : '❌ NO'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-800">📋 Instructions</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Check if "isAuthenticated" is TRUE and "user exists" is YES</li>
            <li>Verify that "Token exists" is YES in LocalStorage section</li>
            <li>Check the UserType Analysis section:
              <ul className="list-disc list-inside ml-6 mt-1">
                <li>userType should be an array like ["AUTHOR"] or ["CONSUMER"]</li>
                <li>"Is Array" should be YES</li>
                <li>"Is AUTHOR" should match your signup choice</li>
              </ul>
            </li>
            <li>If any of these are NO/FALSE, there's an authentication issue</li>
          </ol>
        </div>
      </div>
    </div>
  )
}

export default AuthDebug
