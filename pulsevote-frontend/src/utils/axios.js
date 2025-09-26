import axios from 'axios'

// Configure axios defaults
axios.defaults.baseURL = 'https://localhost:5000'
axios.defaults.headers.common['Content-Type'] = 'application/json'

// Add response interceptor to handle 403 unauthorized
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      // Clear auth data and redirect to login
      localStorage.removeItem('pulsevote_token')
      delete axios.defaults.headers.common['Authorization']
      
      // Only redirect if we're not already on login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default axios
