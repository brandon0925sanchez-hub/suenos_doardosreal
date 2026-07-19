import React, { useState, useEffect } from 'react'

const formatPriceForInput = (price) => {
  if (!price && price !== 0) return ''
  return Number(price).toLocaleString('es-CO')
}

const parsePrice = (formatted) => {
  if (!formatted) return ''
  // Remove all non-digit characters
  const digits = formatted.replace(/\D/g, '')
  return digits ? Number(digits) : ''
}

function ProductForm({ product, onSave, onCancel, loading }) {
  const [formData, setFormData] = useState({
    nombre: '',
    precio: '',
    medidas: '',
    descripcion: '',
    categoria: 'ceramica',
    material: 'yeso',
    disponible: true,
    imageFile: null
  })
  const [priceDisplay, setPriceDisplay] = useState('')
  const [imagePreview, setImagePreview] = useState(null)

  useEffect(() => {
    if (product) {
      setFormData({
        nombre: product.nombre || '',
        precio: product.precio || '',
        medidas: product.medidas || '',
        descripcion: product.descripcion || '',
        categoria: product.categoria || 'ceramica',
        material: product.material || 'yeso',
        disponible: product.disponible !== false,
        imageFile: null
      })
      setPriceDisplay(formatPriceForInput(product.precio))
      if (product.imagenUrl) {
        setImagePreview(product.imagenUrl)
      }
    }
  }, [product])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    if (name === 'precio') {
      // Handle price separately
      const parsed = parsePrice(value)
      setPriceDisplay(formatPriceForInput(parsed))
      setFormData(prev => ({ ...prev, precio: parsed }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }))
    }
  }

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0]
      const reader = new FileReader()
      
      reader.onloadend = () => {
        const base64 = reader.result
        setFormData(prev => ({ ...prev, imageFile: file }))
        setImagePreview(base64)
      }
      
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6">
      <h3 className="text-xl font-bold mb-4" style={{ color: '#C9A84C' }}>
        {product ? 'Editar Producto' : 'Agregar Producto'}
      </h3>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block mb-2 text-white">Nombre</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:outline-none bg-gray-700 text-white"
            style={{ borderColor: '#C9A84C', minHeight: '44px' }}
            required
          />
        </div>
        <div>
          <label className="block mb-2 text-white">Precio</label>
          <input
            type="text"
            name="precio"
            value={priceDisplay}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:outline-none bg-gray-700 text-white"
            style={{ borderColor: '#C9A84C', minHeight: '44px' }}
            placeholder="320.000"
            required
          />
        </div>
        <div>
          <label className="block mb-2 text-white">Medidas</label>
          <input
            type="text"
            name="medidas"
            value={formData.medidas}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:outline-none bg-gray-700 text-white"
            style={{ borderColor: '#C9A84C', minHeight: '44px' }}
            required
          />
        </div>
        <div>
          <label className="block mb-2 text-white">Descripción</label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:outline-none bg-gray-700 text-white"
            style={{ borderColor: '#C9A84C', minHeight: '44px' }}
            rows={3}
            required
          />
        </div>
        <div>
          <label className="block mb-2 text-white">Categoría</label>
          <select
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:outline-none bg-gray-700 text-white"
            style={{ borderColor: '#C9A84C', minHeight: '44px' }}
          >
            <option value="ceramica">Cerámica</option>
            <option value="cuadro">Cuadro en Resina</option>
          </select>
        </div>
        {formData.categoria === 'ceramica' && (
          <div>
            <label className="block mb-2 text-white">Material</label>
            <select
              name="material"
              value={formData.material}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:outline-none bg-gray-700 text-white"
              style={{ borderColor: '#C9A84C', minHeight: '44px' }}
            >
              <option value="yeso">Yeso</option>
              <option value="resina">Resina</option>
            </select>
          </div>
        )}
        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="disponible"
              checked={formData.disponible}
              onChange={handleChange}
              className="w-6 h-6"
              style={{ accentColor: '#C9A84C' }}
            />
            <span className="text-white">Disponible</span>
          </label>
        </div>
        <div>
          <label className="block mb-2 text-white">Imagen</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full text-white"
          />
          {imagePreview && (
            <img src={imagePreview} alt="Producto" className="mt-2 h-32 object-cover rounded" />
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 font-bold py-2 px-4 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#C9A84C', color: '#1A1A1A', minHeight: '44px' }}
            onMouseEnter={(e) => { if (!loading) e.target.style.backgroundColor = '#B8943C' }}
            onMouseLeave={(e) => { if (!loading) e.target.style.backgroundColor = '#C9A84C' }}
          >
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 bg-gray-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-500 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ minHeight: '44px' }}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}

export default ProductForm
