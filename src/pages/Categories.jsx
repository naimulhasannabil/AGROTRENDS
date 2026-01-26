import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import HeroSection from '../components/HeroSection'
import BlogCard from '../components/BlogCard'
import { useAuth } from '../contexts/AuthContext'
import { useGetAllCategories } from '../services/query/categories'
import { useGetAllBlogs, useGetBlogsByCategory } from '../services/query/blog'

function Categories() {
  const { user } = useAuth()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [currentPage, setCurrentPage] = useState(0)
  const pageSize = 9
  
  // Fetch all categories
  const { data: categoriesData } = useGetAllCategories(0, 50, 'categoryName', 'asc')
  
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
  // NOTE: Detailed "Browse by Category" cards and their static/dynamic
  // data were removed. The category filter and blogs listing still work
  // using the API-driven `categoriesData` and blog queries above.
  // Recreate a minimal categories array for the filter bar.
  const apiCategories = useMemo(() => {
    return categoriesData?.data?.payload?.content || categoriesData?.data?.payload || categoriesData?.data || []
  }, [categoriesData])

  const categories = useMemo(() => {
    const cats = [{ id: 'all', categoryName: 'All' }]
    if (Array.isArray(apiCategories) && apiCategories.length > 0) {
      cats.push(...apiCategories)
    }
    return cats
  }, [apiCategories])
  
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
          
          {!user ? (
            /* Show sign-up message when user is not logged in */
            <div className="text-center py-16 max-w-2xl mx-auto">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto text-primary-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Unlock Category Insights</h3>
                <p className="text-gray-600 mb-6">
                  Sign up to explore category-specific blogs, expert tips, and comprehensive agricultural resources tailored to your farming needs.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link 
                    to="/sign-up"
                    state={{ from: '/categories' }}
                    className="btn-primary py-3 px-8 text-lg inline-block text-center"
                  >
                    Sign Up Now
                  </Link>
                  <Link 
                    to="/sign-in"
                    state={{ from: '/categories' }}
                    className="px-8 py-3 border-2 border-primary-600 text-primary-600 rounded-md hover:bg-primary-50 font-medium text-lg inline-block text-center"
                  >
                    Sign In
                  </Link>
                </div>
                <p className="mt-4 text-sm text-gray-500">
                  Already have an account? <Link to="/sign-in" state={{ from: '/categories' }} className="text-primary-600 hover:text-primary-800 font-medium">Sign in here</Link>
                </p>
              </div>
            </div>
          ) : loading ? (
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
      
      {/* Category cards removed as requested - the filter and blog listing remain */}
      
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