import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import HeroSection from '../components/HeroSection'
import FeatureCard from '../components/FeatureCard'
import BlogCard from '../components/BlogCard'
import CategoryFilter from '../components/CategoryFilter'
import WeatherWidget from '../components/WeatherWidget'
import AIInsights from '../components/AIInsights'
import { useGetAllBlogs, useGetBlogsByCategory } from '../services/query/blog'
import { getAllCategories } from '../services/categoryService'

// Icons for feature cards
const BookIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
  </svg>
)

const UsersIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
  </svg>
)

const AcademicCapIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
  </svg>
)

const ChartIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
  </svg>
)

function Home() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [categories, setCategories] = useState([{ id: 'all', name: 'All' }])
  const [loadingCategories, setLoadingCategories] = useState(true)
  const pageSize = 3 // Show only 3 blogs on homepage
  
  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true)
        console.log('Home - Fetching categories...')
        
        // Use the categoryService which handles authentication properly
        const data = await getAllCategories(0, 50, 'categoryName', 'asc')
        console.log('Home - Categories response:', data)
        
        // Handle both array and paginated response
        const categoriesArray = Array.isArray(data) 
          ? data 
          : (data.payload?.content || data.payload || data.content || [])
        
        console.log('Home - Parsed categories array:', categoriesArray)
        
        if (categoriesArray.length > 0) {
          // Transform categories to match the format needed for CategoryFilter
          const transformedCategories = [
            { id: 'all', name: 'All' },
            ...categoriesArray.map(cat => ({
              id: cat.categoryId || cat.id,
              name: cat.categoryName || cat.name
            }))
          ]
          
          console.log('Home - Transformed categories:', transformedCategories)
          setCategories(transformedCategories)
        } else {
          console.warn('Home - No categories found in response')
          setCategories([{ id: 'all', name: 'All' }])
        }
      } catch (error) {
        console.error('Home - Error fetching categories:', error)
        console.error('Home - Error details:', error.response?.data)
        // Keep the default "All" category if fetching fails
        setCategories([{ id: 'all', name: 'All' }])
      } finally {
        setLoadingCategories(false)
      }
    }
    
    fetchCategories()
  }, [])
  
  // Use React Query hooks for fetching blogs
  const { data: allBlogsData, isLoading: isLoadingAll, error: errorAll } = useGetAllBlogs(
    0, // page 0
    pageSize,
    'creationDate',
    'desc',
    { enabled: activeCategory === 'all', retry: false }
  )
  
  const { data: categoryBlogsData, isLoading: isLoadingCategory, error: errorCategory } = useGetBlogsByCategory(
    activeCategory,
    0, // page 0
    pageSize,
    'creationDate',
    'desc',
    { enabled: activeCategory !== 'all', retry: false }
  )
  
  // Sample data for features
  const features = [
    {
      id: 1,
      title: 'Expert Blogs',
      description: 'Access cutting-edge farming insights from agricultural experts worldwide',
      icon: BookIcon
    },
    {
      id: 2,
      title: 'Community Q&A',
      description: 'Connect with fellow farmers and get answers to your farming questions',
      icon: UsersIcon
    },
    {
      id: 3,
      title: 'Premium Courses',
      description: 'Enhance your farming skills with our comprehensive online courses',
      icon: AcademicCapIcon
    },
    {
      id: 4,
      title: 'Market Trends',
      description: 'Stay updated with the latest agricultural market insights and predictions',
      icon: ChartIcon
    }
  ]
  
  // Determine which data to use based on active category
  const loading = activeCategory === 'all' ? isLoadingAll : isLoadingCategory
  const error = activeCategory === 'all' ? errorAll : errorCategory
  const apiData = activeCategory === 'all' ? allBlogsData : categoryBlogsData
  
  // Extract blogs from API response
  const responseData = apiData?.data
  const payload = responseData?.payload
  const blogsData = payload?.content || payload || responseData?.content || responseData || []
  const blogs = Array.isArray(blogsData) ? blogsData : []
  
  return (
    <>
      {/* Hero Section */}
      <HeroSection 
        title="Grow with Knowledge"
        subtitle="Explore expert blogs, innovative tools, and cutting-edge insights for modern sustainable farming"
        primaryButtonText="Explore Blogs"
        primaryButtonLink="/blogs"
        secondaryButtonText="Watch Demo"
        secondaryButtonLink="#"
        backgroundClass="bg-[#DAFCE7]"
      />
      
      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Everything You Need to Succeed</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Comprehensive resources designed to help modern farmers thrive in today's agricultural landscape
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map(feature => (
              <FeatureCard key={feature.id} feature={feature} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Latest Insights Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          {/* AI Dashboard */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2">
              <AIInsights />
            </div>
            <div>
              <WeatherWidget />
            </div>
          </div>
          
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Latest Insights</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Stay ahead with the latest trends and expert advice in modern agriculture
            </p>
          </div>
          
          {/* Show loading state while categories are being fetched */}
          {loadingCategories ? (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-gray-200 border-t-primary-600"></div>
              <p className="mt-2 text-sm text-gray-500">Loading categories...</p>
            </div>
          ) : (
            <>
              <CategoryFilter 
                categories={categories} 
                activeCategory={activeCategory} 
                onCategoryChange={setActiveCategory} 
              />
            </>
          )}
          
          {/* Blogs Display */}
          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-14 w-14 border-4 border-gray-200 border-t-primary-600"></div>
              <p className="mt-5 text-gray-600 font-medium">Loading blogs...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">Unable to load blogs</h3>
              <p className="text-gray-600 mb-4">Please try again later</p>
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
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">No blogs available</h3>
              <p className="text-gray-600 mb-4">Check back soon for new content</p>
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link to="/blogs" className="btn-secondary hover:bg-green-600 hover:text-white">
              View All Blogs
            </Link>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Community Today</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Connect with thousands of farmers and agricultural experts worldwide
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/sign-up" className="btn bg-white text-primary-700 hover:bg-gray-100">
              Sign Up - It's Free
            </Link>
            <Link to="/about" className="btn border border-white text-white hover:bg-white hover:text-green-700">
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

export default Home