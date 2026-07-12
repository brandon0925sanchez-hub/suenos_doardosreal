import React, { useState, useEffect } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase'

function CuadrosCatalog() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, 'productos'))
      const cuadros = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(p => p.categoria === 'cuadro' && p.disponible)
      setProducts(cuadros)
    }
    fetchProducts()
  }, [])

  return (
    <section id="cuadros" className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-sage mb-8">Cuadros en Resina</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ProductCard({ product }) {
  return (
    <div className="bg-cream rounded-lg overflow-hidden shadow-lg">
      {product.imagenUrl && (
        <img 
          src={product.imagenUrl} 
          alt={product.nombre} 
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-bold text-sage">{product.nombre}</h3>
          <span className={`px-2 py-1 rounded text-xs font-bold ${product.disponible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {product.disponible ? 'Disponible' : 'Agotado'}
          </span>
        </div>
        <p className="text-terracotta text-2xl font-bold mt-2">${product.precio}</p>
        <p className="text-gray-600 text-sm mt-1">Medidas: {product.medidas}</p>
        <p className="text-gray-700 mt-2">{product.descripcion}</p>
      </div>
    </div>
  )
}

export default CuadrosCatalog
