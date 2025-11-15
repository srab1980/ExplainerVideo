'use client'

import { useState, useEffect } from 'react'
import { Github, Check, AlertCircle, Settings } from 'lucide-react'
import { syncToGitHub, getGitHubConfig, setupGitHubConfig } from '@/lib/github-sync'

export default function GitHubSync() {
  const [isOpen, setIsOpen] = useState(false)
  const [repo, setRepo] = useState('')
  const [token, setToken] = useState('')
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncStatus, setSyncStatus] = useState<'idle' | 'success' | 'error'>('idle')

  useEffect(() => {
    const config = getGitHubConfig()
    if (config.token) setToken(config.token)
    if (config.repo) setRepo(config.repo)
  }, [])

  const handleSync = async () => {
    const projectData = {
      id: `storyvid-${Date.now()}`,
      title: 'StoryVid Project',
      scenes: JSON.parse(localStorage.getItem('storyvid-scenes') || '[]'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setIsSyncing(true)
    setSyncStatus('idle')

    try {
      const success = await syncToGitHub(projectData)
      if (success) {
        setSyncStatus('success')
        setTimeout(() => setSyncStatus('idle'), 3000)
      } else {
        setSyncStatus('error')
        setTimeout(() => setSyncStatus('idle'), 3000)
      }
    } catch (error) {
      console.error('GitHub sync error:', error)
      setSyncStatus('error')
      setTimeout(() => setSyncStatus('idle'), 3000)
    } finally {
      setIsSyncing(false)
    }
  }

  const handleSaveConfig = () => {
    if (token && repo) {
      setupGitHubConfig(repo, token)
      setIsOpen(false)
    }
  }

  const getStatusIcon = () => {
    switch (syncStatus) {
      case 'success':
        return <Check className="w-4 h-4 text-green-600" />
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-600" />
      default:
        return null
    }
  }

  const getStatusText = () => {
    switch (syncStatus) {
      case 'success':
        return 'Synced!'
      case 'error':
        return 'Sync Failed'
      default:
        return 'Ready'
    }
  }

  const getStatusColor = () => {
    switch (syncStatus) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200'
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm hover:shadow-md transition-all"
        title="Sync to GitHub"
      >
        <GitHub className="w-4 h-4 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">Sync</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <GithubIcon className="w-5 h-5" />
                GitHub Sync
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {/* Status */}
            {syncStatus !== 'idle' && (
              <div className={`mb-4 p-3 rounded-lg border ${getStatusColor()}`}>
                <div className="flex items-center gap-2">
                  {getStatusIcon()}
                  <span className="font-medium">{getStatusText()}</span>
                </div>
              </div>
            )}

            {/* Configuration Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  GitHub Repository (format: username/repo)
                </label>
                <input
                  type="text"
                  value={repo}
                  onChange={(e) => setRepo(e.target.value)}
                  placeholder="username/storyvid-projects"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Personal Access Token
                </label>
                <input
                  type="password"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="ghp_..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Generate a Personal Access Token with "repo" permissions at{' '}
                  <a
                    href="https://github.com/settings/tokens"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-500 underline"
                  >
                    github.com/settings/tokens
                  </a>
                </p>
              </div>
            </div>

            {/* Instructions */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">How to Use GitHub Sync</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
                <li>Generate a Personal Access Token with "repo" permissions</li>
                <li>Enter your repository name (format: username/repo)</li>
                <li>Click "Save Configuration"</li>
                <li>Use the "Sync to GitHub" button to backup your project</li>
                <li>Your storyboards will be stored as JSON files in the repository</li>
              </ol>
            </div>

            {/* Actions */}
            <div className="flex justify-between gap-2 mt-6">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md border-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveConfig}
                disabled={!token || !repo || isSyncing}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                {isSyncing ? 'Saving...' : 'Save Configuration'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
