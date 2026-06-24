import React, { useState, useEffect } from 'react'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { storage } from '../firebase'

function ProductForm({ product, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    size: '',
    description: '',
    category: 'ceramica',
    material: 'yeso',
    available: true,
    imageUrl: ''
  })
  const [image, setImage] = useState(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (product) {
      setFormData(product)
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
      setImage(e.target.files[0])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    let imageUrl = formData.imageUrl

    if (image) {
      setUploading(true)
      const storageRef = ref(storage, `products/${Date.now()}-${image.name}`)
      const uploadTask = uploadBytesResumable(storageRef, image)
      
      await new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          null,
          reject,
          async () => {
            imageUrl = await getDownloadURL(uploadTask.snapshot.ref)
            resolve()
          }
        )
      })
      setUploading(false)
    }

    onSave({ ...formData, imageUrl })
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
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-terracotta"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sage mb-2">Precio</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-terracotta"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sage mb-2">Medidas</label>
          <input
            type="text"
            name="size"
            value={formData.size}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-terracotta"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sage mb-2">Descripción</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-terracotta"
            rows={3}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sage mb-2">Categoría</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-terracotta"
          >
            <option value="ceramica">Cerámica</option>
            <option value="cuadro">Cuadro en Resina</option>
          </select>
        </div>
        {formData.category === 'ceramica' && (
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
              name="available"
              checked={formData.available}
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
          {formData.imageUrl && !image && (
            <img src={formData.imageUrl} alt="Producto" className="mt-2 h-32 object-cover rounded" />
          )}
        </div>
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={uploading}
            className="flex-1 bg-terracotta text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition duration-300 disabled:opacity-50"
          >
            {uploading ? 'Subiendo...' : 'Guardar'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-400 transition duration-300"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}

export default ProductForm
