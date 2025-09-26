import React, { createContext, useState, useEffect } from 'react'
import axios from '../utils/axios'
import { showToast } from '../utils/toast'

const AuthContext = createContext()

export { AuthContext }

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('pulsevote_token')
    if (storedToken) {
      setToken(storedToken)
      // Set default authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`
      
      // Verify token is still valid by making a test request
      axios.get('/api/protected')
        .then(response => {

          setUser({ id: response.data.user.id })
        })
        .catch(() => {
          // Token is invalid, clear it
          localStorage.removeItem('pulsevote_token')
          setToken(null)
          setUser(null)
          delete axios.defaults.headers.common['Authorization']
          showToast.error('Session expired. Please log in again.', 4000)
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [])


  // function to login a user using the backend api route /api/auth/login
  const login = async (email, password) => {
    try {
      setError(null)
      setLoading(true)
      
      // Show loading toast
      const loadingToastId = showToast.loading('Signing you in...')
      
      const response = await axios.post('/api/auth/login', {
        email,
        password
      })
      
      const { token: newToken } = response.data
      
      // Store token and set user state
      localStorage.setItem('pulsevote_token', newToken)
      setToken(newToken)
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
      
      // Get user info
      const userResponse = await axios.get('/api/protected')
      setUser({ id: userResponse.data.user.id })
      
      // Dismiss loading toast and show success
      showToast.dismiss(loadingToastId)
      showToast.success('Welcome back! You\'re now signed in.', 4000)
      setSuccess('Login successful!')
      return { success: true }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed. Please check your credentials.'
      
      // Dismiss any loading toasts
      showToast.dismissAll()
      
      // Show specific error messages
      if (err.response?.status === 400) {
        showToast.error('Invalid email or password. Please try again.', 6000)
      } else if (err.response?.status === 500) {
        showToast.error('Server error. Please try again later.', 6000)
      } else if (!err.response) {
        showToast.error('Unable to connect to server. Please check your connection.', 6000)
      } else {
        showToast.error(errorMessage, 6000)
      }
      
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }
 // function to register a new user using the backend api route /api/auth/register
  const register = async (email, password) => {
    try {
      setError(null)
      setLoading(true)
      
      // Show loading toast
      const loadingToastId = showToast.loading('Creating your account...')
      
      const response = await axios.post('/api/auth/register', {
        email,
        password
      })
      
      const { token: newToken } = response.data
      
      // Store token and set user state
      localStorage.setItem('pulsevote_token', newToken)
      setToken(newToken)
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
      
      // Get user info
      const userResponse = await axios.get('/api/protected')
      setUser({ id: userResponse.data.user.id })
      
      // Dismiss loading toast and show success
      showToast.dismiss(loadingToastId)
      showToast.success('Account created successfully! Welcome to PulseVote!', 5000)
      setSuccess('Registration successful!')
      return { success: true }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.'
      
      // Dismiss any loading toasts
      showToast.dismissAll()
      
      // Show specific error messages
      if (err.response?.status === 400) {
        if (errorMessage.includes('already exists')) {
          showToast.error('This email is already registered. Please try logging in instead.', 6000)
        } else {
          showToast.error('Please check your information and try again.', 6000)
        }
      } else if (err.response?.status === 500) {
        showToast.error('Server error. Please try again later.', 6000)
      } else if (!err.response) {
        showToast.error('Unable to connect to server. Please check your connection.', 6000)
      } else {
        showToast.error(errorMessage, 6000)
      }
      
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    // Prevent duplicate logout calls
    if (isLoggingOut || !token) {
      return
    }
    
    setIsLoggingOut(true)
    
    localStorage.removeItem('pulsevote_token')
    setToken(null)
    setUser(null)
    delete axios.defaults.headers.common['Authorization']
    
    showToast.success('You\'ve been signed out successfully. See you next time!', 4000)
    
    // Reset the logging out state after a short delay
    setTimeout(() => {
      setIsLoggingOut(false)
    }, 1000)
  }

  const clearMessages = () => {
    setError(null)
    setSuccess(null)
  }

  const value = {
    user,
    token,
    loading,
    error,
    success,
    login,
    register,
    logout,
    clearMessages,
    isAuthenticated: !!token
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
