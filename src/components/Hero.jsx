import React from 'react'

function Hero() {
  return (
    <section className="bg-warm-gray py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="text-center text-white">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Piezas hechas a mano con amor</h2>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">Descubre nuestras cerámicas y cuadros en resina, personalizados para ti</p>
          <a href="#ceramicas" className="bg-terracotta hover:bg-opacity-90 text-white font-bold py-3 px-8 rounded-full transition duration-300 inline-block">
            Ver Catálogo
          </a>
        </div>
      </div>
    </section>
  )
}

export default Hero
