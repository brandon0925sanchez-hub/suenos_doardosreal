import React from 'react'

function About() {
  return (
    <section id="about" className="py-24 bg-white">
      <div className="container mx-auto px-6 text-center max-w-3xl">
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-dark mb-8">
          Sobre Nosotros
        </h2>
        <p className="text-lg md:text-xl font-sans text-dark/80 leading-relaxed">
          Cada pieza es única, hecha con amor y dedicación para transformar tus espacios con detalles artesanales.
        </p>
        <div className="mt-12 w-24 h-1 bg-gold mx-auto" />
      </div>
    </section>
  )
}

export default About
