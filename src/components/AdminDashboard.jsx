import React, { useState, useEffect } from 'react'
import { ref, push, onValue, update, remove, get } from 'firebase/database'
import { auth, db } from '../firebase'
import { signOut } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import ProductForm from './ProductForm'
import { uploadToCloudinary } from '../utils/uploadToCloudinary'

const formatPrice = (price) => {
  return '$ ' + Number(price).toLocaleString('es-CO');
}

function AdminDashboard({ onLogout }) {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [heroImageFile, setHeroImageFile] = useState(null)
  const [heroImagePreview, setHeroImagePreview] = useState(null)
  const [currentHeroImage, setCurrentHeroImage] = useState(null)
  const [heroLoading, setHeroLoading] = useState(false)

  useEffect(() => {
    const productsRef = ref(db, 'productos')
    const unsubscribeProducts = onValue(productsRef, (snapshot) => {
      const data = snapshot.val()
      const productsList = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : []
      setProducts(productsList)
    })

    const heroRef = ref(db, 'config/heroImage')
    const unsubscribeHero = onValue(heroRef, (snapshot) => {
      setCurrentHeroImage(snapshot.val())
    })

    return () => {
      unsubscribeProducts()
      unsubscribeHero()
    }
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

  const handleHeroImageChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0]
      setHeroImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setHeroImagePreview(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const handleSaveHeroImage = async () => {
    if (!heroImageFile) return
    setHeroLoading(true)
    try {
      const url = await uploadToCloudinary(heroImageFile)
      await update(ref(db, 'config'), { heroImage: url })
      setMessage({ type: 'success', text: '¡Imagen principal actualizada exitosamente!' })
      setHeroImageFile(null)
      setHeroImagePreview(null)
    } catch (error) {
      console.error('Error saving hero image:', error)
      setMessage({ type: 'error', text: 'Error al guardar la imagen principal, intenta de nuevo' })
    } finally {
      setHeroLoading(false)
    }
  }

  const ceramicas = products.filter(p => p.categoria === 'ceramica')
  const cuadros = products.filter(p => p.categoria === 'cuadro')

  const ProductListSection = ({ title, productList }) => (
    <div className="mb-8">
      <h3 className="text-xl font-bold mb-4" style={{ color: '#C9A84C' }}>{title}</h3>
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden md:block">
          <table className="w-full">
            <thead style={{ backgroundColor: '#C9A84C', color: '#1A1A1A' }}>
              <tr>
                <th className="px-4 py-3 text-left font-bold">Producto</th>
                <th className="px-4 py-3 text-left font-bold">Precio</th>
                <th className="px-4 py-3 text-left font-bold">Estado</th>
                <th className="px-4 py-3 text-left font-bold">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-white">
              {productList.map(product => (
                <tr key={product.id} className="border-b border-gray-700">
                  <td className="px-4 py-3">{product.nombre}</td>
                  <td className="px-4 py-3">{formatPrice(product.precio)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${product.disponible ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                      {product.disponible ? 'Disponible' : 'Agotado'}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="px-3 py-1 rounded text-sm transition duration-300"
                      style={{ backgroundColor: '#C9A84C', color: '#1A1A1A', minHeight: '44px' }}
                      onMouseEnter={(e) => { e.target.style.backgroundColor = '#B8943C' }}
                      onMouseLeave={(e) => { e.target.style.backgroundColor = '#C9A84C' }}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition duration-300"
                      style={{ minHeight: '44px' }}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Mobile Cards */}
        <div className="md:hidden">
          {productList.map(product => (
            <div key={product.id} className="p-4 border-b border-gray-700">
              <h4 className="text-lg font-bold text-white mb-2">{product.nombre}</h4>
              <p className="text-white mb-1">Precio: {formatPrice(product.precio)}</p>
              <p className="mb-3">
                <span className={`px-2 py-1 rounded text-xs font-bold ${product.disponible ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                  {product.disponible ? 'Disponible' : 'Agotado'}
                </span>
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditProduct(product)}
                  className="flex-1 px-3 py-2 rounded text-sm transition duration-300"
                  style={{ backgroundColor: '#C9A84C', color: '#1A1A1A', minHeight: '44px' }}
                  onMouseEnter={(e) => { e.target.style.backgroundColor = '#B8943C' }}
                  onMouseLeave={(e) => { e.target.style.backgroundColor = '#C9A84C' }}
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  className="flex-1 bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700 transition duration-300"
                  style={{ minHeight: '44px' }}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 shadow-md py-4">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <h2 className="text-2xl font-bold" style={{ color: '#C9A84C' }}>Panel de Administración</h2>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/')}
              className="text-xs sm:text-sm font-sans font-medium px-3 py-2 border border-[#C9A84C] text-[#C9A84C] rounded-full hover:bg-[#C9A84C] hover:text-dark transition-all"
              style={{ minHeight: '44px' }}
            >
              ← Ver Landing
            </button>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 rounded-lg transition duration-300"
              style={{ backgroundColor: '#C9A84C', color: '#1A1A1A', minHeight: '44px' }}
              onMouseEnter={(e) => { e.target.style.backgroundColor = '#B8943C' }}
              onMouseLeave={(e) => { e.target.style.backgroundColor = '#C9A84C' }}
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {message && (
          <div className={`mb-4 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
            {message.text}
          </div>
        )}

        {/* Hero Image Section */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h3 className="text-xl font-bold mb-4" style={{ color: '#C9A84C' }}>Imagen Principal</h3>
          {currentHeroImage && (
            <div className="mb-4">
              <p className="text-white mb-2">Imagen actual:</p>
              <img src={currentHeroImage} alt="Hero" className="w-full max-h-48 object-contain rounded" />
            </div>
          )}
          <div className="mb-4">
            <label className="block text-white mb-2">Subir nueva imagen principal:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleHeroImageChange}
              className="w-full text-white"
            />
            {heroImagePreview && (
              <div className="mt-2">
                <p className="text-white mb-2">Previsualización:</p>
                <img src={heroImagePreview} alt="Preview" className="w-full max-h-48 object-contain rounded" />
              </div>
            )}
          </div>
          <button
            onClick={handleSaveHeroImage}
            disabled={!heroImageFile || heroLoading}
            className="w-full sm:w-auto px-6 py-3 rounded-lg font-bold transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#C9A84C', color: '#1A1A1A', minHeight: '44px' }}
            onMouseEnter={(e) => { if (!heroLoading) e.target.style.backgroundColor = '#B8943C' }}
            onMouseLeave={(e) => { if (!heroLoading) e.target.style.backgroundColor = '#C9A84C' }}
          >
            {heroLoading ? 'Guardando...' : 'Guardar Imagen Principal'}
          </button>
        </div>

        <button
          onClick={handleAddProduct}
          className="w-full sm:w-auto px-6 py-3 rounded-lg font-bold transition duration-300 mb-8"
          style={{ backgroundColor: '#C9A84C', color: '#1A1A1A', minHeight: '44px' }}
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

        {/* Products Sections */}
        <ProductListSection title="Cerámicas" productList={ceramicas} />
        <ProductListSection title="Cuadros en Resina" productList={cuadros} />
      </div>
    </div>
  )
}

export default AdminDashboard
