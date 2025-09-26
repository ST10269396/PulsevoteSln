import React, { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'

const HomePage = () => {
  const { isAuthenticated } = useAuth()
  const [apiStatus, setApiStatus] = useState(null)

  useEffect(() => {
    fetch('https://localhost:5000/test')
      .then((r) => r.json())
      .then((data) => setApiStatus({ ok: true, data }))
      .catch((err) => setApiStatus({ ok: false, error: String(err) }))
  }, [])

  return (
    <div className="hero min-h-screen bg-base-100">
      <div className="hero-content text-center">
        <div className="max-w-2xl">
          <h1 className="text-5xl font-bold">Welcome to PulseVote</h1>
          <p className="py-6 text-base-content/70">
            Create secure, real-time polls and share results instantly. 
          </p>
          
          {!isAuthenticated ? (
            <div className="flex items-center justify-center gap-3">
              <button className="btn btn-primary">New Live Poll</button>
              
            </div>
          ) : (
            <div className="flex items-center justify-center gap-3">
              <button className="btn btn-primary">Create New Poll</button>
              <button className="btn btn-outline">View My Polls</button>
            </div>
          )}
          
          {apiStatus && (
            <div className="mt-6 flex justify-center">
              {apiStatus.ok ? (
                <div className="alert alert-success">
                  <span>Backend online — {apiStatus.data.service}</span>
                </div>
              ) : (
                <div className="alert alert-error">
                  <span>Backend unreachable — {apiStatus.error}</span>
                </div>
              )}
            </div>
          )}

          {/* CSP Violation Tests - These should be blocked by the CSP policy */}
          <div className="mt-8 p-4 bg-warning/20 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">CSP Violation Tests (Should be blocked):</h3>
            
            {/* Violation 1: External script not in scriptSrc */}
            <div className="mb-2">
              <p className="text-sm">1. External script from unauthorized source:</p>
              <script src="https://evil-site.com/malicious.js"></script>
            </div>
            
            {/* Violation 2: External image not in imgSrc */}
            <div className="mb-2">
              <p className="text-sm">2. External image from unauthorized source:</p>
              <img src="https://evil-site.com/malicious.jpg" alt="Should be blocked" className="w-20 h-20" />
            </div>
            
            {/* Violation 3: External font not in fontSrc */}
            <div className="mb-2">
              <p className="text-sm">3. External font from unauthorized source:</p>
              <link href="https://evil-site.com/malicious-font.css" rel="stylesheet" />
            </div>
            
            {/* Violation 4: External connection not in connectSrc */}
            <div className="mb-2">
              <p className="text-sm">4. External API call to unauthorized source:</p>
              <button 
                className="btn btn-sm btn-error" 
                onClick={() => fetch('https://evil-site.com/api/malicious')}
              >
                Test External API Call
              </button>
            </div>
            
            <p className="text-xs text-warning mt-2">
              Check browser console for CSP violation reports. These elements should be blocked.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage


