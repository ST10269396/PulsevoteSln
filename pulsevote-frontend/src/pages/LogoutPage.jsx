import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const LogoutPage = () => {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const hasLoggedOut = useRef(false)

  useEffect(() => {
    // Only logout once
    if (!hasLoggedOut.current) {
      hasLoggedOut.current = true
      logout()
      
      // Redirect to home immediately after logout
      navigate('/', { replace: true })
    }
  }, [logout, navigate])

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center">
      <div className="text-center">
        <div className="loading loading-spinner loading-lg mb-4"></div>
        <h2 className="text-2xl font-bold mb-2">Logging out...</h2>
        <p className="text-base-content/70">You will be redirected to the home page.</p>
      </div>
    </div>
  )
}

export default LogoutPage


