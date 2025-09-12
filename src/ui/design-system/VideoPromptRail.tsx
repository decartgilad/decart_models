'use client'

import { useState } from 'react'
import { VideoUploadTile } from './VideoUploadTile'

interface VideoPromptRailProps {
  onSubmit?: (prompt: string, uploadResult: any) => void
  loading?: boolean
  disabled?: boolean
}

export function VideoPromptRail({ onSubmit, loading = false, disabled = false }: VideoPromptRailProps) {
  const [prompt, setPrompt] = useState('')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [uploadState, setUploadState] = useState<'empty' | 'dragOver' | 'uploading' | 'success' | 'error'>('empty')
  const [videoUrl, setVideoUrl] = useState<string>('')
  const [uploadResult, setUploadResult] = useState<any>(null)
  const [showFileError, setShowFileError] = useState(false)
  const [showPromptError, setShowPromptError] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>('')

  const handleFileSelect = (file: File) => {
    setShowFileError(false)
    setErrorMessage('')
    setUploadState('uploading')
    setUploadedFile(file)
  }

  const handleUploadComplete = (uploadResult: any, file: File) => {
    const url = URL.createObjectURL(file)
    setVideoUrl(url)
    setUploadState('success')
    setUploadResult(uploadResult)
  }

  const handleUploadError = (error: string) => {
    setUploadState('error')
    setErrorMessage(error)
    setShowFileError(true)
  }

  const handleSubmit = () => {
    let hasErrors = false

    if (!uploadedFile || !uploadResult) {
      setShowFileError(true)
      hasErrors = true
    } else {
      setShowFileError(false)
    }

    if (!prompt.trim()) {
      setShowPromptError(true)
      hasErrors = true
    } else {
      setShowPromptError(false)
    }

    if (!hasErrors && onSubmit && !loading) {
      onSubmit(prompt.trim(), uploadResult)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const canSubmit = !loading && !disabled

  return (
    <div className="w-full">
      <div className="border border-fg p-lg mt-xl w-full rounded-sm">
        <div className="grid grid-cols-[105px_1fr_154px] gap-lg items-start">
          {/* Video Upload tile */}
          <VideoUploadTile
            onFileSelect={handleFileSelect}
            onUploadComplete={handleUploadComplete}
            onUploadError={handleUploadError}
            state={uploadState}
            videoUrl={uploadState === 'success' ? videoUrl : undefined}
            errorMessage={uploadState === 'error' ? errorMessage : undefined}
          />

          {/* Prompt input */}
          <textarea
            className="h-[93px] w-full bg-transparent outline-none text-lg leading-snug placeholder:text-subfg border-none font-sans pt-0 resize-none"
            placeholder="Type your request"
            value={prompt}
            onChange={(e) => {
              setPrompt(e.target.value)
              if (showPromptError) setShowPromptError(false)
            }}
            onKeyDown={handleKeyDown}
            disabled={loading || disabled}
          />

          {/* Generate button */}
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="h-[39px] w-[154px] bg-fg text-inverse font-mono text-sm leading-loose hover:bg-fg/90 transition-colors flex items-center justify-center gap-2"
          >
            {loading ? 'Generating...' : 'Generate'}
            {loading ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
        </div>
      </div>
      
      {/* Error message positioned below container - always present but hidden/visible */}
      <div 
        className="mt-sm py-md font-mono text-sm leading-loose" 
        style={{
          color: '#F58B8B',
          visibility: (showFileError || showPromptError) ? 'visible' : 'hidden'
        }}
      >
        {showFileError && !showPromptError && (uploadState === 'error' ? errorMessage : 'Error: no video been uploaded')}
        {!showFileError && showPromptError && 'Error: no prompt entered'}
        {showFileError && showPromptError && (uploadState === 'error' ? `${errorMessage} and no prompt entered` : 'Error: no video been uploaded and no prompt entered')}
      </div>
    </div>
  )
}
