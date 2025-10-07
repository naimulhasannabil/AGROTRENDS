import { useState } from 'react'

function Newsletter() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  
  const handleSubmit = (e) => {
    e.preventDefault()
    if (email && email.includes('@')) {
      // In a real app, we would call an API to subscribe the user
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 3000)
    }
  }
  
  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
      <div className="flex">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full px-4 py-2 rounded-l-2xl text-gray-800 focus:outline-none"
          required
        />
        <button 
          type="submit"
          className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-r-2xl transition duration-300"
        >
          Subscribe
        </button>
      </div>
      {subscribed && (
        <p className="text-primary-200 text-sm">Thanks for subscribing!</p>
      )}
    </form>
  )
}

export default Newsletter