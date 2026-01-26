import { useState } from 'react'
import { Link } from 'react-router-dom'
import HeroSection from '../components/HeroSection'

function Technologies() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedComplexity, setSelectedComplexity] = useState('all')
  
  // Sample technologies data
  const technologies = [
    {
      id: 1,
      name: "Precision GPS Guidance",
      category: "Precision Agriculture",
      complexity: "Medium",
      cost: "$15,000 - $30,000",
      benefits: "Reduces overlap, saves fuel, improves accuracy",
      image: "https://images.pexels.com/photos/2280551/pexels-photo-2280551.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      description: "GPS-guided tractors and implements for precise field operations and reduced input waste.",
      features: ["Sub-inch accuracy", "Auto-steer capability", "Field mapping", "Data logging"]
    },
    {
      id: 2,
      name: "Drone Crop Monitoring",
      category: "Remote Sensing",
      complexity: "Medium",
      cost: "$5,000 - $15,000",
      benefits: "Early pest detection, crop health monitoring, yield prediction",
      image: "https://images.pexels.com/photos/442587/pexels-photo-442587.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      description: "Unmanned aerial vehicles equipped with cameras and sensors for crop surveillance.",
      features: ["Multispectral imaging", "Real-time monitoring", "Automated flight paths", "Data analytics"]
    },
    {
      id: 3,
      name: "Smart Irrigation Systems",
      category: "Water Management",
      complexity: "Low",
      cost: "$2,000 - $8,000",
      benefits: "Water conservation, automated scheduling, improved yields",
      image: "https://images.pexels.com/photos/1483880/pexels-photo-1483880.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      description: "IoT-enabled irrigation systems that optimize water usage based on soil moisture and weather data.",
      features: ["Soil moisture sensors", "Weather integration", "Mobile app control", "Water usage analytics"]
    },
    {
      id: 4,
      name: "Automated Milking Systems",
      category: "Livestock Technology",
      complexity: "High",
      cost: "$150,000 - $300,000",
      benefits: "Labor reduction, consistent milking, improved cow comfort",
      image: "https://images.pexels.com/photos/422218/pexels-photo-422218.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      description: "Robotic milking systems that allow cows to be milked on demand without human intervention.",
      features: ["24/7 operation", "Individual cow tracking", "Health monitoring", "Milk quality testing"]
    },
    {
      id: 5,
      name: "Soil Testing Sensors",
      category: "Soil Management",
      complexity: "Low",
      cost: "$500 - $2,000",
      benefits: "Real-time soil data, optimized fertilization, improved crop health",
      image: "https://images.pexels.com/photos/1112080/pexels-photo-1112080.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      description: "Wireless sensors that continuously monitor soil pH, nutrients, and moisture levels.",
      features: ["Real-time monitoring", "Wireless connectivity", "Mobile alerts", "Historical data"]
    },
    {
      id: 6,
      name: "Vertical Farming Systems",
      category: "Controlled Environment",
      complexity: "High",
      cost: "$50,000 - $200,000",
      benefits: "Year-round production, space efficiency, pesticide-free growing",
      image: "https://images.pexels.com/photos/2886937/pexels-photo-2886937.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      description: "Indoor growing systems using LED lights and hydroponic techniques for maximum yield.",
      features: ["LED grow lights", "Climate control", "Hydroponic systems", "Automated harvesting"]
    }
  ]
  
  const categories = ['all', 'Precision Agriculture', 'Remote Sensing', 'Water Management', 'Livestock Technology', 'Soil Management', 'Controlled Environment']
  const complexities = ['all', 'Low', 'Medium', 'High']
  
  // Filter technologies
  const filteredTechnologies = technologies.filter(tech => {
    const matchesSearch = tech.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tech.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || tech.category === selectedCategory
    const matchesComplexity = selectedComplexity === 'all' || tech.complexity === selectedComplexity
    return matchesSearch && matchesCategory && matchesComplexity
  })
  
  return (
    <>
      <HeroSection 
        title="Agricultural Technologies"
        subtitle="Cutting-edge innovations transforming modern farming practices"
        backgroundClass="bg-[#DAFCE7]"
      />
      
      {/* Back Button */}
      <section className="py-4 bg-gray-50">
        <div className="container-custom">
          <Link 
            to="/categories" 
            className="inline-flex items-center text-green-600 hover:text-green-700 font-medium transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Categories
          </Link>
        </div>
      </section>
      
      {/* Search and Filters */}
      <section className="py-8 bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <input
                type="text"
                placeholder="Search technologies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input"
              />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="form-input"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
              <select
                value={selectedComplexity}
                onChange={(e) => setSelectedComplexity(e.target.value)}
                className="form-input"
              >
                {complexities.map(complexity => (
                  <option key={complexity} value={complexity}>
                    {complexity === 'all' ? 'All Complexity Levels' : `${complexity} Complexity`}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>
      
      {/* Technologies Grid */}
      <section className="py-8 bg-gray-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTechnologies.map(tech => (
              <div key={tech.id} className="card">
                <img src={tech.image} alt={tech.name} className="card-image" />
                <div className="card-body">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold">{tech.name}</h3>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      tech.complexity === 'Low' ? 'bg-green-100 text-green-800' :
                      tech.complexity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {tech.complexity}
                    </span>
                  </div>
                  <p className="text-sm text-primary-600 font-medium mb-2">{tech.category}</p>
                  <p className="text-gray-700 mb-4">{tech.description}</p>
                  
                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Investment:</span>
                      <span className="font-medium">{tech.cost}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Benefits:</span>
                      <p className="font-medium text-primary-700">{tech.benefits}</p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Key Features:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {tech.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-primary-600 mr-2">•</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <button className="btn-primary w-full">
                    Get Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Technology Trends */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">Technology Trends in Agriculture</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">AI & Machine Learning</h3>
              <p className="text-gray-600">Predictive analytics for crop yields and disease detection</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">IoT Sensors</h3>
              <p className="text-gray-600">Connected devices for real-time farm monitoring</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Robotics</h3>
              <p className="text-gray-600">Automated systems for planting, harvesting, and maintenance</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Data Analytics</h3>
              <p className="text-gray-600">Big data solutions for farm management optimization</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Technologies Grid
      <section className="py-8 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Search technologies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input"
              />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="form-input"
              >
                <option value="all">All Categories</option>
                <option value="Precision Agriculture">Precision Agriculture</option>
                <option value="Remote Sensing">Remote Sensing</option>
                <option value="Water Management">Water Management</option>
                <option value="Livestock Technology">Livestock Technology</option>
                <option value="Soil Management">Soil Management</option>
                <option value="Controlled Environment">Controlled Environment</option>
              </select>
              <select
                value={selectedComplexity}
                onChange={(e) => setSelectedComplexity(e.target.value)}
                className="form-input"
              >
                <option value="all">All Complexity Levels</option>
                <option value="Low">Low Complexity</option>
                <option value="Medium">Medium Complexity</option>
                <option value="High">High Complexity</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTechnologies.map(tech => (
              <div key={tech.id} className="card">
                <img src={tech.image} alt={tech.name} className="card-image" />
                <div className="card-body">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold">{tech.name}</h3>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      tech.complexity === 'Low' ? 'bg-green-100 text-green-800' :
                      tech.complexity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {tech.complexity}
                    </span>
                  </div>
                  <p className="text-sm text-primary-600 font-medium mb-2">{tech.category}</p>
                  <p className="text-gray-700 mb-4">{tech.description}</p>
                  
                  <div className="space-y-2 text-sm mb-4">
                    <div>
                      <span className="text-gray-600">Investment Range:</span>
                      <p className="font-medium">{tech.cost}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Key Benefits:</span>
                      <p className="font-medium text-primary-700">{tech.benefits}</p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Features:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {tech.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-primary-600 mr-2">•</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <button className="btn-primary w-full">
                    Learn More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}
    </>
  )
}

export default Technologies