import React, { useState, useEffect } from 'react'

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
      if (product.imagenUrl) {
        setImagePreview(product.imagenUrl)
      }
    }
  }, [product])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value
    }))
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
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold text-sage mb-4">
        {product ? 'Editar Producto' : 'Agregar Producto'}
      </h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sage mb-2">Nombre</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-terracotta"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sage mb-2">Precio</label>
          <input
            type="number"
            name="precio"
            value={formData.precio}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-terracotta"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sage mb-2">Medidas</label>
          <input
            type="text"
            name="medidas"
            value={formData.medidas}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-terracotta"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sage mb-2">Descripción</label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-terracotta"
            rows={3}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sage mb-2">Categoría</label>
          <select
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-terracotta"
          >
            <option value="ceramica">Cerámica</option>
            <option value="cuadro">Cuadro en Resina</option>
          </select>
        </div>
        {formData.categoria === 'ceramica' && (
          <div className="mb-4">
            <label className="block text-sage mb-2">Material</label>
            <select
              name="material"
              value={formData.material}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-terracotta"
            >
              <option value="yeso">Yeso</option>
              <option value="resina">Resina</option>
            </select>
          </div>
        )}
        <div className="mb-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="disponible"
              checked={formData.disponible}
              onChange={handleChange}
              className="w-4 h-4 text-terracotta"
            />
            <span className="text-sage">Disponible</span>
          </label>
        </div>
        <div className="mb-4">
          <label className="block text-sage mb-2">Imagen</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full"
          />
          {imagePreview && (
            <img src={imagePreview} alt="Producto" className="mt-2 h-32 object-cover rounded" />
          )}
        </div>
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-terracotta text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-400 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}

export default ProductForm
