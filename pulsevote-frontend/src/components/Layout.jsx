import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const Layout = ({ children }) => {
  const { isAuthenticated, user, success, error, clearMessages } = useAuth()
  const location = useLocation()

  // Auto-clear messages after 5 seconds
  React.useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        clearMessages()
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [success, error, clearMessages])



  return (
    <div className="min-h-screen bg-base-100">
      {/* Navigation */}
      <div className="navbar bg-base-200">
        <div className="flex-1">
          <Link to="/" className="btn btn-ghost text-xl">
            PulseVote
          </Link>
        </div>
        
        <div className="flex-none gap-2">
          {isAuthenticated ? (
            // Authenticated navigation
            <>
              <Link 
                to="/" 
                className={`btn btn-ghost ${location.pathname === '/' ? 'btn-active' : ''}`}
              >
                Home
              </Link>
              <Link 
                to="/dashboard" 
                className={`btn btn-ghost ${location.pathname === '/dashboard' ? 'btn-active' : ''}`}
              >
                Dashboard
              </Link>
              <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                  <div className="w-10 rounded-full bg-primary text-primary-content flex items-center justify-center">
                    <span className="text-sm font-bold">
                      U
                    </span>
                  </div>
                </div>
                <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                  <li>
                    <span className="text-sm text-base-content/70">
                      User ID: {user?.id}
                    </span>
                  </li>
                  <li>
                    <Link to="/logout" className="text-error">
                      Logout
                    </Link>
                  </li>
                </ul>
              </div>
            </>
          ) : (
            // Unauthenticated navigation
            <>
              <Link 
                to="/" 
                className={`btn btn-ghost ${location.pathname === '/' ? 'btn-active' : ''}`}
              >
                Home
              </Link>
              <Link 
                to="/register" 
                className={`btn btn-ghost ${location.pathname === '/register' ? 'btn-active' : ''}`}
              >
                Register
              </Link>
              <Link 
                to="/login" 
                className={`btn btn-ghost ${location.pathname === '/login' ? 'btn-active' : ''}`}
              >
                Login
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Global Messages */}
      {success && (
        <div className="alert alert-success mx-4 mt-4">
          <span>{success}</span>
          <button 
            className="btn btn-sm btn-circle btn-ghost"
            onClick={clearMessages}
          >
            ✕
          </button>
        </div>
      )}
      
      {error && (
        <div className="alert alert-error mx-4 mt-4">
          <span>{error}</span>
          <button 
            className="btn btn-sm btn-circle btn-ghost"
            onClick={clearMessages}
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Content */}
      <main>
        {children}
      </main>
    </div>
  )
}

export default Layout


