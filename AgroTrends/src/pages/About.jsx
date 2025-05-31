import HeroSection from '../components/HeroSection'
import TeamMember from '../components/TeamMember'
import { Link } from 'react-router-dom'

function About() {
  // Sample team members data
  const teamMembers = [
    {
      id: 1,
      name: 'MD. Nayeem Ahmed',
      role: 'Founder & Lead Developer',
      image: null
    },
    {
      id: 2,
      name: 'Naimul Hasan Nabil',
      role: 'Frontend Developer',
      image: null
    },
    {
      id: 3,
      name: 'Nur Hossain Nur',
      role: 'Market Analyst',
      image: null
    },
    {
      id: 4,
      name: 'Emily Brown',
      role: 'Community Manager',
      image: null
    }
  ]
  
  return (
    <>
      {/* Hero Section */}
      <HeroSection 
        title="About Us"
        subtitle="Empowering farmers worldwide with knowledge and innovative solutions for sustainable agriculture."
        backgroundClass="bg-[#DAFCE7]"
      />
      
      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-gray-700 max-w-3xl mx-auto text-lg leading-relaxed">
              At AgroTrends, we are dedicated to revolutionizing farming through
              cutting-edge insights, expert resources, and a supportive community.
              Our goal is to promote sustainable practices that ensure food security
              for future generations.
            </p>
          </div>
          
          {/* Values */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="bg-[#DAFCE7] p-6 rounded-lg">
              <div className="w-12 h-12 bg-[#abedc4] rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-primary-700">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Innovation</h3>
              <p className="text-gray-600">
                We constantly seek new technologies and methods to improve agricultural practices and productivity.
              </p>
            </div>
            
            <div className="bg-[#DAFCE7] p-6 rounded-lg">
              <div className="w-12 h-12 bg-[#abedc4] rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-primary-700">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Sustainability</h3>
              <p className="text-gray-600">
                We promote farming practices that protect our environment and ensure long-term food security.
              </p>
            </div>
            
            <div className="bg-[#DAFCE7] p-6 rounded-lg">
              <div className="w-12 h-12 bg-[#abedc4] rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-primary-700">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Community</h3>
              <p className="text-gray-600">
                We believe in the power of knowledge sharing and building a global network of agricultural professionals.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              A passionate group of experts driving the future of agriculture.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map(member => (
              <TeamMember key={member.id} member={member} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Join Us Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-6">Join Our Journey</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Become part of the AgroTrends community and help shape the future
            of sustainable farming.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/sign-up" className="btn bg-white text-primary-700 hover:bg-gray-100">
              Get Started Today
            </Link>
            <Link to="/blogs" className="btn border border-white text-white hover:bg-white hover:text-green-700">
              Explore Blogs
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

export default About