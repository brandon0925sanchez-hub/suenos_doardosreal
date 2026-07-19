import React, { useState, useEffect } from 'react'
import { ref, onValue } from 'firebase/database'
import { db } from '../firebase'

const formatPrice = (price) => {
  return '$ ' + Number(price).toLocaleString('es-CO');
}

function CeramicsCatalog() {
  const [products, setProducts] = useState([])
  const [filter, setFilter] = useState('todos')
  const [selectedImage, setSelectedImage] = useState(null)

  useEffect(() => {
    const productsRef = ref(db, 'productos')
    const unsubscribe = onValue(productsRef, (snapshot) => {
      const data = snapshot.val()
      const ceramics = data ? Object.keys(data)
        .map(key => ({ id: key, ...data[key] }))
        .filter(p => p.categoria === 'ceramica' && p.disponible) : []
      setProducts(ceramics)
    })
    return unsubscribe
  }, [])

  const filteredProducts = filter === 'todos' 
    ? products 
    : products.filter(p => p.material === filter)

  return (
    <>
      <section id="ceramicas" className="py-20" style={{ backgroundColor: '#C8C2BA' }}>
        <div className="container mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-center text-dark mb-12">Cerámicas</h2>
          
          <div className="flex justify-center gap-4 mb-16">
            <button 
              onClick={() => setFilter('todos')}
              className={`px-6 py-3 rounded-full transition-all duration-300 font-sans font-medium ${filter === 'todos' ? 'bg-gold text-dark' : 'bg-transparent text-dark border-2 border-gold hover:bg-gold/10'}`}
            >
              Todos
            </button>
            <button 
              onClick={() => setFilter('yeso')}
              className={`px-6 py-3 rounded-full transition-all duration-300 font-sans font-medium ${filter === 'yeso' ? 'bg-gold text-dark' : 'bg-transparent text-dark border-2 border-gold hover:bg-gold/10'}`}
            >
              Yeso
            </button>
            <button 
              onClick={() => setFilter('resina')}
              className={`px-6 py-3 rounded-full transition-all duration-300 font-sans font-medium ${filter === 'resina' ? 'bg-gold text-dark' : 'bg-transparent text-dark border-2 border-gold hover:bg-gold/10'}`}
            >
              Resina
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} onClickImage={() => setSelectedImage(product.imagenUrl)} />
            ))}
          </div>
        </div>
      </section>
      
      {selectedImage && (
        <Lightbox image={selectedImage} onClose={() => setSelectedImage(null)} />
      )}
    </>
  )
}

function ProductCard({ product, onClickImage }) {
  const phoneNumber = '573209423572';
  const message = encodeURIComponent(`Hola! Me interesa este producto: ${product.nombre} - ${formatPrice(product.precio)}`);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <div 
      className="bg-cream rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 mx-auto" 
      style={{ maxWidth: '320px', boxShadow: '0 8px 30px rgba(0,0,0,0.12)', transition: 'all 0.3s ease' }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.18)' }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.12)' }}
    >
      {product.imagenUrl && (
        <div 
          className="w-full h-64 bg-white flex items-center justify-center cursor-pointer"
          onClick={onClickImage}
        >
          <img 
            src={product.imagenUrl} 
            alt={product.nombre} 
            className="w-full h-full object-contain"
          />
        </div>
      )}
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-2xl font-serif font-semibold text-dark">{product.nombre}</h3>
          <span className={`px-3 py-1 rounded-full text-xs font-sans font-semibold ${product.disponible ? 'bg-gold/20 text-gold' : 'bg-gray-200 text-gray-600'}`}>
            {product.disponible ? 'Disponible' : 'Agotado'}
          </span>
        </div>
        <p className="text-gold text-2xl font-serif font-bold mb-2">{formatPrice(product.precio)}</p>
        <p className="text-dark/70 text-sm font-sans mb-2">Medidas: {product.medidas}</p>
        <p className="text-dark/80 font-sans leading-relaxed mb-4">{product.descripcion}</p>
        <p className="text-sm font-sans text-dark/60 mb-4">Material: {product.material === 'yeso' ? 'Yeso' : 'Resina'}</p>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center font-bold py-2 px-4 rounded-lg transition-all duration-300"
          style={{ backgroundColor: '#C9A84C', color: 'white' }}
          onMouseEnter={(e) => { e.target.style.backgroundColor = '#B8934A' }}
          onMouseLeave={(e) => { e.target.style.backgroundColor = '#C9A84C' }}
        >
          🛒 Encargar
        </a>
      </div>
    </div>
  )
}

function Lightbox({ image, onClose }) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [onClose])

  return (
    <div 
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 text-white text-3xl font-bold hover:text-gray-300"
      >
        ×
      </button>
      <img 
        src={image} 
        alt="Expanded product" 
        className="max-w-full max-h-full object-contain"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  )
}

export default CeramicsCatalog
