import React, { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'
import { useNavigate } from 'react-router-dom'

function AdminLogin({ onLogin }) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await signInWithEmailAndPassword(auth, email, password)
      onLogin()
    } catch (err) {
      setError('Credenciales incorrectas')
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="bg-gray-800 rounded-lg shadow-lg p-4 sm:p-8 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold" style={{ color: '#C9A84C' }}>Panel de Administración</h2>
          <button
            onClick={() => navigate('/')}
            className="text-xs sm:text-sm font-sans font-medium px-3 py-2 border border-[#C9A84C] text-[#C9A84C] rounded-full hover:bg-[#C9A84C] hover:text-dark transition-all"
            style={{ minHeight: '44px' }}
          >
            ← Ver Landing
          </button>
        </div>
        {error && <p className="text-red-400 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block mb-2 text-white">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:outline-none bg-gray-700 text-white"
              style={{ borderColor: '#C9A84C', minHeight: '44px' }}
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-white">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:outline-none bg-gray-700 text-white"
              style={{ borderColor: '#C9A84C', minHeight: '44px' }}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full font-bold py-2 px-4 rounded-lg transition duration-300"
            style={{ backgroundColor: '#C9A84C', color: '#1A1A1A', minHeight: '44px' }}
            onMouseEnter={(e) => { e.target.style.backgroundColor = '#B8943C' }}
            onMouseLeave={(e) => { e.target.style.backgroundColor = '#C9A84C' }}
          >
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  )
}

export default AdminLogin
