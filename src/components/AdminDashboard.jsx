import React, { useState, useEffect } from 'react'
import { ref, push, onValue, update, remove } from 'firebase/database'
import { auth, db } from '../firebase'
import { signOut } from 'firebase/auth'
import ProductForm from './ProductForm'
import { uploadToCloudinary } from '../utils/uploadToCloudinary'

function AdminDashboard({ onLogout }) {
  const [products, setProducts] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    const productsRef = ref(db, 'productos')
    const unsubscribe = onValue(productsRef, (snapshot) => {
      const data = snapshot.val()
      const productsList = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : []
      setProducts(productsList)
    })
    return unsubscribe
  }, [])

  const handleAddProduct = () => {
    setEditingProduct(null)
    setShowForm(true)
    setMessage(null)
  }

  const handleEditProduct = (product) => {
    setEditingProduct(product)
    setShowForm(true)
    setMessage(null)
  }

  const handleSaveProduct = async (productData) => {
    setLoading(true)
    setMessage(null)

    try {
      let imagenUrl = editingProduct?.imagenUrl || ''

      if (productData.imageFile) {
        imagenUrl = await uploadToCloudinary(productData.imageFile)
      }

      const productToSave = {
        nombre: productData.nombre,
        precio: Number(productData.precio),
        medidas: productData.medidas,
        descripcion: productData.descripcion,
        categoria: productData.categoria,
        material: productData.categoria === 'ceramica' ? productData.material : 'resina',
        disponible: productData.disponible,
        imagenUrl: imagenUrl,
        creadoEn: editingProduct ? editingProduct.creadoEn : Date.now()
      }

      if (editingProduct) {
        const productRef = ref(db, `productos/${editingProduct.id}`)
        await update(productRef, productToSave)
        setMessage({ type: 'success', text: '¡Producto guardado exitosamente!' })
      } else {
        const productsRef = ref(db, 'productos')
        await push(productsRef, productToSave)
        setMessage({ type: 'success', text: '¡Producto guardado exitosamente!' })
      }

      setShowForm(false)
      setEditingProduct(null)
    } catch (error) {
      console.error('Error saving product:', error)
      setMessage({ type: 'error', text: 'Error al guardar el producto, intenta de nuevo' })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        const productRef = ref(db, `productos/${productId}`)
        await remove(productRef)
        setMessage({ type: 'success', text: 'Producto eliminado con éxito!' })
      } catch (error) {
        console.error('Error deleting product:', error)
        setMessage({ type: 'error', text: 'Error al guardar el producto, intenta de nuevo' })
      }
    }
  }

  const handleSignOut = async () => {
    await signOut(auth)
    onLogout()
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="bg-gray-800 shadow-md py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold" style={{ color: '#C9A84C' }}>Panel de Administración</h2>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 rounded-lg transition duration-300 text-white"
            style={{ backgroundColor: '#C9A84C', color: '#1A1A1A' }}
            onMouseEnter={(e) => { e.target.style.backgroundColor = '#B8943C' }}
            onMouseLeave={(e) => { e.target.style.backgroundColor = '#C9A84C' }}
          >
            Cerrar Sesión
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {message && (
          <div className={`mb-4 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
            {message.text}
          </div>
        )}

        <button
          onClick={handleAddProduct}
          className="px-6 py-3 rounded-lg font-bold transition duration-300 mb-8"
          style={{ backgroundColor: '#C9A84C', color: '#1A1A1A' }}
          onMouseEnter={(e) => { e.target.style.backgroundColor = '#B8943C' }}
          onMouseLeave={(e) => { e.target.style.backgroundColor = '#C9A84C' }}
        >
          Agregar Producto
        </button>

        {showForm && (
          <div className="mb-8">
            <ProductForm
              product={editingProduct}
              onSave={handleSaveProduct}
              onCancel={() => {
                setShowForm(false)
                setEditingProduct(null)
                setMessage(null)
              }}
              loading={loading}
            />
          </div>
        )}

        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <table className="w-full">
            <thead style={{ backgroundColor: '#C9A84C', color: '#1A1A1A' }}>
              <tr>
                <th className="px-4 py-3 text-left font-bold">Producto</th>
                <th className="px-4 py-3 text-left font-bold">Categoría</th>
                <th className="px-4 py-3 text-left font-bold">Precio</th>
                <th className="px-4 py-3 text-left font-bold">Estado</th>
                <th className="px-4 py-3 text-left font-bold">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-white">
              {products.map(product => (
                <tr key={product.id} className="border-b border-gray-700">
                  <td className="px-4 py-3">{product.nombre}</td>
                  <td className="px-4 py-3">{product.categoria === 'ceramica' ? 'Cerámica' : 'Cuadro'}</td>
                  <td className="px-4 py-3">${product.precio}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${product.disponible ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                      {product.disponible ? 'Disponible' : 'Agotado'}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="px-3 py-1 rounded text-sm transition duration-300"
                      style={{ backgroundColor: '#C9A84C', color: '#1A1A1A' }}
                      onMouseEnter={(e) => { e.target.style.backgroundColor = '#B8943C' }}
                      onMouseLeave={(e) => { e.target.style.backgroundColor = '#C9A84C' }}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition duration-300"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
