import { useState } from 'react'
import HeroSection from '../components/HeroSection'

function Livestock() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedSize, setSelectedSize] = useState('all')
  
  // Sample livestock data
  const livestock = [
    {
      id: 1,
      name: "Holstein Dairy Cattle",
      type: "Cattle",
      size: "Large",
      purpose: "Dairy Production",
      lifespan: "15-20 years",
      feedRequirement: "High",
      spaceRequirement: "2-5 acres per head",
      image: "https://images.pexels.com/photos/422218/pexels-photo-422218.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      description: "High-producing dairy cattle known for their distinctive black and white markings.",
      careGuide: ["Provide fresh water daily", "Regular veterinary checkups", "Maintain clean housing"]
    },
    {
      id: 2,
      name: "Angus Beef Cattle",
      type: "Cattle",
      size: "Large",
      purpose: "Beef Production",
      lifespan: "15-20 years",
      feedRequirement: "High",
      spaceRequirement: "1-3 acres per head",
      image: "https://images.pexels.com/photos/15267108/pexels-photo-15267108.jpeg",
      description: "Premium beef cattle breed known for marbled meat and efficient feed conversion.",
      careGuide: ["Rotational grazing", "Quality feed supplements", "Regular hoof trimming"]
    },
    {
      id: 3,
      name: "Rhode Island Red Chickens",
      type: "Poultry",
      size: "Small",
      purpose: "Egg & Meat Production",
      lifespan: "5-8 years",
      feedRequirement: "Low",
      spaceRequirement: "4 sq ft per bird",
      image: "https://images.pexels.com/photos/18474455/pexels-photo-18474455.jpeg",
      description: "Hardy dual-purpose chickens excellent for both egg laying and meat production.",
      careGuide: ["Secure coop at night", "Balanced layer feed", "Fresh water access"]
    },
    {
      id: 4,
      name: "Hampshire Pigs",
      type: "Swine",
      size: "Medium",
      purpose: "Meat Production",
      lifespan: "10-12 years",
      feedRequirement: "Medium",
      spaceRequirement: "200-300 sq ft per pig",
      image: "https://images.pexels.com/photos/18773841/pexels-photo-18773841.jpeg",
      description: "Lean meat pigs with excellent feed conversion and rapid growth rates.",
      careGuide: ["Provide wallowing area", "High-protein feed", "Regular health monitoring"]
    },
    {
      id: 5,
      name: "Nubian Goats",
      type: "Goats",
      size: "Medium",
      purpose: "Dairy Production",
      lifespan: "12-15 years",
      feedRequirement: "Medium",
      spaceRequirement: "200-500 sq ft per goat",
      image: "https://images.pexels.com/photos/8502546/pexels-photo-8502546.jpeg",
      description: "High-butterfat milk producers with distinctive long ears and Roman noses.",
      careGuide: ["Provide climbing structures", "Quality hay and browse", "Hoof trimming every 6-8 weeks"]
    },
    {
      id: 6,
      name: "Merino Sheep",
      type: "Sheep",
      size: "Medium",
      purpose: "Wool & Meat Production",
      lifespan: "10-12 years",
      feedRequirement: "Medium",
      spaceRequirement: "5-10 sheep per acre",
      image: "https://images.pexels.com/photos/5490708/pexels-photo-5490708.jpeg",
      description: "Premium wool producers known for fine, soft fleece and adaptability.",
      careGuide: ["Annual shearing", "Parasite prevention", "Rotational grazing"]
    }
  ]
  
  const types = ['all', 'Cattle', 'Poultry', 'Swine', 'Goats', 'Sheep']
  const sizes = ['all', 'Small', 'Medium', 'Large']
  
  // Filter livestock
  const filteredLivestock = livestock.filter(animal => {
    const matchesSearch = animal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         animal.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = selectedType === 'all' || animal.type === selectedType
    const matchesSize = selectedSize === 'all' || animal.size === selectedSize
    return matchesSearch && matchesType && matchesSize
  })
  
  return (
    <>
      <HeroSection 
        title="Livestock Management"
        subtitle="Expert guidance for raising healthy and productive livestock"
        backgroundClass="bg-[#DAFCE7]"
      />
      
      {/* Search and Filters */}
      <section className="py-8 bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <input
                type="text"
                placeholder="Search livestock..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input"
              />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="form-input"
              >
                {types.map(type => (
                  <option key={type} value={type}>
                    {type === 'all' ? 'All Types' : type}
                  </option>
                ))}
              </select>
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="form-input"
              >
                {sizes.map(size => (
                  <option key={size} value={size}>
                    {size === 'all' ? 'All Sizes' : size}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>
      
      {/* Livestock Grid */}
      <section className="py-8 bg-gray-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredLivestock.map(animal => (
              <div key={animal.id} className="card">
                <img src={animal.image} alt={animal.name} className="card-image" />
                <div className="card-body">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold">{animal.name}</h3>
                    <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2 py-1 rounded-full">
                      {animal.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 italic mb-2">{animal.scientificName}</p>
                  <p className="text-gray-700 mb-4">{animal.description}</p>
                  
                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Purpose:</span>
                      <span className="font-medium">{animal.purpose}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Lifespan:</span>
                      <span className="font-medium">{animal.lifespan}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Feed Need:</span>
                      <span className="font-medium">{animal.feedRequirement}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Space Need:</span>
                      <span className="font-medium">{animal.spaceRequirement}</span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Care Guide:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {animal.careGuide.map((tip, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-primary-600 mr-2">•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <button className="btn-primary w-full">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Health Management Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">Livestock Health Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Preventive Care</h3>
              <p className="text-gray-600">Regular health checkups and vaccination schedules</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Nutrition</h3>
              <p className="text-gray-600">Balanced feed programs for optimal growth and production</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Housing</h3>
              <p className="text-gray-600">Proper shelter design for animal comfort and productivity</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Breeding</h3>
              <p className="text-gray-600">Genetic improvement and reproductive management</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Livestock