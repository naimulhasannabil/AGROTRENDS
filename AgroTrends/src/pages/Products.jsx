import { useState } from 'react'
import HeroSection from '../components/HeroSection'

function Products() {
  // Sample products data
  const allProducts = [
    {
      id: 1,
      name: "Organic Soil Enhancer",
      description: "Premium organic compost to enhance soil fertility and structure",
      price: 29.99,
      image: "https://images.pexels.com/photos/5748777/pexels-photo-5748777.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      category: "Soil"
    },
    {
      id: 2,
      name: "Precision Seeder",
      description: "Hand-held precision seeder for accurate seed spacing and depth",
      price: 149.99,
      image: "https://images.pexels.com/photos/6097730/pexels-photo-6097730.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      category: "Equipment"
    },
    {
      id: 3,
      name: "Beneficial Insects Pack",
      description: "Ladybugs and predatory mites for natural pest control",
      price: 39.99,
      image: "https://images.pexels.com/photos/460961/pexels-photo-460961.jpeg",
      category: "Pest Control"
    },
    {
      id: 4,
      name: "Drip Irrigation Kit",
      description: "Water-efficient drip irrigation system for gardens and small farms",
      price: 89.99,
      image: "https://images.pexels.com/photos/32331673/pexels-photo-32331673/free-photo-of-farmers-working-in-terraced-fields-spraying-crops.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      category: "Irrigation"
    },
    {
      id: 5,
      name: "Weather Station",
      description: "Wireless weather monitoring system for precision farming",
      price: 199.99,
      image: "https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      category: "Technology"
    },
    {
      id: 6,
      name: "Heirloom Seed Collection",
      description: "Collection of 25 varieties of heirloom vegetable seeds",
      price: 49.99,
      image: "https://images.pexels.com/photos/7728094/pexels-photo-7728094.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      category: "Seeds"
    }
  ]
  
  // Product categories
  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'Soil', name: 'Soil & Amendments' },
    { id: 'Equipment', name: 'Equipment & Tools' },
    { id: 'Pest Control', name: 'Pest Control' },
    { id: 'Irrigation', name: 'Irrigation' },
    { id: 'Technology', name: 'Farm Technology' },
    { id: 'Seeds', name: 'Seeds & Plants' }
  ]
  
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  
  // Filter products based on category and search query
  const filteredProducts = allProducts.filter(product => {
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         product.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })
  
  return (
    <>
      {/* Hero Section */}
      <HeroSection 
        title="Sustainable Farming Products"
        subtitle="Quality tools and supplies to help you grow sustainably"
        backgroundClass="bg-[#DAFCE7]"
      />
      
      {/* Search and Filter Section */}
      <section className="py-8 bg-white">
        <div className="container-custom">
          <div className="max-w-xl mx-auto mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button className="absolute right-3 top-3 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
          
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
        </div>
      </section>
      
      {/* Products Grid */}
      <section className="py-8 bg-gray-50">
        <div className="container-custom">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map(product => (
                <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <div className="mb-3">
                      <span className="inline-block bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {product.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                    <p className="text-gray-600 mb-4">{product.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-primary-700">${product.price}</span>
                      <button className="btn-primary">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium mb-2">No products found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
              <button 
                onClick={() => {
                  setActiveCategory('all')
                  setSearchQuery('')
                }}
                className="btn-primary"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </section>
      
      {/* Featured Product */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="bg-[#DAFCE7] rounded-lg overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2">
                <img 
                  src="https://images.pexels.com/photos/2132250/pexels-photo-2132250.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                  alt="Smart Irrigation System" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                <span className="inline-block bg-[#abedc4] text-primary-800 text-sm font-medium px-3 py-1 rounded-full mb-4">
                  Featured Product
                </span>
                <h2 className="text-3xl font-bold mb-4">Smart Irrigation System</h2>
                <p className="text-gray-600 mb-6">
                  Our newest water-saving technology that automatically adjusts watering schedules based on soil moisture, weather forecasts, and plant needs. Save up to 50% on water usage while improving crop yields.
                </p>
                <div className="text-2xl font-bold text-primary-700 mb-6">$299.99</div>
                <button className="btn-primary self-start">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Products