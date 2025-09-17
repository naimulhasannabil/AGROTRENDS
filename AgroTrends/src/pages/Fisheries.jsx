import { useState } from 'react'
import HeroSection from '../components/HeroSection'

function Fisheries() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedWater, setSelectedWater] = useState('all')
  
  // Sample fisheries data
  const fishSpecies = [
    {
      id: 1,
      name: "Tilapia",
      scientificName: "Oreochromis niloticus",
      type: "Freshwater",
      waterType: "Freshwater",
      growthPeriod: "6-8 months",
      temperature: "25-30°C",
      oxygenRequirement: "5-8 mg/L",
      image: "https://images.pexels.com/photos/1300355/pexels-photo-1300355.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      description: "Fast-growing freshwater fish ideal for aquaculture with high protein content.",
      managementTips: ["Maintain water quality", "Feed 2-3 times daily", "Monitor oxygen levels"]
    },
    {
      id: 2,
      name: "Atlantic Salmon",
      scientificName: "Salmo salar",
      type: "Marine",
      waterType: "Saltwater",
      growthPeriod: "18-24 months",
      temperature: "8-14°C",
      oxygenRequirement: "6-9 mg/L",
      image: "https://images.pexels.com/photos/1300355/pexels-photo-1300355.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      description: "Premium fish species with high market value and excellent nutritional profile.",
      managementTips: ["Cold water systems", "High-quality feed", "Disease prevention protocols"]
    },
    {
      id: 3,
      name: "Catfish",
      scientificName: "Ictalurus punctatus",
      type: "Freshwater",
      waterType: "Freshwater",
      growthPeriod: "12-18 months",
      temperature: "24-29°C",
      oxygenRequirement: "4-6 mg/L",
      image: "https://images.pexels.com/photos/1300355/pexels-photo-1300355.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      description: "Hardy freshwater fish with excellent feed conversion and disease resistance.",
      managementTips: ["Bottom feeding habits", "Aeration systems", "Regular water testing"]
    },
    {
      id: 4,
      name: "Shrimp",
      scientificName: "Litopenaeus vannamei",
      type: "Marine",
      waterType: "Brackish",
      growthPeriod: "3-4 months",
      temperature: "26-30°C",
      oxygenRequirement: "5-7 mg/L",
      image: "https://images.pexels.com/photos/1300355/pexels-photo-1300355.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      description: "High-value crustacean with rapid growth and excellent market demand.",
      managementTips: ["Maintain salinity levels", "Probiotics supplementation", "Biosecurity measures"]
    },
    {
      id: 5,
      name: "Carp",
      scientificName: "Cyprinus carpio",
      type: "Freshwater",
      waterType: "Freshwater",
      growthPeriod: "10-12 months",
      temperature: "20-25°C",
      oxygenRequirement: "4-6 mg/L",
      image: "https://images.pexels.com/photos/1300355/pexels-photo-1300355.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      description: "Versatile freshwater fish suitable for polyculture systems and various climates.",
      managementTips: ["Polyculture compatible", "Omnivorous feeding", "Pond management"]
    },
    {
      id: 6,
      name: "Trout",
      scientificName: "Oncorhynchus mykiss",
      type: "Freshwater",
      waterType: "Freshwater",
      growthPeriod: "12-15 months",
      temperature: "10-16°C",
      oxygenRequirement: "7-10 mg/L",
      image: "https://images.pexels.com/photos/1300355/pexels-photo-1300355.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      description: "Cold-water fish with premium market value and specific environmental requirements.",
      managementTips: ["Cold water systems", "High oxygen demand", "Quality feed pellets"]
    }
  ]
  
  const types = ['all', 'Freshwater', 'Marine']
  const waterTypes = ['all', 'Freshwater', 'Saltwater', 'Brackish']
  
  // Filter fish species
  const filteredFish = fishSpecies.filter(fish => {
    const matchesSearch = fish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         fish.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = selectedType === 'all' || fish.type === selectedType
    const matchesWater = selectedWater === 'all' || fish.waterType === selectedWater
    return matchesSearch && matchesType && matchesWater
  })
  
  return (
    <>
      <HeroSection 
        title="Fisheries & Aquaculture"
        subtitle="Sustainable fish farming techniques and aquaculture management"
        backgroundClass="bg-primary-50"
      />
      
      {/* Search and Filters */}
      <section className="py-8 bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <input
                type="text"
                placeholder="Search fish species..."
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
                value={selectedWater}
                onChange={(e) => setSelectedWater(e.target.value)}
                className="form-input"
              >
                {waterTypes.map(water => (
                  <option key={water} value={water}>
                    {water === 'all' ? 'All Water Types' : water}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>
      
      {/* Fish Species Grid */}
      <section className="py-8 bg-gray-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredFish.map(fish => (
              <div key={fish.id} className="card">
                <img src={fish.image} alt={fish.name} className="card-image" />
                <div className="card-body">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold">{fish.name}</h3>
                    <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2 py-1 rounded-full">
                      {fish.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 italic mb-2">{fish.scientificName}</p>
                  <p className="text-gray-700 mb-4">{fish.description}</p>
                  
                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Growth Period:</span>
                      <span className="font-medium">{fish.growthPeriod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Temperature:</span>
                      <span className="font-medium">{fish.temperature}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Oxygen Need:</span>
                      <span className="font-medium">{fish.oxygenRequirement}</span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Management Tips:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {fish.managementTips.map((tip, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-primary-600 mr-2">•</span>
                          {tip}
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
      </section>
    </>
  )
}

export default Fisheries