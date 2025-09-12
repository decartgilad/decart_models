'use client'

import { useState, useEffect } from 'react'
import { StatusBanner } from './StatusBanner'
import { Button, Spinner } from '@/ui/design-system'

interface StageProps {
  state: 'idle' | 'loading' | 'error' | 'result'
  videoUrl?: string
  posterUrl?: string
  errorMessage?: string
  errorCode?: string
  onRetry?: () => void
}

export function Stage({ state, videoUrl, posterUrl, errorMessage, errorCode, onRetry }: StageProps) {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)

  // Reset video loaded state when videoUrl changes
  useEffect(() => {
    if (videoUrl) {
      setIsVideoLoaded(false)
      // Create a temporary video element to get dimensions
      const video = document.createElement('video')
      video.src = videoUrl
      video.onloadedmetadata = () => {
        setIsVideoLoaded(true)
      }
    } else {
      setIsVideoLoaded(false)
    }
  }, [videoUrl])
  return (
    <div className="w-full">
      {/* Container with fixed 16:9 aspect ratio */}
      <div className="relative w-full aspect-video">
        <div className="absolute inset-0 border border-border bg-panel rounded-sm overflow-hidden">
          {/* Idle State */}
          {state === 'idle' && (
            <div 
              className="absolute inset-0 flex flex-col items-center justify-center text-center"
              style={{ animation: 'stage-in 120ms cubic-bezier(0.16, 1, 0.3, 1)' }}
            >
              <div className="text-center">
                <p className="text-lg font-medium text-fg mb-2">Your video will appear here</p>
                <p className="text-sm text-subfg">Send your request first</p>
              </div>
            </div>
          )}

          {/* Loading State */}
          {state === 'loading' && (
            <div 
              className="absolute inset-0 flex flex-col items-center justify-center text-center"
              style={{ animation: 'stage-in 120ms cubic-bezier(0.16, 1, 0.3, 1)' }}
            >
              {/* Spinner from design system */}
              <div className="mb-lg">
                <Spinner size="lg" />
              </div>
              <p className="text-xl leading-tight tracking-[-0.04em] text-fg mb-xs">
              Generating…
              </p>
              <p className="font-mono text-sm leading-loose text-subfg">
                This may take a few moments
              </p>
            </div>
          )}

          {/* Error State */}
          {state === 'error' && (
          <div 
            className="absolute inset-0 flex items-center justify-center"
            style={{ animation: 'stage-in 120ms cubic-bezier(0.16, 1, 0.3, 1)' }}
          >
              <div className="w-full max-w-md">
                <StatusBanner
                  kind="danger"
                  title={errorCode ? `Error ${errorCode}` : 'Processing Failed'}
                  message={errorMessage || 'Something went wrong while processing your request'}
                  action={onRetry ? {
                    label: 'Retry',
                    onClick: onRetry
                  } : undefined}
                />
              </div>
            </div>
          )}

          {/* Result State */}
          {state === 'result' && videoUrl && (
            <>
              {/* Show loading until video metadata is loaded */}
              {!isVideoLoaded && (
                <div 
                  className="absolute inset-0 flex flex-col items-center justify-center text-center"
                  style={{ animation: 'stage-in 120ms cubic-bezier(0.16, 1, 0.3, 1)' }}
                >
                  <div className="mb-lg">
                    <Spinner size="lg" />
                  </div>
                  <p className="text-xl leading-tight tracking-[-0.04em] text-fg mb-xs">
                    Loading video…
                  </p>
                </div>
              )}
              
              {/* Show video only when metadata is loaded */}
              {isVideoLoaded && (
                <video
                  className="absolute inset-0 w-full h-full object-contain"
                  style={{ animation: 'stage-in 120ms cubic-bezier(0.16, 1, 0.3, 1)' }}
                  controls
                  poster={posterUrl}
                  preload="metadata"
                >
                  <source src={videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
