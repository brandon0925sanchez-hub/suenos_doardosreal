import React, { useState, useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase'
import AdminLogin from './AdminLogin'
import AdminDashboard from './AdminDashboard'

function Admin() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p style={{ color: '#C9A84C', fontSize: '1.25rem' }}>Cargando...</p>
      </div>
    )
  }

  if (!user) {
    return <AdminLogin onLogin={() => {}} />
  }

  return <AdminDashboard onLogout={() => setUser(null)} />
}

export default Admin
