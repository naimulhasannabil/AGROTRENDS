import { Link } from 'react-router-dom'
import HeroSection from '../components/HeroSection'

function Categories() {
  const categories = [
    {
      id: 'crops',
      name: 'Crops',
      description: 'Comprehensive crop management guides, growing techniques, and seasonal planting information',
      image: 'https://images.pexels.com/photos/326082/pexels-photo-326082.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      features: ['Crop Database', 'Growing Guides', 'Seasonal Calendar', 'Pest Management'],
      link: '/crops'
    },
    {
      id: 'livestock',
      name: 'Livestock',
      description: 'Expert guidance for raising healthy livestock, breeding programs, and animal welfare',
      image: 'https://images.pexels.com/photos/422218/pexels-photo-422218.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      features: ['Animal Care', 'Breeding Programs', 'Health Management', 'Nutrition Plans'],
      link: '/livestock'
    },
    {
      id: 'fisheries',
      name: 'Fisheries & Aquaculture',
      description: 'Sustainable fish farming techniques, water quality management, and aquaculture systems',
      image: 'https://images.pexels.com/photos/1300355/pexels-photo-1300355.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      features: ['Fish Species', 'Water Management', 'Feeding Programs', 'Disease Prevention'],
      link: '/fisheries'
    },
    {
      id: 'technologies',
      name: 'Agricultural Technologies',
      description: 'Latest farming technologies, precision agriculture tools, and smart farming solutions',
      image: 'https://images.pexels.com/photos/2280551/pexels-photo-2280551.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      features: ['Smart Farming', 'IoT Solutions', 'Precision Tools', 'Automation'],
      link: '/technologies'
    }
  ]

  return (
    <>
      <HeroSection 
        title="Farming Categories"
        subtitle="Explore comprehensive resources for all aspects of modern agriculture"
        backgroundClass="bg-primary-50"
      />
      
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {categories.map(category => (
              <div key={category.id} className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl">
                <div className="relative">
                  <img 
                    src={category.image} 
                    alt={category.name} 
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-4 left-4">
                    <h3 className="text-2xl font-bold text-white">{category.name}</h3>
                  </div>
                </div>
                
                <div className="p-6">
                  <p className="text-gray-600 mb-6">{category.description}</p>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3">Key Features:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {category.features.map((feature, index) => (
                        <div key={index} className="flex items-center text-sm text-gray-600">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Link 
                    to={category.link}
                    className="btn-primary w-full text-center"
                  >
                    Explore {category.name}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Quick Stats */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Our Categories?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Comprehensive resources backed by agricultural experts and real-world experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">500+</div>
              <p className="text-gray-600">Crop Varieties</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">200+</div>
              <p className="text-gray-600">Livestock Breeds</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">150+</div>
              <p className="text-gray-600">Fish Species</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">100+</div>
              <p className="text-gray-600">Technologies</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Categories