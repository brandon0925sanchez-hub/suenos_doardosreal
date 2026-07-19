import React from 'react'
import { useNavigate } from 'react-router-dom'

function Header() {
  const navigate = useNavigate()
  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

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
            <button 
              onClick={() => navigate('/admin')}
              className="text-xs font-sans font-medium px-3 py-1 border border-[#C9A84C] text-[#C9A84C] rounded-full hover:bg-[#C9A84C] hover:text-dark transition-all"
            >
              Admin
            </button>
          </div>
        </div>
      </header>
    </>
  )
}

export default Header
