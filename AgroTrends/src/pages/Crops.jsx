import { useState } from 'react'
import HeroSection from '../components/HeroSection'

function Crops() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSeason, setSelectedSeason] = useState('all')
  const [selectedClimate, setSelectedClimate] = useState('all')
  
  // Sample crops data
  const crops = [
    {
      id: 1,
      name: "Wheat",
      scientificName: "Triticum aestivum",
      season: "Winter",
      climate: "Temperate",
      growthPeriod: "120-150 days",
      waterRequirement: "Medium",
      soilType: "Well-drained loamy soil",
      image: "https://images.pexels.com/photos/326082/pexels-photo-326082.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      description: "A cereal grain that is a worldwide staple food and one of the most important crops globally.",
      tips: ["Plant in fall for winter wheat", "Ensure proper drainage", "Monitor for rust diseases"]
    },
    {
      id: 2,
      name: "Rice",
      scientificName: "Oryza sativa",
      season: "Summer",
      climate: "Tropical",
      growthPeriod: "90-120 days",
      waterRequirement: "High",
      soilType: "Clay or clay loam",
      image: "https://images.pexels.com/photos/1598073/pexels-photo-1598073.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      description: "A staple food crop that feeds more than half of the world's population.",
      tips: ["Maintain flooded fields", "Control weeds early", "Harvest at proper moisture content"]
    },
    {
      id: 3,
      name: "Corn",
      scientificName: "Zea mays",
      season: "Summer",
      climate: "Temperate",
      growthPeriod: "90-120 days",
      waterRequirement: "Medium",
      soilType: "Well-drained fertile soil",
      image: "https://images.pexels.com/photos/547263/pexels-photo-547263.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      description: "A versatile crop used for food, feed, and industrial purposes worldwide.",
      tips: ["Plant after soil temperature reaches 60°F", "Ensure adequate nitrogen", "Monitor for corn borer"]
    },
    {
      id: 4,
      name: "Soybeans",
      scientificName: "Glycine max",
      season: "Summer",
      climate: "Temperate",
      growthPeriod: "100-130 days",
      waterRequirement: "Medium",
      soilType: "Well-drained loamy soil",
      image: "https://images.pexels.com/photos/1459339/pexels-photo-1459339.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      description: "A legume crop that fixes nitrogen and provides high-quality protein.",
      tips: ["Inoculate seeds with rhizobia", "Rotate with corn", "Control soybean aphids"]
    },
    {
      id: 5,
      name: "Tomatoes",
      scientificName: "Solanum lycopersicum",
      season: "Summer",
      climate: "Warm",
      growthPeriod: "70-100 days",
      waterRequirement: "Medium",
      soilType: "Well-drained organic soil",
      image: "https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      description: "A popular vegetable crop grown worldwide for fresh consumption and processing.",
      tips: ["Provide support structures", "Maintain consistent watering", "Prune suckers regularly"]
    },
    {
      id: 6,
      name: "Potatoes",
      scientificName: "Solanum tuberosum",
      season: "Spring",
      climate: "Cool",
      growthPeriod: "70-120 days",
      waterRequirement: "Medium",
      soilType: "Loose, well-drained soil",
      image: "https://images.pexels.com/photos/162801/potatoes-vegetables-erdfrucht-bio-162801.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      description: "A starchy tuber crop that is the fourth-largest food crop in the world.",
      tips: ["Hill soil around plants", "Avoid green potatoes", "Harvest before frost"]
    }
  ]
  
  const seasons = ['all', 'Spring', 'Summer', 'Winter']
  const climates = ['all', 'Tropical', 'Temperate', 'Cool', 'Warm']
  
  // Filter crops based on search and filters
  const filteredCrops = crops.filter(crop => {
    const matchesSearch = crop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         crop.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSeason = selectedSeason === 'all' || crop.season === selectedSeason
    const matchesClimate = selectedClimate === 'all' || crop.climate === selectedClimate
    return matchesSearch && matchesSeason && matchesClimate
  })
  
  return (
    <>
      <HeroSection 
        title="Crop Management"
        subtitle="Comprehensive guide to growing healthy and productive crops"
        backgroundClass="bg-primary-50"
      />
      
      {/* Search and Filters */}
      <section className="py-8 bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <input
                type="text"
                placeholder="Search crops..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input"
              />
              <select
                value={selectedSeason}
                onChange={(e) => setSelectedSeason(e.target.value)}
                className="form-input"
              >
                {seasons.map(season => (
                  <option key={season} value={season}>
                    {season === 'all' ? 'All Seasons' : season}
                  </option>
                ))}
              </select>
              <select
                value={selectedClimate}
                onChange={(e) => setSelectedClimate(e.target.value)}
                className="form-input"
              >
                {climates.map(climate => (
                  <option key={climate} value={climate}>
                    {climate === 'all' ? 'All Climates' : climate}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>
      
      {/* Crops Grid */}
      <section className="py-8 bg-gray-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCrops.map(crop => (
              <div key={crop.id} className="card">
                <img src={crop.image} alt={crop.name} className="card-image" />
                <div className="card-body">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold">{crop.name}</h3>
                    <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2 py-1 rounded-full">
                      {crop.season}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 italic mb-2">{crop.scientificName}</p>
                  <p className="text-gray-700 mb-4">{crop.description}</p>
                  
                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Growth Period:</span>
                      <span className="font-medium">{crop.growthPeriod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Water Need:</span>
                      <span className="font-medium">{crop.waterRequirement}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Climate:</span>
                      <span className="font-medium">{crop.climate}</span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Growing Tips:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {crop.tips.map((tip, index) => (
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

export default Crops