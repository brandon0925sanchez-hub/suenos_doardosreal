import React, { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'

function AdminLogin({ onLogin }) {
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
      <div className="bg-gray-800 rounded-lg shadow-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-6" style={{ color: '#C9A84C' }}>Panel de Administración</h2>
        {error && <p className="text-red-400 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 text-white">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:outline-none bg-gray-700 text-white"
              style={{ borderColor: '#C9A84C', focus: { borderColor: '#C9A84C' } }}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block mb-2 text-white">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:outline-none bg-gray-700 text-white"
              style={{ borderColor: '#C9A84C' }}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full font-bold py-2 px-4 rounded-lg transition duration-300"
            style={{ backgroundColor: '#C9A84C', color: '#1A1A1A' }}
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
