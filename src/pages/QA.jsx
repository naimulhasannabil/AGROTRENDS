import { useState } from 'react'
import HeroSection from '../components/HeroSection'

function QA() {
  const [question, setQuestion] = useState('')
  const [category, setCategory] = useState('')
  
  // Sample FAQs
  const faqs = [
    {
      id: 1,
      question: "What's the best time to plant wheat?",
      answer: "The optimal time to plant wheat depends on your region. In most temperate climates, winter wheat is planted in fall (September to November) and harvested in summer, while spring wheat is planted in early spring and harvested in late summer.",
      category: "Crops",
      author: "John D.",
      date: "May 5, 2025"
    },
    {
      id: 2,
      question: "How can I naturally control aphids in my vegetable garden?",
      answer: "Several natural methods can control aphids: introduce beneficial insects like ladybugs, use neem oil spray, create a soap spray with mild liquid soap and water, plant aphid-repelling companions like marigolds, or use a strong water spray to physically remove them from plants.",
      category: "Pest Control",
      author: "Sarah W.",
      date: "April 28, 2025"
    },
    {
      id: 3,
      question: "What are the signs of nitrogen deficiency in plants?",
      answer: "Signs of nitrogen deficiency include yellowing of older leaves (chlorosis) starting from the tip and moving along the center, stunted growth, smaller leaves, and reduced yields. The entire plant may appear pale green to yellowish compared to healthy plants.",
      category: "Soil Management",
      author: "Michael K.",
      date: "April 22, 2025"
    }
  ]
  
  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle question submission logic here
    console.log({ question, category })
    // Reset form
    setQuestion('')
    setCategory('')
  }
  
  // FAQ categories
  const categories = [
    "Crops", 
    "Livestock", 
    "Soil Management", 
    "Pest Control", 
    "Irrigation", 
    "Farm Equipment", 
    "Organic Farming"
  ]
  
  return (
    <>
      {/* Hero Section */}
      <HeroSection 
        title="Community Q&A"
        subtitle="Connect with fellow farmers and get answers to your farming questions"
        backgroundClass="bg-[#DAFCE7]"
      />
      
      {/* Ask Question Section */}
      <section className="py-12 bg-white">
        <div className="container-custom max-w-4xl">
          <div className="bg-[#DAFCE7] rounded-lg p-6 md:p-8">
            <h2 className="text-2xl font-semibold mb-6">Ask a Question</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
  id="category"
  value={category}
  onChange={(e) => setCategory(e.target.value)}
  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-700"
  required
>
  <option value="">Select a category</option>
  {categories.map((cat) => (
    <option key={cat} value={cat}>{cat}</option>
  ))}
</select>
              </div>
              <div className="mb-4">
                <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Question
                </label>
                <textarea
                  id="question"
                  rows="4"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Type your farming question here..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="btn-primary rounded-3xl"
              >
                Submit Question
              </button>
            </form>
          </div>
        </div>
      </section>
      
      {/* FAQs Section */}
      <section className="py-12 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          
          <div className="grid gap-6 max-w-4xl mx-auto">
            {faqs.map((faq) => (
              <div key={faq.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold">{faq.question}</h3>
                   <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
  {faq.category}
</span>
                  </div>
                  <p className="text-gray-700 mb-4">{faq.answer}</p>
                  <div className="text-sm text-gray-500">
                    Answered by {faq.author} on {faq.date}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <button className="btn-secondary rounded-3xl hover:bg-green-600 hover:text-white">
              View More Questions
            </button>
          </div>
        </div>
      </section>
      
      {/* Community Stats Section */}
      <section className="py-12 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">1,250+</div>
              <p className="text-lg text-gray-600">Questions Answered</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">780</div>
              <p className="text-lg text-gray-600">Active Members</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">24h</div>
              <p className="text-lg text-gray-600">Average Response Time</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default QA