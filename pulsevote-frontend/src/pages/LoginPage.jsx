import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Login from '../components/Login'

const LoginPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  
  const from = location.state?.from?.pathname || '/dashboard'

  const handleLoginSuccess = () => {
    navigate(from, { replace: true })
  }

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <Login onSuccess={handleLoginSuccess} />
    </div>
  )
}

export default LoginPage


