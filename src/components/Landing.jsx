import React from 'react'
import Header from './Header'
import Hero from './Hero'
import CeramicsCatalog from './CeramicsCatalog'
import CuadrosCatalog from './CuadrosCatalog'
import Footer from './Footer'
import WhatsAppButton from './WhatsAppButton'

function Landing() {
  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <Hero />
      <CeramicsCatalog />
      <CuadrosCatalog />
      <Footer />
      <WhatsAppButton />
    </div>
  )
}

export default Landing
