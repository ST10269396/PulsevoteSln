import React from 'react'
import { useNavigate } from 'react-router-dom'
import Register from '../components/Register'

const RegisterPage = () => {
  const navigate = useNavigate()

  const handleRegisterSuccess = () => {
    navigate('/dashboard', { replace: true })
  }

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <Register onSuccess={handleRegisterSuccess} />
    </div>
  )
}

export default RegisterPage


