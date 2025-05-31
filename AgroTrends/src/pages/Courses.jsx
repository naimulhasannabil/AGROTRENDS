import HeroSection from '../components/HeroSection'

function Courses() {
  // Sample courses data
  const courses = [
    {
      id: 1,
      title: "Fundamentals of Organic Farming",
      instructor: "Dr. Sarah Johnson",
      duration: "6 weeks",
      level: "Beginner",
      description: "Learn the foundational principles of organic farming, from soil management to natural pest control methods.",
      image: "https://images.pexels.com/photos/2132250/pexels-photo-2132250.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      price: 129.99,
      rating: 4.8,
      students: 1240
    },
    {
      id: 2,
      title: "Advanced Hydroponics Systems",
      instructor: "Prof. Michael Wong",
      duration: "8 weeks",
      level: "Intermediate",
      description: "Master the design, implementation and maintenance of commercial-scale hydroponic growing systems.",
      image: "https://images.pexels.com/photos/348689/pexels-photo-348689.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      price: 199.99,
      rating: 4.9,
      students: 876
    },
    {
      id: 3,
      title: "Sustainable Livestock Management",
      instructor: "Emma Davis, MSc",
      duration: "10 weeks",
      level: "Intermediate",
      description: "Comprehensive approach to raising livestock using regenerative and humane practices.",
      image: "https://images.pexels.com/photos/693776/pexels-photo-693776.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      price: 179.99,
      rating: 4.7,
      students: 945
    },
    {
      id: 4,
      title: "Agricultural Business Management",
      instructor: "Robert Chen, MBA",
      duration: "12 weeks",
      level: "Advanced",
      description: "Learn effective business strategies specifically designed for farm operations of all sizes.",
      image: "https://images.pexels.com/photos/2886937/pexels-photo-2886937.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      price: 249.99,
      rating: 4.6,
      students: 1103
    },
    {
      id: 5,
      title: "Precision Agriculture Technologies",
      instructor: "Dr. James Miller",
      duration: "8 weeks",
      level: "Advanced",
      description: "Explore cutting-edge technologies including IoT sensors, drones, and AI for modern farming.",
      image: "https://images.pexels.com/photos/2252584/pexels-photo-2252584.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      price: 299.99,
      rating: 4.9,
      students: 732
    },
    {
      id: 6,
      title: "Soil Health and Regeneration",
      instructor: "Dr. Amara Patel",
      duration: "6 weeks",
      level: "Beginner",
      description: "Comprehensive guide to building and maintaining healthy soils for sustainable agriculture.",
      image: "https://images.pexels.com/photos/1112080/pexels-photo-1112080.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      price: 149.99,
      rating: 4.8,
      students: 1578
    }
  ]
  
  return (
    <>
      {/* Hero Section */}
      <HeroSection 
        title="Premium Farming Courses"
        subtitle="Enhance your agricultural knowledge and skills with expert-led online courses"
        backgroundClass="bg-[#DAFCE7]"
      />
      
      {/* Courses Grid */}
      <section className="py-12 bg-gray-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map(course => (
              <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="relative">
                  <img 
                    src={course.image} 
                    alt={course.title} 
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 text-sm font-semibold text-primary-700">
                    {course.level}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                  <p className="text-gray-700 mb-3">{course.description}</p>
                  <div className="mb-4">
                    <div className="flex items-center mb-1">
                      <span className="text-gray-600 text-sm">Instructor:</span>
                      <span className="ml-2 text-sm font-medium">{course.instructor}</span>
                    </div>
                    <div className="flex items-center mb-1">
                      <span className="text-gray-600 text-sm">Duration:</span>
                      <span className="ml-2 text-sm font-medium">{course.duration}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="ml-1 text-sm font-medium">{course.rating}</span>
                      </div>
                      <span className="mx-2 text-gray-300">|</span>
                      <span className="text-sm text-gray-600">{course.students} students</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-primary-700">${course.price}</span>
                    <button className="btn-primary">
                      Enroll Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Learn with AgroTrends?</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Our courses are designed by agricultural experts to provide practical knowledge and skills you can apply immediately to your farming operations.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Instructors</h3>
              <p className="text-gray-600">
                Learn from industry professionals with years of hands-on experience and academic expertise
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Downloadable Resources</h3>
              <p className="text-gray-600">
                Access comprehensive guides, checklists, and templates to support your learning journey
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Community Support</h3>
              <p className="text-gray-600">
                Join a global community of farmers and get support from instructors and fellow students
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-16 bg-primary-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Our Students Say</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold">Mark Thompson</h4>
                  <p className="text-sm text-gray-600">Organic Farmer, California</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "The Organic Farming course transformed my small family farm. The soil management techniques alone doubled our yield within a single season."
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold">Elena Diaz</h4>
                  <p className="text-sm text-gray-600">Urban Farmer, New York</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "I was skeptical about hydroponics until I took the Advanced Hydroponics course. Now I'm growing year-round in my urban setting with amazing results."
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold">Robert Johnson</h4>
                  <p className="text-sm text-gray-600">Livestock Farmer, Texas</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "The Sustainable Livestock course helped me implement rotational grazing that improved my pastures and animal health while reducing feed costs."
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Courses