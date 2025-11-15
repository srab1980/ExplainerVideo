'use client'

import { useState, useEffect } from 'react'
import { Settings, Download, Sparkles, Eye, EyeOff, Plus } from 'lucide-react'
import PreviewPanel from '@/components/PreviewPanel'
import EnhancedSceneTimeline from '@/components/EnhancedSceneTimeline'

interface Scene {
  id: string
  text: string
  keywords: string[]
  animation: 'fade' | 'slide' | 'zoom' | 'bounce'
  duration: number
}

export default function EnhancedApp() {
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
    const storedScenes = localStorage.getItem('storyvid-scenes')
    if (storedScenes) {
      try {
        setScenes(JSON.parse(storedScenes))
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
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': apiKey,
        },
        body: JSON.stringify({ script }),
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

  const handleSceneEdit = (index: number) => {
    // Simple inline editing for now
    const newText = prompt('Edit scene text:', scenes[index].text)
    if (newText && newText !== scenes[index].text) {
      const newScenes = [...scenes]
      newScenes[index] = { ...newScenes[index], text: newText }
      setScenes(newScenes)
    }
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
    if (confirm(`Delete scene ${index + 1}?`)) {
      const newScenes = scenes.filter((_, i) => i !== index)
      setScenes(newScenes)
      if (currentSceneIndex >= newScenes.length && currentSceneIndex > 0) {
        setCurrentSceneIndex(currentSceneIndex - 1)
      }
    }
  }

  const addScene = () => {
    const newScene = {
      id: Date.now().toString(),
      text: 'New scene text',
      keywords: [],
      animation: 'fade' as const,
      duration: 5,
    }
    handleSceneAdd(newScene)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100">
      <style jsx global>{`
        @import url('./enhanced.css');
      `}</style>

      <div className="container">
        {/* Header */}
        <div className="flex" style={{marginBottom: '2rem'}}>
          <div>
            <h1 className="text-5xl font-bold text-gray-900" style={{letterSpacing: '-0.02em'}}>
              StoryVid<span className="text-2xl text-gray-500">.ai</span>
            </h1>
            <p className="text-gray-600">Professional storyboard creator with AI assistance</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSettings(true)}
              className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all"
            >
              <Settings className="w-5 h-5 text-gray-600" />
              <span className="text-gray-700">Settings</span>
              {apiKey && (
                <div className="ml-2 w-2 h-2 bg-green-500 rounded-full"></div>
              )}
            </button>

            <button
              onClick={() => {
                const newScenes = [...scenes]
                setScenes(newScenes)
              }}
              className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all"
            >
              <Download className="w-5 h-5 text-gray-600" />
              <span className="text-gray-700">Export</span>
            </button>
          </div>
        </div>

        {showSettings && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">⚙️ Settings</h2>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    OpenAI API Key
                  </label>
                  <div className="relative">
                    <input
                      type={showApiKey ? 'text' : 'password'}
                      value={tempApiKey}
                      onChange={(e) => setTempApiKey(e.target.value)}
                      placeholder="sk-proj..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block text-sm"
                    />
                    <button
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                    >
                      {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Your API key is stored locally in your browser only. Get one at{' '}
                    <a
                      href="https://platform.openai.com/api-keys"
                      target="_blank"
                      className="text-blue-600 hover:text-blue-500 underline"
                    >
                      platform.openai.com/api-keys
                    </a>
                  </p>
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <button
                    onClick={() => setShowSettings(false)}
                    className="px-4 py-2 text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveApiKey}
                    disabled={!tempApiKey.startsWith('sk-')}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Save API Key
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Script Input */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                📝 Script Input
              </h2>
              <textarea
                value={script}
                onChange={(e) => setScript(e.target.value)}
                placeholder="Paste your explainer video script here...

Example:
Heart disease affects millions worldwide. Taking preventive measures like regular exercise and healthy eating can reduce your risk. Our new screening program makes it easy to monitor your heart health."
                className="w-full min-h-[200px] p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
              <div className="mt-4 flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {script.split(/\s+/).filter(w => w).length} words
                </span>
                <button
                  onClick={generate}
                  disabled={!script.trim() || isGenerating}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isGenerating && (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  )}
                  <Sparkles className="w-5 h-5" />
                  {isGenerating ? 'Generating...' : 'Generate Storyboard'}
                </button>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="lg:col-span-2">
            <EnhancedSceneTimeline
              scenes={scenes}
              currentSceneIndex={currentSceneIndex}
              onSceneChange={setCurrentSceneIndex}
              onEdit={handleSceneEdit}
              onSceneReorder={handleSceneReorder}
              onAddScene={addScene}
              onDelete={handleSceneDelete}
            />
          </div>
        </div>

        {/* Preview Panel */}
        {scenes.length > 0 && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="xl:col-span-1">
              <PreviewPanel
                scenes={scenes}
                currentSceneIndex={currentSceneIndex}
                onSceneChange={setCurrentSceneIndex}
                onEdit={handleSceneEdit}
              />
            </div>
            <div className="xl:col-span-1">
              {/* Additional Features - Placeholder for future development */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  🚀 Quick Actions
                </h2>
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      const newScenes = scenes.map(scene => ({
                        ...scene,
                        keywords: scene.text.split(' ').slice(0, 3),
                      }))
                      setScenes(newScenes)
                    }}
                    className="w-full text-left px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    🔄 Auto-Generate Keywords from Scene Text
                  </button>

                  <button
                    onClick={() => {
                      const animations = ['fade', 'slide', 'zoom', 'bounce'] as const
                      const newScenes = scenes.map((scene, idx) => ({
                        ...scene,
                        animation: animations[idx % animations.length],
                      }))
                      setScenes(newScenes)
                    }}
                    className="w-full text-left px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    🎨 Randomize Animation Types
                  </button>

                  <button
                    onClick={() => {
                      const allScenes = [...scenes]
                      for (let i = allScenes.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1))
                        ;[allScenes[i], allScenes[j]] = [allScenes[j], allScenes[i]]
                      }
                      setScenes(allScenes)
                    }}
                    className="w-full text-left px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    🔀 Shuffle Scene Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {scenes.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              No Scenes Yet
            </h2>
            <p className="text-gray-600 mb-6">
              Add your script and click "Generate Storyboard" to get started with AI-powered scene generation.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">✨ AI Mode</h3>
                <p className="text-sm text-blue-800">
                  Enter your script and let AI create scenes with keywords and animations automatically.
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="font-semibold text-green-900 mb-2">👤 Manual Mode</h3>
                <p className="text-sm text-green-800">
                  Create scenes manually with full control over every detail.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
