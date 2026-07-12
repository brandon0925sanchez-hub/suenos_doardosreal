import React, { useState, useEffect } from 'react'
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { auth, db, storage } from '../firebase'
import { signOut } from 'firebase/auth'
import ProductForm from './ProductForm'

function AdminDashboard({ onLogout }) {
  const [products, setProducts] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    const querySnapshot = await getDocs(collection(db, 'productos'))
    const productsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    setProducts(productsList)
  }

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
        const storageRef = ref(storage, `productos/${Date.now()}_${productData.imageFile.name}`)
        const snapshot = await uploadBytes(storageRef, productData.imageFile)
        imagenUrl = await getDownloadURL(snapshot.ref)
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
        creadoEn: editingProduct ? undefined : serverTimestamp()
      }

      if (editingProduct) {
        const productRef = doc(db, 'productos', editingProduct.id)
        await updateDoc(productRef, productToSave)
        setMessage({ type: 'success', text: 'Producto actualizado con éxito!' })
      } else {
        await addDoc(collection(db, 'productos'), productToSave)
        setMessage({ type: 'success', text: 'Producto agregado con éxito!' })
      }

      setShowForm(false)
      setEditingProduct(null)
      fetchProducts()
    } catch (error) {
      console.error('Error saving product:', error)
      setMessage({ type: 'error', text: 'Hubo un error al guardar el producto. Por favor, intenta de nuevo.' })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        await deleteDoc(doc(db, 'productos', productId))
        setMessage({ type: 'success', text: 'Producto eliminado con éxito!' })
        fetchProducts()
      } catch (error) {
        console.error('Error deleting product:', error)
        setMessage({ type: 'error', text: 'Hubo un error al eliminar el producto. Por favor, intenta de nuevo.' })
      }
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
        {message && (
          <div className={`mb-4 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message.text}
          </div>
        )}

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
                setMessage(null)
              }}
              loading={loading}
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
                  <td className="px-4 py-3">{product.nombre}</td>
                  <td className="px-4 py-3">{product.categoria === 'ceramica' ? 'Cerámica' : 'Cuadro'}</td>
                  <td className="px-4 py-3">${product.precio}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${product.disponible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {product.disponible ? 'Disponible' : 'Agotado'}
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
