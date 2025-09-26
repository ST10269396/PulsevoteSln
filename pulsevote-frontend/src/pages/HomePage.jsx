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
              <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
            </div>
            
            {/* Violation 2: External image not in imgSrc */}
            <div className="mb-2">
              <p className="text-sm">2. External image from unauthorized source:</p>
              <img src="https://httpbin.org/image/png" alt="Should be blocked" className="w-20 h-20" />
            </div>
            
            {/* Violation 3: External font not in fontSrc */}
            <div className="mb-2">
              <p className="text-sm">3. External font from unauthorized source:</p>
              <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&display=swap" rel="stylesheet" />
            </div>
            
            {/* Violation 4: External connection not in connectSrc */}
            <div className="mb-2">
              <p className="text-sm">4. External API call to unauthorized source:</p>
              <button 
                className="btn btn-sm btn-error" 
                onClick={() => fetch('https://api.github.com/users/octocat')}
              >
                Test External API Call
              </button>
            </div>
            
            {/* Violation 5: Inline script (should be blocked if CSP doesn't allow unsafe-inline) */}
            <div className="mb-2">
              <p className="text-sm">5. Inline script execution:</p>
              <button 
                className="btn btn-sm btn-error" 
                onClick={() => {
                  // This inline script should be blocked by CSP
                  eval('alert("This should be blocked by CSP!")');
                }}
              >
                Test Inline Script
              </button>
            </div>
            
            
            
            {/*  CSP Test */}
            <div className="mt-4 p-2 bg-info/20 rounded">
              <p className="text-xs font-bold"> CSP Test:</p>
              <p className="text-xs">If the image above shows as broken (not loading), CSP is working! (Also see console for CSP violations)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage


