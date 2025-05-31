import { Link } from 'react-router-dom'

function HeroSection({ 
  title, 
  subtitle, 
  primaryButtonText, 
  primaryButtonLink, 
  secondaryButtonText, 
  secondaryButtonLink,
  backgroundClass = "bg-primary-50" 
}) {
  return (
    <section className={`py-12 sm:py-16 md:py-24 ${backgroundClass}`}>
      <div className="container-custom text-center px-4 sm:px-6">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 animate-fade-in max-w-4xl mx-auto leading-tight">
          {title}
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-6 sm:mb-8 animate-slide-up">
          {subtitle}
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 animate-slide-up">
          {primaryButtonText && primaryButtonLink && (
            <Link 
              to={primaryButtonLink} 
              className="btn-primary text-base sm:text-lg px-6 py-3 rounded-3xl"
              style={{animationDelay: '0.1s'}}
            >
              {primaryButtonText}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          )}
          {secondaryButtonText && secondaryButtonLink && (
            <Link 
              to={secondaryButtonLink} 
              className="btn-secondary text-base sm:text-lg px-6 py-3  hover:bg-green-600 hover:text-white rounded-3xl"
              style={{animationDelay: '0.2s'}}
            >
              {secondaryButtonText}
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}

export default HeroSection