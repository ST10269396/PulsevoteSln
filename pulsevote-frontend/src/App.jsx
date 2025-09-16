 
import React, { useEffect, useState } from 'react'

function App() {
  const [apiStatus, setApiStatus] = useState(null)

  useEffect(() => {
    fetch('https://localhost:5000/test')
      .then((r) => r.json())
      .then((data) => setApiStatus({ ok: true, data }))
      .catch((err) => setApiStatus({ ok: false, error: String(err) }))
  }, [])

  return (
    <div className="min-h-screen bg-base-100">
      <div className="navbar bg-base-200">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl">PulseVote</a>
        </div>
        <div className="flex-none gap-2">
          <button className="btn btn-primary">Create Poll</button>
        </div>
      </div>

      <div className="hero min-h-screen bg-base-100">
        <div className="hero-content text-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold">Welcome to PulseVote</h1>
            <p className="py-6 text-base-content/70">
              Create secure, real-time polls and share results instantly. Built with a focus on
              privacy, integrity, and great UX.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button className="btn btn-primary">New Live Poll</button>
              <button className="btn btn-outline">Browse Examples</button>
            </div>
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
          </div>
        </div>
      </div>

      {/* content placeholders removed per request */}
    </div>
  )
}

export default App
