import React, { useState, useEffect } from 'react'
import { ref, onValue } from 'firebase/database'
import { db } from '../firebase'

function Hero() {
  const [heroImage, setHeroImage] = useState(null)
  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  useEffect(() => {
    const heroRef = ref(db, 'config/heroImage')
    const unsubscribe = onValue(heroRef, (snapshot) => {
      setHeroImage(snapshot.val())
    })
    return unsubscribe
  }, [])

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center bg-cream overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: heroImage ? `url(${heroImage})` : 'url("/hero.jpg.jpeg")',
          filter: 'brightness(0.7)'
        }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-dark/30" />
      
      <div className="relative z-10 text-center px-6 max-w-4xl">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white mb-6 leading-tight">
          Sueños Dorados
        </h1>
        <p className="text-xl md:text-2xl font-sans text-white/90 mb-10 max-w-2xl mx-auto">
          Cerámicas y cuadros en resina hechos a mano
        </p>
        <button 
          onClick={() => scrollToSection('ceramicas')}
          className="bg-gold text-dark font-sans font-semibold py-4 px-10 rounded-full hover:bg-gold/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          Ver Colección
        </button>
      </div>
    </section>
  )
}

export default Hero
