'use client'

import { useState, useRef } from 'react'

interface UploadTileProps {
  onFileSelect?: (file: File) => void
  state?: 'empty' | 'dragOver' | 'uploading' | 'success' | 'error'
  thumbnailUrl?: string
  errorMessage?: string
  acceptedTypes?: 'image' | 'video' | 'both' // New prop to control accepted file types
}

export function UploadTile({ onFileSelect, state = 'empty', thumbnailUrl, errorMessage, acceptedTypes = 'image' }: UploadTileProps) {
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      const isValidType = 
        (acceptedTypes === 'image' && file.type.startsWith('image/')) ||
        (acceptedTypes === 'video' && file.type.startsWith('video/')) ||
        (acceptedTypes === 'both' && (file.type.startsWith('image/') || file.type.startsWith('video/')))
      
      if (isValidType) {
        onFileSelect?.(file)
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect?.(e.target.files[0])
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const isActive = state === 'dragOver' || dragActive
  const showThumbnail = state === 'success' && thumbnailUrl

  return (
    <div
      className={`
        w-[105px] h-[105px] border border-border rounded-[5px] cursor-pointer transition-all duration-300 flex flex-col items-center justify-center relative overflow-hidden hover:bg-white/10
        ${isActive ? 'border-primary' : 'border-border'}
        ${state === 'error' ? 'border-red-500/50' : ''}
        ${state === 'uploading' ? 'border-primary' : ''}
      `}
      style={isActive ? { animation: 'border-pulse 1.2s ease-in-out infinite alternate' } : {}}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label="Upload image - Click or drag and drop an image file"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleClick()
        }
      }}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes === 'image' ? 'image/*' : acceptedTypes === 'video' ? 'video/*' : 'image/*,video/*'}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Success state - show thumbnail */}
      {showThumbnail && (
        <img
          src={thumbnailUrl}
          alt="Uploaded image"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Loading state */}
      {state === 'uploading' && (
        <div className="flex flex-col items-center justify-center">
          <div className="mb-sm">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
          <span className="mono text-xs text-subfg">Uploading</span>
        </div>
      )}

      {/* Empty state */}
      {(state === 'empty' || isActive) && !showThumbnail && state !== 'uploading' && (
        <div className="flex flex-col items-center justify-center">
          {/* Upload icon */}
          <svg
            width="38"
            height="38"
            viewBox="0 0 38 38"
            fill="none"
            className="text-subfg mb-sm"
          >
            <path d="M4.75 25.3333L11.8275 18.2558C12.0936 17.9896 12.4096 17.7785 12.7573 17.6344C13.1051 17.4903 13.4778 17.4162 13.8542 17.4162C14.2306 17.4162 14.6033 17.4903 14.951 17.6344C15.2988 17.7785 15.6147 17.9896 15.8808 18.2558L22.1667 24.5416M22.1667 24.5416L24.5417 26.9166M22.1667 24.5416L25.2858 21.4225C25.552 21.1563 25.8679 20.9451 26.2157 20.8011C26.5634 20.657 26.9361 20.5829 27.3125 20.5829C27.6889 20.5829 28.0616 20.657 28.4094 20.8011C28.7571 20.9451 29.073 21.1563 29.3392 21.4225L33.25 25.3333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M19 3.95831C12.3025 3.95831 8.95373 3.95831 6.7339 5.85515C6.41723 6.12537 6.12431 6.41828 5.85515 6.7339C3.95831 8.95373 3.95831 12.3025 3.95831 19C3.95831 25.6975 3.95831 29.0462 5.85515 31.2661C6.12537 31.5827 6.41828 31.8756 6.7339 32.1448C8.95373 34.0416 12.3025 34.0416 19 34.0416C25.6975 34.0416 29.0462 34.0416 31.2661 32.1448C31.5827 31.8746 31.8756 31.5817 32.1448 31.2661C34.0416 29.0462 34.0416 25.6975 34.0416 19M24.5416 8.70831C25.4758 7.74723 27.9616 3.95831 29.2916 3.95831C30.6216 3.95831 33.1075 7.74723 34.0416 8.70831M29.2916 4.74998V15.0416" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="font-mono text-[12px] text-subfg">Upload</span>
        </div>
      )}

      {/* Error state */}
      {state === 'error' && (
        <div className="flex flex-col items-center justify-center text-center p-xs">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-red-400 mb-xs"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
          <span className="mono text-xs text-red-400 leading-tight">
            {errorMessage || 'Error'}
          </span>
        </div>
      )}
    </div>
  )
}
