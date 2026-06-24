import React, { useState, useEffect } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase'

function CeramicsCatalog() {
  const [products, setProducts] = useState([])
  const [filter, setFilter] = useState('todos')

  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, 'products'))
      const ceramics = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(p => p.category === 'ceramica')
      setProducts(ceramics)
    }
    fetchProducts()
  }, [])

  const filteredProducts = filter === 'todos' 
    ? products 
    : products.filter(p => p.material === filter)

  return (
    <section id="ceramicas" className="py-12 bg-cream">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-sage mb-8">Cerámicas</h2>
        
        <div className="flex justify-center gap-4 mb-8">
          <button 
            onClick={() => setFilter('todos')}
            className={`px-4 py-2 rounded-full transition duration-300 ${filter === 'todos' ? 'bg-terracotta text-white' : 'bg-sage text-white hover:bg-opacity-90'}`}
          >
            Todos
          </button>
          <button 
            onClick={() => setFilter('yeso')}
            className={`px-4 py-2 rounded-full transition duration-300 ${filter === 'yeso' ? 'bg-terracotta text-white' : 'bg-sage text-white hover:bg-opacity-90'}`}
          >
            Yeso
          </button>
          <button 
            onClick={() => setFilter('resina')}
            className={`px-4 py-2 rounded-full transition duration-300 ${filter === 'resina' ? 'bg-terracotta text-white' : 'bg-sage text-white hover:bg-opacity-90'}`}
          >
            Resina
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ProductCard({ product }) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg">
      {product.imageUrl && (
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-bold text-sage">{product.name}</h3>
          <span className={`px-2 py-1 rounded text-xs font-bold ${product.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {product.available ? 'Disponible' : 'Agotado'}
          </span>
        </div>
        <p className="text-terracotta text-2xl font-bold mt-2">${product.price}</p>
        <p className="text-gray-600 text-sm mt-1">Medidas: {product.size}</p>
        <p className="text-gray-700 mt-2">{product.description}</p>
        <p className="text-sm text-warm-gray mt-2">Material: {product.material === 'yeso' ? 'Yeso' : 'Resina'}</p>
      </div>
    </div>
  )
}

export default CeramicsCatalog
