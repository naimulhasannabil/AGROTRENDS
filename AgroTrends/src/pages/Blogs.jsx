import { useState } from 'react'
import { Link } from 'react-router-dom'
import HeroSection from '../components/HeroSection'
import BlogCard from '../components/BlogCard'
import CategoryFilter from '../components/CategoryFilter'

function Blogs() {
  // Sample data for blogs
  const allBlogs = [
    {
      id: 1,
      title: 'New Age of Farming',
      author: 'sadiq',
      date: 'May 11, 2025',
      excerpt: 'This blog is a comprehensive lesson about new age of farming',
      image: 'https://images.pexels.com/photos/440731/pexels-photo-440731.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      category: 'Uncategorized'
    },
    {
      id: 2,
      title: 'Sustainable Irrigation Methods',
      author: 'Emily Johnson',
      date: 'May 8, 2025',
      excerpt: 'Learn about water-efficient irrigation techniques for sustainable farming',
      image: 'https://images.pexels.com/photos/1483880/pexels-photo-1483880.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      category: 'Uncategorized'
    },
    {
      id: 3,
      title: 'The Future of Vertical Farming',
      author: 'Michael Chen',
      date: 'May 3, 2025',
      excerpt: 'Exploring how vertical farming technologies are revolutionizing urban agriculture',
      image: 'https://images.pexels.com/photos/2886937/pexels-photo-2886937.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      category: 'Uncategorized'
    },
    {
      id: 4,
      title: 'Organic Pest Management',
      author: 'Sarah Williams',
      date: 'April 28, 2025',
      excerpt: 'Natural methods to control pests without harmful chemicals',
      image: 'https://images.pexels.com/photos/2280551/pexels-photo-2280551.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      category: 'Uncategorized'
    },
    {
      id: 5,
      title: 'Climate-Resilient Crop Varieties',
      author: 'James Rodriguez',
      date: 'April 22, 2025',
      excerpt: 'New crop varieties developed to withstand changing climate conditions',
      image: 'https://images.pexels.com/photos/265216/pexels-photo-265216.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      category: 'Uncategorized'
    },
    {
      id: 6,
      title: 'Smart Farming Technologies',
      author: 'Robert Kim',
      date: 'April 15, 2025',
      excerpt: 'How IoT and AI are transforming traditional farming practices',
      image: 'https://images.pexels.com/photos/1112080/pexels-photo-1112080.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      category: 'Uncategorized'
    }
  ]
  
  // Categories for filter
  const categories = [
    { id: 'all', name: 'All' },
    { id: 'fisheries', name: 'Fisheries' },
    { id: 'cattles', name: 'Cattles' },
    { id: 'crops', name: 'Crops' },
    { id: 'technologies', name: 'Technologies' }
  ]
  
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  
  // Filter blogs based on category and search query
  const filteredBlogs = allBlogs.filter(blog => {
    const matchesCategory = activeCategory === 'all' || blog.category.toLowerCase() === activeCategory.toLowerCase()
    const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })
  
  return (
    <>
      {/* Hero Section */}
      <HeroSection 
        title="Our Latest Blogs"
        subtitle="Stay ahead with the latest trends and expert advice in modern agriculture"
        backgroundClass="bg-[#DAFCE7]"
      />
      
      {/* Search and Filter Section */}
      <section className="py-8 bg-white">
        <div className="container-custom">
          <div className="max-w-xl mx-auto mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search blogs..."
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
          
          <CategoryFilter 
            categories={categories} 
            activeCategory={activeCategory} 
            onCategoryChange={setActiveCategory} 
          />
        </div>
      </section>
      
      {/* Blogs Grid */}
      <section className="py-8 bg-gray-50">
        <div className="container-custom">
          {filteredBlogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBlogs.map(blog => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium mb-2">No blogs found</h3>
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
          
          {/* Pagination */}
          {filteredBlogs.length > 0 && (
            <div className="flex justify-center mt-12">
              <nav className="inline-flex rounded-md shadow">
                <a href="#" className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-l-md hover:bg-gray-50">
                  Previous
                </a>
                <a href="#" className="px-4 py-2 bg-primary-600 text-white border border-primary-600">
                  1
                </a>
                <a href="#" className="px-4 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50">
                  2
                </a>
                <a href="#" className="px-4 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50">
                  3
                </a>
                <a href="#" className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-r-md hover:bg-gray-50">
                  Next
                </a>
              </nav>
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