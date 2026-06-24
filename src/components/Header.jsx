import React from 'react'

function Header() {
  return (
    <header className="bg-cream py-4 shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl md:text-3xl font-bold text-sage text-center">
          Sueños Dorados
        </h1>
        <p className="text-center text-terracotta text-sm mt-1">Cerámicas Personalizadas</p>
      </div>
    </header>
  )
}

export default Header
