import { useState } from 'react'
import HeroSection from '../components/HeroSection'

function Events() {
  // Sample events data
  const allEvents = [
    {
      id: 1,
      title: "Sustainable Farming Summit 2025",
      date: "June 15-17, 2025",
      location: "Chicago, IL",
      description: "A three-day conference featuring keynote speeches, workshops, and networking opportunities focused on sustainable agricultural practices.",
      image: "https://images.pexels.com/photos/7097/people-coffee-tea-meeting.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      category: "Conference",
      featured: true
    },
    {
      id: 2,
      title: "Organic Pest Management Workshop",
      date: "July 8, 2025",
      location: "Austin, TX",
      description: "Hands-on workshop teaching natural methods to control pests without harmful chemicals.",
      image: "https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      category: "Workshop",
      featured: false
    },
    {
      id: 3,
      title: "Farm Technology Expo",
      date: "August 22-24, 2025",
      location: "San Francisco, CA",
      description: "Explore the latest innovations in agricultural technology, from precision farming tools to autonomous equipment.",
      image: "https://images.pexels.com/photos/2277784/pexels-photo-2277784.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      category: "Expo",
      featured: true
    },
    {
      id: 4,
      title: "Urban Farming Masterclass",
      date: "September 5, 2025",
      location: "Online",
      description: "Learn how to maximize food production in limited urban spaces using innovative growing techniques.",
      image: "https://images.pexels.com/photos/3631/summer-dessert-sweet-ice-cream.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      category: "Workshop",
      featured: false
    },
    {
      id: 5,
      title: "Small Farm Business Planning Seminar",
      date: "October 12, 2025",
      location: "Denver, CO",
      description: "Develop a comprehensive business plan for your small farm operation with expert guidance.",
      image: "https://images.pexels.com/photos/6646967/pexels-photo-6646967.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      category: "Seminar",
      featured: false
    },
    {
      id: 6,
      title: "Annual Regenerative Agriculture Conference",
      date: "November 18-20, 2025",
      location: "Portland, OR",
      description: "Join industry leaders to explore regenerative practices that rebuild soil health and enhance ecosystem resilience.",
      image: "https://images.pexels.com/photos/1170412/pexels-photo-1170412.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      category: "Conference",
      featured: true
    }
  ]
  
  // Event categories
  const categories = [
    { id: 'all', name: 'All Events' },
    { id: 'Conference', name: 'Conferences' },
    { id: 'Workshop', name: 'Workshops' },
    { id: 'Expo', name: 'Expos' },
    { id: 'Seminar', name: 'Seminars' }
  ]
  
  const [activeCategory, setActiveCategory] = useState('all')
  
  // Filter events based on category
  const filteredEvents = allEvents.filter(event => {
    return activeCategory === 'all' || event.category === activeCategory
  })
  
  // Featured events
  const featuredEvents = allEvents.filter(event => event.featured)
  
  return (
    <>
      {/* Hero Section */}
      <HeroSection 
        title="Upcoming Agricultural Events"
        subtitle="Connect with experts and fellow farmers at our conferences, workshops, and expos"
        backgroundClass="bg-[#DAFCE7]"
      />
      
      {/* Featured Events */}
      <section className="py-12 bg-white">
        <div className="container-custom">
          <h2 className="text-3xl font-bold mb-8">Featured Events</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {featuredEvents.map((event, index) => (
              <div key={event.id} className="bg-[#DAFCE7] rounded-lg overflow-hidden shadow-md">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-2/5">
                    <img 
                      src={event.image} 
                      alt={event.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="md:w-3/5 p-6">
                    <div className="mb-2">
                      <span className="inline-block bg-[#abedc4] text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {event.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                    <div className="flex items-center mb-2 text-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center mb-4 text-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{event.location}</span>
                    </div>
                    <p className="text-gray-600 mb-4">{event.description}</p>
                    <button className="btn-primary rounded-3xl">
                      Register Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* All Events */}
      <section className="py-12 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold mb-6">Browse Events</h2>
          
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-full transition-colors ${
                  activeCategory === category.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map(event => (
              <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="mb-2">
                    <span className="inline-block bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {event.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                  <div className="flex items-center mb-2 text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center mb-4 text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{event.location}</span>
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                  <button className="btn-primary rounded-2xl">
                    Learn More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Calendar Section */}
      <section className="py-12 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Save the Dates</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Plan your schedule with our agricultural events calendar
            </p>
          </div>
          
          <div className="bg-[#DAFCE7] rounded-lg p-8">
            <div className="flex justify-center mb-8">
              <button className="bg-white rounded-l-md px-4 py-2 border border-gray-300 text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="px-4 py-2 bg-primary-600 text-white font-semibold">
                2025
              </div>
              <button className="bg-white rounded-r-md px-4 py-2 border border-gray-300 text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {['June', 'July', 'August', 'September', 'October', 'November'].map((month) => (
                <div key={month} className="bg-white rounded-lg shadow-sm p-4">
                  <h4 className="text-lg font-semibold mb-3 text-primary-700">{month} 2025</h4>
                  <div className="space-y-3">
                    {allEvents
                      .filter(event => event.date.includes(month))
                      .map(event => (
                        <div key={event.id} className="flex items-start">
                          <div className="bg-primary-100 text-primary-800 rounded-md px-2 py-1 text-sm font-medium mr-2 whitespace-nowrap">
                            {event.date.split(',')[0].split(' ')[1]}
                          </div>
                          <div>
                            <p className="font-medium">{event.title}</p>
                            <p className="text-sm text-gray-600">{event.location}</p>
                          </div>
                        </div>
                      ))}
                    {allEvents.filter(event => event.date.includes(month)).length === 0 && (
                      <p className="text-gray-500 text-sm italic">No events scheduled</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Events