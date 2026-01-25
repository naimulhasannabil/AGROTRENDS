import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Logo from './Logo'
import UserProfile from './UserProfile'
import { useMe } from '../services/query'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from './LanguageSwitcher'

function Navbar() {
  const { isAuthenticated } = useAuth()
  const {data: me} = useMe()
  const [isOpen, setIsOpen] = useState(false)
  const { t } = useTranslation()

  const toggleMenu = () => setIsOpen(!isOpen)

  const closeMenu = () => {
    setIsOpen(false)
  }
console.log(me);
  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="container-custom py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center" onClick={closeMenu}>
            <Logo className="h-8 w-auto" />
            <span className="ml-2 text-xl font-bold text-primary-600">AgroTrends</span>
          </Link>
          {/* Mobile menu button */}
          <button 
            className="md:hidden rounded-md p-2 text-gray-700 hover:text-primary-600 focus:outline-none" 
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
              {isOpen 
                ? <path strokeLinecap="round\" strokeLinejoin="round\" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>

          {/* Desktop navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4 lg:space-x-6">
            <NavLink to="/" className={({isActive}) => isActive ? "nav-link-active" : "nav-link"}>
              {t('home')}
            </NavLink>
            <NavLink to="/about" className={({isActive}) => isActive ? "nav-link-active" : "nav-link"}>
              {t('about')}
            </NavLink>
            <NavLink to="/blogs" className={({isActive}) => isActive ? "nav-link-active" : "nav-link"}>
              {t('blogs')}
            </NavLink>
            {/* <div className="relative">
              <button 
                className="nav-link flex items-center"
                onClick={toggleCategories}
                onBlur={() => setTimeout(() => setShowCategories(false), 100)}
              >
                Categories
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showCategories && (
                <div className="absolute z-10 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    <Link to="/blogs?category=crops" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                      Crops
                    </Link>
                    <Link to="/blogs?category=livestock" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                      Livestock
                    </Link>
                    <Link to="/blogs?category=fisheries" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                      Fisheries
                    </Link>
                    <Link to="/blogs?category=technologies" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                      Technologies
                    </Link>
                  </div>
                </div>
              )}
            </div> */}
            <NavLink to="/categories" className={({isActive}) => isActive ? "nav-link-active" : "nav-link"}>
              {t('categories')}
            </NavLink>
            <NavLink to="/products" className={({isActive}) => isActive ? "nav-link-active" : "nav-link"}>
              {t('products')}
            </NavLink>
            <NavLink to="/courses" className={({isActive}) => isActive ? "nav-link-active" : "nav-link"}>
              {t('courses')}
            </NavLink>
            <NavLink to="/qa" className={({isActive}) => isActive ? "nav-link-active" : "nav-link"}>
              {t('qa')}
            </NavLink>
            <NavLink to="/events" className={({isActive}) => isActive ? "nav-link-active" : "nav-link"}>
              {t('events')}
            </NavLink>
            <a href="/ai-assistant" target="_blank" rel="noopener noreferrer" className="nav-link">
              {t('aiAssistant')}
            </a>
            <LanguageSwitcher />
            {isAuthenticated ? (
              <div className="ml-4">
                <UserProfile />
              </div>
            ) : (
              <>
                <NavLink to="/sign-up" className="btn-primary ml-4 rounded-2xl">
                  {t('signUp')}
                </NavLink>
                <NavLink to="/sign-in" className="btn-secondary  hover:bg-green-600 hover:text-white rounded-2xl">
                  {t('signIn')}
                </NavLink>
              </>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-2 border-t border-gray-200 pt-4 space-y-2">
            <NavLink to="/" className="block nav-link py-2" onClick={closeMenu}>
              {t('home')}
            </NavLink>
            <NavLink to="/about" className="block nav-link py-2" onClick={closeMenu}>
              {t('about')}
            </NavLink>
            <NavLink to="/blogs" className="block nav-link py-2" onClick={closeMenu}>
              {t('blogs')}
            </NavLink>
            {/* <div>
              <button 
                className="flex justify-between w-full nav-link py-2"
                onClick={toggleCategories}
              >
                Categories
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showCategories ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                </svg>
              </button>
              {showCategories && (
                <div className="mt-2 pl-4 space-y-2">
                  <Link to="/blogs?category=crops" className="block nav-link py-2" onClick={closeMenu}>
                    Crops
                  </Link>
                  <Link to="/blogs?category=livestock" className="block nav-link py-2" onClick={closeMenu}>
                    Livestock
                  </Link>
                  <Link to="/blogs?category=fisheries" className="block nav-link py-2" onClick={closeMenu}>
                    Fisheries
                  </Link>
                  <Link to="/blogs?category=technologies" className="block nav-link py-2" onClick={closeMenu}>
                    Technologies
                  </Link>
                </div>
              )}
            </div> */}
            <NavLink to="/categories" className="block nav-link py-2" onClick={closeMenu}>
              {t('categories')}
            </NavLink>
            <NavLink to="/products" className="block nav-link py-2" onClick={closeMenu}>
              {t('products')}
            </NavLink>
            <NavLink to="/courses" className="block nav-link py-2" onClick={closeMenu}>
              {t('courses')}
            </NavLink>
            <NavLink to="/qa" className="block nav-link py-2" onClick={closeMenu}>
              {t('qa')}
            </NavLink>
            <NavLink to="/events" className="block nav-link py-2" onClick={closeMenu}>
              {t('events')}
            </NavLink>
            <a href="/ai-assistant" target="_blank" rel="noopener noreferrer" className="block nav-link py-2">
              {t('aiAssistant')}
            </a>
            <div className="pt-4 border-t border-gray-200 mt-2">
              <LanguageSwitcher />
            </div>
            {isAuthenticated ? (
              <div className="pt-2">
                <UserProfile />
              </div>
            ) : (
              <div className="flex flex-col space-y-2 pt-2">
                <NavLink to="/sign-up" className="btn-primary text-center py-2 rounded-2xl" onClick={closeMenu}>
                  {t('signUp')}
                </NavLink>
                <NavLink to="/sign-in" className="btn-secondary text-center py-2 rounded-2xl  hover:bg-green-600 hover:text-white" onClick={closeMenu}>
                  {t('signIn')}
                </NavLink>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar