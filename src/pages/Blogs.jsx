import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import HeroSection from '../components/HeroSection'
import BlogCard from '../components/BlogCard'
import CategoryFilter from '../components/CategoryFilter'
import { useAuth } from '../contexts/AuthContext'
import { getAllBlogs, getBlogsByCategory } from '../services/blogService'

function Blogs() {
  const { user } = useAuth()
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [_error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const pageSize = 9
  
  // Sample blogs for when backend is not available
  const sampleBlogs = [
    {
      blogId: 'sample-1',
      title: 'Getting Started with Modern Agriculture',
      content: 'Discover the latest trends and technologies revolutionizing the agricultural industry. From precision farming to sustainable practices, learn how modern methods are transforming traditional farming.',
      imageUrl: 'https://images.pexels.com/photos/440731/pexels-photo-440731.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      authorName: 'AgroTrends Team',
      categoryName: 'Technologies',
      categoryId: 4,
      createdDate: '2025-12-20T10:00:00Z'
    },
    {
      blogId: 'sample-2',
      title: 'Sustainable Irrigation Methods',
      content: 'Learn about water-efficient irrigation techniques that help farmers optimize water usage while maintaining healthy crops. Discover drip irrigation, sprinkler systems, and smart water management solutions.',
      imageUrl: 'https://images.pexels.com/photos/1483880/pexels-photo-1483880.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      authorName: 'Water Conservation Expert',
      categoryName: 'Crops',
      categoryId: 3,
      createdDate: '2025-12-18T10:00:00Z'
    },
    {
      blogId: 'sample-3',
      title: 'Smart Cattle Management Systems',
      content: 'Explore how IoT and AI technologies are helping livestock farmers monitor animal health, track movements, and optimize feeding schedules for better productivity and animal welfare.',
      imageUrl: 'https://images.pexels.com/photos/2280551/pexels-photo-2280551.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      authorName: 'Livestock Specialist',
      categoryName: 'Cattles',
      categoryId: 2,
      createdDate: '2025-12-15T10:00:00Z'
    },
    {
      blogId: 'sample-4',
      title: 'Aquaculture Innovation and Best Practices',
      content: 'Dive into the world of modern fish farming with insights on sustainable aquaculture practices, water quality management, and breeding techniques for optimal fish production.',
      imageUrl: 'https://images.pexels.com/photos/1112080/pexels-photo-1112080.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      authorName: 'Aquaculture Expert',
      categoryName: 'Fisheries',
      categoryId: 1,
      createdDate: '2025-12-12T10:00:00Z'
    },
    {
      blogId: 'sample-5',
      title: 'Climate-Resilient Crop Varieties',
      content: 'New crop varieties are being developed to withstand changing climate conditions. Learn about drought-resistant, heat-tolerant, and disease-resistant crops that ensure food security.',
      imageUrl: 'https://images.pexels.com/photos/265216/pexels-photo-265216.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      authorName: 'Agricultural Scientist',
      categoryName: 'Crops',
      categoryId: 3,
      createdDate: '2025-12-10T10:00:00Z'
    },
    {
      blogId: 'sample-6',
      title: 'Precision Agriculture with Drones',
      content: 'Discover how drone technology is revolutionizing farming with aerial crop monitoring, precision spraying, and real-time field analysis for data-driven decision making.',
      imageUrl: 'https://images.pexels.com/photos/2886937/pexels-photo-2886937.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      authorName: 'Tech Agriculture Advisor',
      categoryName: 'Technologies',
      categoryId: 4,
      createdDate: '2025-12-08T10:00:00Z'
    }
  ]
  
  // Categories for filter
  const categories = [
    { id: 'all', name: 'All' },
    { id: 1, name: 'Fisheries' },
    { id: 2, name: 'Cattles' },
    { id: 3, name: 'Crops' },
    { id: 4, name: 'Technologies' }
  ]
  
  const [activeCategory, setActiveCategory] = useState('all')
  
  // Fetch blogs from API
  useEffect(() => {
    fetchBlogs()
  }, [currentPage, activeCategory])
  
  const fetchBlogs = async () => {
    try {
      setLoading(true)
      setError(null)
      let response
      
      if (activeCategory === 'all') {
        response = await getAllBlogs(currentPage, pageSize, 'creationDate', 'desc')
      } else {
        response = await getBlogsByCategory(activeCategory, currentPage, pageSize, 'creationDate', 'desc')
      }
      
      console.log('Blogs API response:', response)
      
      // Handle different response structures
      if (response && Array.isArray(response) && response.length > 0) {
        // Direct array response (already normalized by service)
        setBlogs(response)
        setTotalPages(Math.ceil(response.length / pageSize) || 1)
      } else if (response?.content && Array.isArray(response.content) && response.content.length > 0) {
        // Paginated response with content array
        setBlogs(response.content)
        setTotalPages(response.totalPages || 1)
      } else {
        // No blogs from API, use sample blogs
        console.log('No blogs from API, loading sample blogs')
        loadSampleBlogs()
      }
    } catch (err) {
      console.error('Error fetching blogs:', err)
      // On error, load sample blogs instead of showing empty page
      loadSampleBlogs()
    } finally {
      setLoading(false)
    }
  }
  
  const loadSampleBlogs = () => {
    if (activeCategory === 'all') {
      setBlogs(sampleBlogs)
    } else {
      const filtered = sampleBlogs.filter(blog => blog.categoryId === activeCategory)
      setBlogs(filtered)
    }
    setTotalPages(1)
    setError(null)
  }
  
  // Filter blogs based on search query (client-side filtering)
  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = searchQuery === '' || 
                         blog.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         blog.content?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })
  
  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId)
    setCurrentPage(0) // Reset to first page when category changes
  }
  
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }
  
  // Check if user is an author (userType array includes 'AUTHOR')
  console.log('Blogs page - Current user:', user)
  console.log('Blogs page - userType:', user?.userType)
  const isAuthor = user?.userType?.includes('AUTHOR')
  console.log('Blogs page - isAuthor:', isAuthor)
  
  return (
    <>
      {/* Hero Section */}
      <HeroSection 
        title="Our Latest Blogs"
        subtitle="Stay ahead with the latest trends and expert advice in modern agriculture"
        backgroundClass="bg-[#DAFCE7]"
      />
      
      {/* User Mode Indicator & Author Actions */}
      {user && (
        <section className="py-5 bg-white border-b shadow-sm">
          <div className="container-custom">
            <div className="flex justify-between items-center">
              {/* Mode Indicator */}
              <div className="flex items-center space-x-2">
                {isAuthor ? (
                  <>
                    <div className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg">
                      <svg className="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                      <span className="font-semibold text-blue-700">Author Mode</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg">
                      <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                      <span className="font-semibold text-green-700">User Mode</span>
                    </div>
                  </>
                )}
              </div>
              
              {/* Create Blog Button - Only for Authors */}
              {isAuthor && (
                <Link 
                  to="/blogs/create" 
                  className="btn-primary inline-flex items-center shadow-md hover:shadow-lg transition-shadow duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create New Blog
                </Link>
              )}
            </div>
          </div>
        </section>
      )}
      
      {/* Search and Filter Section */}
      <section className="py-10 bg-white">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto mb-10">
            <div className="relative">
              <input
                type="text"
                placeholder="Search blogs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-5 py-3.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-sm hover:border-gray-400 transition-colors duration-200"
              />
              <button className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary-600 transition-colors duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
          
          <CategoryFilter 
            categories={categories} 
            activeCategory={activeCategory} 
            onCategoryChange={handleCategoryChange} 
          />
        </div>
      </section>
      
      {/* Blogs Grid */}
      <section className="py-12 bg-gray-50">
        <div className="container-custom">
          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-14 w-14 border-4 border-gray-200 border-t-primary-600"></div>
              <p className="mt-5 text-gray-600 font-medium">Loading blogs...</p>
            </div>
          ) : filteredBlogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBlogs.map(blog => (
                <BlogCard key={blog.blogId || blog.id} blog={blog} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">No blogs found</h3>
              <p className="text-gray-600 mb-8">Try adjusting your search or filter criteria</p>
              <button 
                onClick={() => {
                  setActiveCategory('all')
                  setSearchQuery('')
                  setCurrentPage(0)
                }}
                className="btn-primary shadow-md hover:shadow-lg transition-shadow duration-200"
              >
                Reset Filters
              </button>
            </div>
          )}
          
          {/* Pagination */}
          {!loading && filteredBlogs.length > 0 && totalPages > 1 && (
            <div className="flex justify-center items-center mt-14 gap-2">
              <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
                className="px-5 py-2.5 bg-white border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 hover:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
              >
                Previous
              </button>
              
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => handlePageChange(index)}
                  className={`px-4 py-2.5 border-2 font-semibold rounded-lg transition-all duration-200 ${
                    currentPage === index
                      ? 'bg-primary-600 text-white border-primary-600 shadow-md'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-primary-500 shadow-sm'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              
              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages - 1}
                className="px-5 py-2.5 bg-white border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 hover:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>
      
      {/* Newsletter Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated with AgroTrends</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter to receive the latest agricultural insights and news
          </p>
          <div className="max-w-md mx-auto">
            <form className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-grow px-4 py-3 rounded-2xl focus:outline-none text-gray-800"
                required
              />
              <button type="submit" className="btn bg-primary-800 text-white hover:bg-primary-900 whitespace-nowrap rounded-2xl">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}

export default Blogs