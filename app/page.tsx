'use client'

import { useState, useEffect } from 'react'
import { Settings, Download, Sparkles, Eye, EyeOff, Plus, GithubIcon } from 'lucide-react'
import PreviewPanel from '@/components/PreviewPanel'
import EnhancedSceneTimeline from '@/components/EnhancedSceneTimeline'
import GitHubSync from '@/components/GitHubSync'

interface Scene {
  id: string
  text: string
  keywords: string[]
  animation: 'fade' | 'slide' | 'zoom' | 'bounce'
  duration: number
}

export default function StoryVidApp() {
  const [apiKey, setApiKey] = useState('')
  const [script, setScript] = useState('')
  const [scenes, setScenes] = useState<Scene[]>([])
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [tempApiKey, setTempApiKey] = useState('')
  const [showApiKey, setShowApiKey] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('openai-api-key')
    if (stored) {
      setApiKey(stored)
      setTempApiKey(stored)
    }
  }, [])

  useEffect(() => {
    const stored = localStorage.getItem('storyvid-scenes')
    if (stored) {
      try {
        setScenes(JSON.parse(stored))
      } catch (error) {
        console.error('Failed to load scenes:', error)
      }
    }
  }, [])

  useEffect(() => {
    if (scenes.length > 0) {
      localStorage.setItem('storyvid-scenes', JSON.stringify(scenes))
    }
  }, [scenes])

  const saveApiKey = () => {
    if (tempApiKey.startsWith('sk-')) {
      localStorage.setItem('openai-api-key', tempApiKey)
      setApiKey(tempApiKey)
      setShowSettings(false)
    }
  }

  const generate = async () => {
    if (!apiKey) {
      alert('Please configure your OpenAI API key in Settings')
      setShowSettings(true)
      return
    }

    if (!script.trim()) {
      return
    }

    setIsGenerating(true)

    try {
      const response = await fetch('/api/generate-scenes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': apiKey,
        },
        body: JSON.stringify({ script, maxScenes: 20 }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate')
      }

      setScenes(data.scenes || [])
      if (data.scenes && data.scenes.length > 0) {
        setCurrentSceneIndex(0)
      }
    } catch (error: any) {
      console.error('Generation error:', error)
      alert(`Error: ${error.message}`)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSceneEdit = (index: number, text: string) => {
    const newScenes = [...scenes]
    newScenes[index] = { ...newScenes[index], text }
    setScenes(newScenes)
  }

  const handleSceneAdd = (sceneData: Omit<Scene, 'id'>) => {
    const newScene: Scene = {
      id: Date.now().toString(),
      ...sceneData,
    }
    setScenes([...scenes, newScene])
  }

  const handleSceneReorder = (newScenes: Scene[]) => {
    setScenes(newScenes)
  }

  const handleSceneDelete = (index: number) => {
    const newScenes = scenes.filter((_, i) => i !== index)
    setScenes(newScenes)
    if (currentSceneIndex >= newScenes.length && currentSceneIndex > 0) {
      setCurrentSceneIndex(currentSceneIndex - 1)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Inter', sans-serif;
          line-height: 1.6;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 1rem;
        }

        .card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0.5rem;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
          transition: all 0.2s ease;
        }

        .card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
        }

        .main-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        @media (min-width: 1024px) {
          .main-grid {
            grid-template-columns: 1fr 1fr 300px;
          }
        }

        .btn {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 0.375rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .btn-primary {
          background: linear-gradient(135deg, #3b82f6 0%, #9333ea 100%);
          color: white;
        }

        .btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0.375rem;
          background: rgba(255, 255, 255, 0.9);
          color: #1f2937;
          font-size: 0.875rem;
          transition: all 0.2s ease;
        }

        .input:focus {
          outline: none;
          border-color: #3b82f6;
          background: rgba(255, 255, 255, 1);
          box-shadow: 0 0 0 8px rgba(59, 130, 246, 0.2);
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 50;
        }

        .modal-content {
          background: white;
          border-radius: 0.5rem;
          box-shadow: 0 20px 25px rgba(0, 0, 0, 0.15);
          max-width: 500px;
          width: 90%;
          padding: 1.5rem;
        }

        .text-center {
          text-align: center;
        }

        .text-left {
          text-align: left;
        }

        .loading-spinner {
          border: 2px solid white;
          border-top: 2px solid transparent;
          border-radius: 50%;
          width: 16px;
          height: 16px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      <div className="container">
        {/* Header */}
        <div className="card mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">StoryVid<span className="text-2xl text-transparent bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text bg-clip-text-transparent">.ai</span></h1>
              <p className="text-gray-600">Professional storyboard creator for explainer videos</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowSettings(true)}
                className="btn"
              >
                <Settings className="w-4 h-4" />
              </button>
              <GitHubSync />
            </div>
          </div>
        </div>

        {showSettings && (
          <div className="modal-overlay" onClick={() => setShowSettings(false)}>
            <div className="modal-content">
              <div className="text-center mb-4">
                <h2 className="text-xl font-semibold">⚙️ Settings</h2>
                <p className="text-gray-600">Configure your OpenAI API key</p>
              </div>

              <div className="input-group">
                <label className="block text-sm font-medium text-gray-700 mb-2">OpenAI API Key</label>
                <input
                  type="password"
                  value={tempApiKey}
                  onChange={(e) => setTempApiKey(e.target.value)}
                  placeholder="sk-proj..."
                  className="input"
                />
              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setShowSettings(false)}
                  className="btn"
                >
                  Cancel
                </button>
                <button
                  onClick={saveApiKey}
                  disabled={!tempApiKey.startsWith('sk-')}
                  className="btn btn-primary"
                >
                  Save API Key
                </button>
              </div>

              <p className="text-xs text-gray-500 mt-1">
                Your API key is stored locally in your browser only
              </p>
            </div>
          </div>
        )}

        {/* Main content */}
        <div className="main-grid">
          {/* Script Input */}
          <div className="card">
            <div className="mb-4">
              <h2 className="text-2xl font-semibold">📝 Script Input</h2>
            </div>
            <textarea
              value={script}
              onChange={(e) => setScript(e.target.value)}
              placeholder="Paste your explainer video script here...

Example:
Heart disease affects millions worldwide. Taking preventive measures like regular exercise and healthy eating can reduce your risk. Our new screening program makes it easy to monitor your heart health."
              className="input"
              style={{ minHeight: '200px', resize: 'vertical' }}
              rows={8}
            />
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">{script.split(/\s+/).filter(w => w).length} words</div>
              <button
                onClick={generate}
                disabled={!script.trim() || isGenerating}
                className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating && <span className="loading-spinner" />}
                {isGenerating ? 'Generating...' : '✨ Generate Storyboard'}
              </button>
            </div>
          </div>

          {/* Scene Timeline */}
          <div className="card">
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-2xl font-semibold">📋 Scene Timeline</h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">{scenes.length} scenes</span>
                <button
                  onClick={() => {
                    const newScene = {
                      id: Date.now().toString(),
                      text: 'New scene',
                      keywords: [],
                      animation: 'fade' as const,
                      duration: 5,
                    }
                    handleSceneAdd(newScene)
                  }}
                  className="btn btn-primary"
                >
                  <Plus className="w-4 h-4" />
                  Add Scene
                </button>
              </div>
            </div>
            <EnhancedSceneTimeline
              scenes={scenes}
              currentSceneIndex={currentSceneIndex}
              onSceneChange={setCurrentSceneIndex}
              onEdit={handleSceneEdit}
              onSceneReorder={handleSceneReorder}
              onAddScene={handleSceneAdd}
              onDelete={handleSceneDelete}
            />
          </div>

          {/* Preview Panel */}
          {scenes.length > 0 && (
            <div className="card">
              <div className="mb-4 flex justify-between items-center">
                <h2 className="text-2xl font-semibold">🎬 Preview</h2>
                <span className="text-sm text-gray-500">Scene {currentSceneIndex + 1} of {scenes.length}</span>
              </div>
              <PreviewPanel
                scenes={scenes}
                currentSceneIndex={currentSceneIndex}
                onSceneChange={setCurrentSceneIndex}
                onEdit={handleSceneEdit}
              />
            </div>
          )}
        </div>
      </div>

      {/* Empty state */}
      {scenes.length === 0 && (
        <div className="container">
          <div className="card text-center py-12">
            <div className="text-4xl mb-4">🎬</div>
            <h2 className="text-2xl font-semibold mb-4">No scenes yet</h2>
            <p className="text-gray-600 text-center max-w-md mx-auto">
              Add your script above and click "Generate Storyboard" to get started with AI-powered scene generation
            </p>
            <div className="stats-grid mt-6">
              <div className="stat-item">
                <div className="stat-value">✨</div>
                <div className="stat-label">AI-Powered</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">🎨</div>
                <div className="stat-label">Professional</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">⚡</div>
                <div className="stat-label">Fast</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}