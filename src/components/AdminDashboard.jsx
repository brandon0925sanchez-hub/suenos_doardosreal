import React, { useState, useEffect } from 'react'
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'
import { signOut } from 'firebase/auth'
import ProductForm from './ProductForm'

function AdminDashboard({ onLogout }) {
  const [products, setProducts] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    const querySnapshot = await getDocs(collection(db, 'products'))
    const productsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    setProducts(productsList)
  }

  const handleAddProduct = () => {
    setEditingProduct(null)
    setShowForm(true)
  }

  const handleEditProduct = (product) => {
    setEditingProduct(product)
    setShowForm(true)
  }

  const handleSaveProduct = async (productData) => {
    if (editingProduct) {
      const productRef = doc(db, 'products', editingProduct.id)
      await updateDoc(productRef, productData)
    } else {
      await addDoc(collection(db, 'products'), productData)
    }
    setShowForm(false)
    setEditingProduct(null)
    fetchProducts()
  }

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      await deleteDoc(doc(db, 'products', productId))
      fetchProducts()
    }
  }

  const handleSignOut = async () => {
    await signOut(auth)
    onLogout()
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-white shadow-md py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-sage">Panel de Administración</h2>
          <button
            onClick={handleSignOut}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <button
          onClick={handleAddProduct}
          className="bg-terracotta text-white px-6 py-3 rounded-lg font-bold hover:bg-opacity-90 transition duration-300 mb-8"
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
              }}
            />
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-sage text-white">
              <tr>
                <th className="px-4 py-3 text-left">Producto</th>
                <th className="px-4 py-3 text-left">Categoría</th>
                <th className="px-4 py-3 text-left">Precio</th>
                <th className="px-4 py-3 text-left">Estado</th>
                <th className="px-4 py-3 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id} className="border-b">
                  <td className="px-4 py-3">{product.name}</td>
                  <td className="px-4 py-3">{product.category === 'ceramica' ? 'Cerámica' : 'Cuadro'}</td>
                  <td className="px-4 py-3">${product.price}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${product.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {product.available ? 'Disponible' : 'Agotado'}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition duration-300"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition duration-300"
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
