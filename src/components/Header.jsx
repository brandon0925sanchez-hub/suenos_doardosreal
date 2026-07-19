import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

function Header() {
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const buttonRef = useRef(null)

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setMobileMenuOpen(false)
    }
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current && 
        !menuRef.current.contains(event.target) && 
        buttonRef.current && 
        !buttonRef.current.contains(event.target)
      ) {
        setMobileMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-dark text-cream text-center py-2 text-sm font-sans">
        <span className="text-gold">✨</span> Pintado personalizado · Envíos a todo Colombia
      </div>
      
      {/* Navbar */}
      <header className="bg-cream py-6 shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-dark">
            Sueños Dorados
          </h1>
          <div className="flex items-center gap-4">
            {/* Desktop Nav */}
            <nav className="hidden md:flex gap-8 font-sans text-dark font-medium">
              <button onClick={() => scrollToSection('ceramicas')} className="hover:text-gold transition-colors">
                Cerámicas
              </button>
              <button onClick={() => scrollToSection('cuadros')} className="hover:text-gold transition-colors">
                Cuadros
              </button>
              <button onClick={() => scrollToSection('about')} className="hover:text-gold transition-colors">
                Nosotros
              </button>
            </nav>
            {/* Admin Button (Desktop Only) */}
            <button 
              onClick={() => navigate('/admin')}
              className="hidden md:inline-block text-xs font-sans font-medium px-3 py-1 border border-[#C9A84C] text-[#C9A84C] rounded-full hover:bg-[#C9A84C] hover:text-dark transition-all"
            >
              Admin
            </button>
            {/* Hamburger Button (Mobile only) */}
            <button 
              ref={buttonRef}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-2xl text-dark"
              style={{ minHeight: '44px', minWidth: '44px' }}
            >
              ☰
            </button>
          </div>
        </div>
        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div ref={menuRef} className="md:hidden bg-cream border-t border-gray-200">
            <div className="container mx-auto px-6 py-4 flex flex-col gap-4">
              <button onClick={() => scrollToSection('ceramicas')} className="text-left text-dark font-medium hover:text-gold transition-colors py-2">
                Cerámicas
              </button>
              <button onClick={() => scrollToSection('cuadros')} className="text-left text-dark font-medium hover:text-gold transition-colors py-2">
                Cuadros
              </button>
              <button onClick={() => scrollToSection('about')} className="text-left text-dark font-medium hover:text-gold transition-colors py-2">
                Nosotros
              </button>
              <button 
                onClick={() => { navigate('/admin'); setMobileMenuOpen(false); }}
                className="text-left text-xs font-sans font-medium px-3 py-1 border border-[#C9A84C] text-[#C9A84C] rounded-full hover:bg-[#C9A84C] hover:text-dark transition-all self-start"
              >
                Admin
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  )
}

export default Header
