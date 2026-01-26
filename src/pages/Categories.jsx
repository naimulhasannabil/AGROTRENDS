import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import HeroSection from '../components/HeroSection'
import BlogCard from '../components/BlogCard'
import { useGetAllCategories } from '../services/query/categories'
import { useGetAllBlogs, useGetBlogsByCategory } from '../services/query/blog'

function Categories() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [currentPage, setCurrentPage] = useState(0)
  const pageSize = 9
  
  // Fetch all categories
  const { data: categoriesData, isLoading: loadingCategories } = useGetAllCategories(0, 50, 'categoryName', 'asc')
  
  // Fetch blogs based on selected category
  const { data: allBlogsData, isLoading: isLoadingAll } = useGetAllBlogs(
    currentPage,
    pageSize,
    'creationDate',
    'desc',
    { enabled: selectedCategory === 'all', retry: false }
  )
  
  const { data: categoryBlogsData, isLoading: isLoadingCategory } = useGetBlogsByCategory(
    selectedCategory,
    currentPage,
    pageSize,
    'creationDate',
    'desc',
    { enabled: selectedCategory !== 'all', retry: false }
  )
  
  const loading = selectedCategory === 'all' ? isLoadingAll : isLoadingCategory
  const apiData = selectedCategory === 'all' ? allBlogsData : categoryBlogsData
  
  // Extract blogs from API response
  const responseData = apiData?.data
  const payload = responseData?.payload
  const blogsData = payload?.content || payload || responseData?.content || responseData || []
  const blogs = Array.isArray(blogsData) ? blogsData : []
  
  // Static fallback categories with enhanced data and real information
  const staticCategories = [
    {
      id: 'crops',
      categoryName: 'Crops',
      description: 'Master crop cultivation with expert techniques for planting, growing, and harvesting various agricultural crops for maximum yield and quality.',
      image: 'https://images.pexels.com/photos/326082/pexels-photo-326082.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      features: ['Seed Selection', 'Soil Preparation', 'Irrigation Methods', 'Pest Control'],
      tips: [
        'Test soil pH before planting to ensure optimal nutrient availability',
        'Rotate crops annually to prevent soil depletion and pest buildup',
        'Use organic mulch to retain moisture and suppress weeds',
        'Monitor weather patterns for best planting and harvesting times'
      ],
      link: '/crops'
    },
    {
      id: 'livestock',
      categoryName: 'Livestock',
      description: 'Learn sustainable livestock management practices including breeding, nutrition, health care, and housing for cattle, sheep, goats, and poultry.',
      image: 'https://images.pexels.com/photos/422218/pexels-photo-422218.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      features: ['Animal Nutrition', 'Breeding Techniques', 'Disease Prevention', 'Housing Design'],
      tips: [
        'Provide clean, fresh water daily - animals need 2-3 times more water than feed',
        'Implement a vaccination schedule to prevent common diseases',
        'Ensure proper ventilation in housing to reduce respiratory issues',
        'Keep detailed records of breeding, health, and production for better management'
      ],
      link: '/livestock'
    },
    {
      id: 'fisheries',
      categoryName: 'Fisheries',
      description: 'Discover sustainable aquaculture practices, fish pond management, water quality control, and profitable fish farming techniques.',
      image: 'https://images.pexels.com/photos/1300355/pexels-photo-1300355.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      features: ['Pond Management', 'Water Quality Testing', 'Fish Nutrition', 'Harvest Techniques'],
      tips: [
        'Test water pH weekly - maintain between 6.5-8.5 for optimal fish health',
        'Stock fish according to pond size: 1 fish per 10 gallons for healthy growth',
        'Feed fish 2-3% of their body weight daily, adjust based on temperature',
        'Install aerators to maintain dissolved oxygen levels above 5 mg/L'
      ],
      link: '/fisheries'
    },
    {
      id: 'technologies',
      categoryName: 'Technologies',
      description: 'Explore cutting-edge agricultural technologies including precision farming, IoT sensors, drones, and automation for modern farming.',
      image: 'https://images.pexels.com/photos/2280551/pexels-photo-2280551.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      features: ['Smart Sensors', 'Drone Monitoring', 'Automated Systems', 'Data Analytics'],
      tips: [
        'Use soil moisture sensors to optimize irrigation and save water up to 30%',
        'Implement GPS-guided tractors to reduce overlap and fuel costs',
        'Install weather stations for precise forecasting and planning',
        'Track crop health with drone imagery to detect issues early'
      ],
      link: '/technologies'
    }
  ]
  
  // Function to generate default info for new categories
  const generateCategoryInfo = (categoryName) => ({
    description: `Comprehensive resources and expert guidance for ${categoryName.toLowerCase()}. Learn best practices, techniques, and sustainable methods.`,
    image: 'https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    features: ['Best Practices', 'Expert Guidance', 'Practical Tips', 'Resource Library'],
    tips: [
      `Stay updated with latest ${categoryName.toLowerCase()} trends and innovations`,
      `Join farming communities to share experiences and learn from experts`,
      `Implement sustainable practices for long-term success`,
      `Keep detailed records to track progress and improve efficiency`
    ],
    link: `/blogs?category=${categoryName.toLowerCase()}`
  })

  // Process categories data from API
  const apiCategories = useMemo(() => {
    return categoriesData?.data?.payload?.content || categoriesData?.data?.payload || categoriesData?.data || []
  }, [categoriesData])
  
  // Build categories array with "All" option
  const categories = useMemo(() => {
    const cats = [{ id: 'all', categoryName: 'All' }]
    if (Array.isArray(apiCategories) && apiCategories.length > 0) {
      cats.push(...apiCategories)
    }
    return cats
  }, [apiCategories])
  
  // Enrich API data with static data (images, descriptions, features, links)
  const enrichedCategories = Array.isArray(apiCategories) && apiCategories.length > 0
    ? apiCategories.map(apiCategory => {
        const staticMatch = staticCategories.find(
          cat => cat.categoryName.toLowerCase() === apiCategory.categoryName.toLowerCase()
        )
        
        // If static match found, merge the data
        if (staticMatch) {
          return {
            id: apiCategory.id,
            categoryName: apiCategory.categoryName,
            creationDate: apiCategory.creationDate,
            lastModifiedDate: apiCategory.lastModifiedDate,
            description: staticMatch.description,
            image: staticMatch.image,
            features: staticMatch.features,
            tips: staticMatch.tips,
            link: staticMatch.link
          }
        }
        
        // If no static match, generate dynamic info for admin-created categories
        const generatedInfo = generateCategoryInfo(apiCategory.categoryName)
        return {
          id: apiCategory.id,
          categoryName: apiCategory.categoryName,
          creationDate: apiCategory.creationDate,
          lastModifiedDate: apiCategory.lastModifiedDate,
          description: generatedInfo.description,
          image: generatedInfo.image,
          features: generatedInfo.features,
          tips: generatedInfo.tips,
          link: generatedInfo.link
        }
      })
    : staticCategories

  const displayCategories = enrichedCategories
  
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId)
    setCurrentPage(0)
  }

  return (
    <>
      <HeroSection 
        title="Farming Categories"
        subtitle="Explore comprehensive resources for all aspects of modern agriculture"
        backgroundClass="bg-[#DAFCE7]"
      />
      
      {/* Category Filter Bar */}
      <section className="py-10 bg-white border-b">
        <div className="container-custom">
          <div className="flex justify-center items-center">
            <div className="flex items-center space-x-3 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`px-6 py-2.5 rounded-full font-medium whitespace-nowrap transition-all duration-200 ${
                    selectedCategory === category.id
                      ? 'bg-primary-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.categoryName}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Blogs by Category */}
      <section className="py-12 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold mb-8 text-center">
            {selectedCategory === 'all' 
              ? 'All Blogs' 
              : `${categories.find(c => c.id === selectedCategory)?.categoryName || ''} Blogs`}
          </h2>
          
          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-14 w-14 border-4 border-gray-200 border-t-primary-600"></div>
              <p className="mt-5 text-gray-600 font-medium">Loading blogs...</p>
            </div>
          ) : blogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map(blog => (
                <BlogCard key={blog.blogId || blog.id} blog={blog} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No blogs found</h3>
              <p className="text-gray-500">No blogs available in this category yet.</p>
            </div>
          )}
        </div>
      </section>
      
      {/* Category Cards */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <h2 className="text-3xl font-bold mb-8 text-center">Browse by Category</h2>
          {loadingCategories ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {displayCategories.map(category => (
                <div key={category.id} className="bg-[#DAFCE7] rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl">
                  <div className="relative">
                    <img 
                      src={category.image} 
                      alt={category.categoryName} 
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute bottom-4 left-4">
                      <h3 className="text-2xl font-bold text-white">{category.categoryName}</h3>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <p className="text-gray-600 mb-6">{category.description}</p>
                    
                    <div className="mb-4">
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
                    
                    {/* Expert Tips Section */}
                    <div className="mb-6 bg-white p-4 rounded-lg">
                      <h4 className="font-semibold mb-3 text-green-700 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        Expert Tips
                      </h4>
                      <ul className="space-y-2">
                        {category.tips.slice(0, 2).map((tip, index) => (
                          <li key={index} className="text-sm text-gray-700 flex items-start">
                            <span className="text-green-600 mr-2 font-bold">✓</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                      {category.tips.length > 2 && (
                        <p className="text-xs text-gray-500 mt-3 italic">
                          +{category.tips.length - 2} more expert tips inside
                        </p>
                      )}
                    </div>
                    
                    <Link 
                      to={category.link}
                      className="btn-primary w-full text-center"
                    >
                      Explore {category.categoryName}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
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