import React from 'react'

const DashboardPage = () => {

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-base-content/70">
            Welcome back! Manage your polls and view analytics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Stats Cards */}
          <div className="stat bg-base-200 rounded-lg">
            <div className="stat-figure text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div className="stat-title">Total Polls</div>
            <div className="stat-value">0</div>
            <div className="stat-desc">Create your first poll</div>
          </div>

          <div className="stat bg-base-200 rounded-lg">
            <div className="stat-figure text-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"></path>
              </svg>
            </div>
            <div className="stat-title">Total Votes</div>
            <div className="stat-value">0</div>
            <div className="stat-desc">Across all polls</div>
          </div>

          <div className="stat bg-base-200 rounded-lg">
            <div className="stat-figure text-accent">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h1.586a1 1 0 01.707.293l1.414 1.414a1 1 0 00.707.293h11.172a1 1 0 01.707.293l1.414 1.414a1 1 0 00.707.293H19a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
              </svg>
            </div>
            <div className="stat-title">Active Polls</div>
            <div className="stat-value">0</div>
            <div className="stat-desc">Currently running</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">Create New Poll</h3>
                <p>Start a new polling session with custom questions and options.</p>
                <div className="card-actions justify-end">
                  <button className="btn btn-primary">Create Poll</button>
                </div>
              </div>
            </div>

            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">View Analytics</h3>
                <p>See detailed insights and voting patterns from your polls.</p>
                <div className="card-actions justify-end">
                  <button className="btn btn-outline">View Analytics</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Polls */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Recent Polls</h2>
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <p className="text-center text-base-content/70 py-8">
                No polls created yet. Create your first poll to get started!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage


