'use client'

import { useState, useEffect } from 'react'
import { Sparkles, AlertTriangle } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import useProjectStore from '@/store/useProjectStore'

export default function ScriptInput() {
  const { currentProject, isGenerating, updateScript, generateScenes } = useProjectStore()
  const [script, setScript] = useState('')
  const [wordCount, setWordCount] = useState(0)

  useEffect(() => {
    if (currentProject) {
      setScript(currentProject.script)
    }
  }, [currentProject])

  useEffect(() => {
    const words = script.trim().split(/\s+/).filter(w => w.length > 0)
    setWordCount(words.length)
  }, [script])

  const handleScriptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newScript = e.target.value
    setScript(newScript)
    updateScript(newScript)
  }

  const handleGenerate = async () => {
    if (script.trim().length < 10) return
    await generateScenes(script)
  }

  const isScriptEmpty = script.trim().length < 10
  const isScriptLong = wordCount > 500

  return (
    <div className="flex flex-col gap-4 h-full">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Script</h2>
        <p className="text-sm text-muted-foreground">
          Paste your explainer video script below
        </p>
      </div>

      <Textarea
        value={script}
        onChange={handleScriptChange}
        placeholder={`Paste your explainer video script here...

Example:
Heart disease affects millions worldwide. Taking preventive measures like regular exercise and healthy eating can reduce your risk. Our new screening program makes it easy to monitor your heart health.`}
        className="flex-1 min-h-[400px] resize-none"
        disabled={isGenerating}
      />

      <div className="flex items-center justify-between">
        <span className={`text-sm ${isScriptLong ? 'text-amber-foreground font-medium' : 'text-muted-foreground'}`}>
          {wordCount} words
          {script.length > 0 && ` • ${script.length} characters`}
        </span>
      </div>

      {isScriptLong && (
        <div className="flex items-start gap-2 p-3 rounded-md bg-amber/20 border border-amber">
          <AlertTriangle className="h-5 w-5 text-amber-foreground shrink-0 mt-0.5" />
          <p className="text-sm text-amber-foreground">
            Script is long ({wordCount} words). Consider splitting into multiple videos for best results.
          </p>
        </div>
      )}

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <Button
                onClick={handleGenerate}
                disabled={isScriptEmpty || isGenerating}
                className="w-full"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 mr-2" />
                    Generate Storyboard
                  </>
                )}
              </Button>
            </div>
          </TooltipTrigger>
          {isScriptEmpty && (
            <TooltipContent>
              <p>Enter script first</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
