'use client'

import { useState, useRef } from 'react'

interface VideoUploadTileProps {
  onFileSelect?: (file: File) => void
  onUploadComplete?: (uploadResult: any, file: File) => void
  onUploadError?: (error: string) => void
  state?: 'empty' | 'dragOver' | 'uploading' | 'success' | 'error'
  videoUrl?: string
  errorMessage?: string
}

export function VideoUploadTile({ onFileSelect, onUploadComplete, onUploadError, state = 'empty', videoUrl, errorMessage }: VideoUploadTileProps) {
  const [dragActive, setDragActive] = useState(false)
  const [videoThumbnail, setVideoThumbnail] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Function to process file: generate thumbnail and upload
  const processFile = async (file: File) => {
    try {
      // Generate thumbnail first
      const thumbnail = await generateVideoThumbnail(file)
      setVideoThumbnail(thumbnail)
      
      // Call onFileSelect for backward compatibility
      onFileSelect?.(file)
      
      // Start upload
      console.log('📤 Starting file upload...', { name: file.name, size: file.size })
      
      const formData = new FormData()
      formData.append('file', file)

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!uploadResponse.ok) {
        throw new Error(`Upload failed: ${uploadResponse.statusText}`)
      }

      const uploadResult = await uploadResponse.json()
      console.log('✅ File uploaded successfully:', uploadResult)
      
      // Notify parent component
      onUploadComplete?.(uploadResult, file)
      
    } catch (error) {
      console.error('❌ Upload failed:', error)
      onUploadError?.(error instanceof Error ? error.message : 'Upload failed')
    }
  }

  // Function to generate thumbnail from video first frame
  const generateVideoThumbnail = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video')
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      video.onloadedmetadata = () => {
        // Set canvas dimensions to match video
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        
        // Seek to first frame
        video.currentTime = 0
      }
      
      video.onseeked = () => {
        if (ctx) {
          // Draw first frame to canvas
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
          // Convert to data URL
          const thumbnail = canvas.toDataURL('image/jpeg', 0.8)
          resolve(thumbnail)
        } else {
          reject(new Error('Could not get canvas context'))
        }
      }
      
      video.onerror = () => reject(new Error('Error loading video'))
      
      // Load video file
      video.src = URL.createObjectURL(file)
      video.load()
    })
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.type.startsWith('video/')) {
        await processFile(file)
      }
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.type.startsWith('video/')) {
        await processFile(file)
      }
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const isActive = state === 'dragOver' || dragActive
  const showVideo = state === 'success' && (videoUrl || videoThumbnail)

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
      aria-label="Upload video - Click or drag and drop a video file"
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
        accept="video/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Success state - show video thumbnail */}
      {showVideo && (
        <img
          src={videoThumbnail || videoUrl}
          alt="Video thumbnail"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Loading state */}
      {state === 'uploading' && (
        <div className="flex flex-col items-center justify-center">
          <div className="mb-sm">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
          <span className="font-mono text-xs text-subfg">Uploading</span>
        </div>
      )}

      {/* Empty state */}
      {(state === 'empty' || isActive) && !showVideo && state !== 'uploading' && (
        <div className="flex flex-col items-center justify-center">
          {/* Video upload icon */}
          <svg
            width="38"
            height="28"
            viewBox="0 0 43 31"
            fill="none"
            className="text-subfg mb-sm"
          >
            <path d="M14.8976 9.87311V20.4869" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round"/>
            <path d="M19.7652 14.3415L15.5898 10.1661C15.4991 10.0752 15.3914 10.0032 15.2728 9.95404C15.1542 9.90488 15.0272 9.87958 14.8988 9.87958C14.7705 9.87958 14.6434 9.90488 14.5248 9.95404C14.4063 10.0032 14.2985 10.0752 14.2079 10.1661L10.0303 14.3415" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M21.1662 1H8.63132C7.62773 0.999998 6.634 1.19795 5.70702 1.58252C4.78004 1.96709 3.93802 2.53073 3.22916 3.24116C2.52031 3.95159 1.95854 4.79486 1.57604 5.7227C1.19353 6.65053 0.997786 7.6447 1.00002 8.64828V21.7287C1.00002 23.7526 1.80403 25.6937 3.23518 27.1248C3.94381 27.8335 4.78508 28.3956 5.71095 28.7791C6.63682 29.1626 7.62916 29.36 8.63132 29.36H21.1662C23.1901 29.36 25.1312 28.556 26.5623 27.1248C27.9935 25.6937 28.7975 23.7526 28.7975 21.7287V8.65041C28.8003 7.64656 28.6049 6.65204 28.2227 5.72384C27.8404 4.79563 27.2787 3.952 26.5697 3.24128C25.8608 2.53057 25.0186 1.96675 24.0913 1.58215C23.1641 1.19755 22.17 0.999717 21.1662 1ZM41.3324 9.7415V20.6418C41.3324 21.1725 41.1816 21.6947 40.8972 22.1448C40.6091 22.5961 40.2012 22.9584 39.7191 23.1913C39.2401 23.431 38.7007 23.5226 38.1695 23.4545C37.6458 23.3917 37.149 23.1878 36.7323 22.8644L29.8865 17.3707C29.5576 17.1001 29.2918 16.7611 29.1074 16.3772C28.923 15.9934 28.8245 15.574 28.8187 15.1482C28.8187 14.7236 28.9142 14.3075 29.101 13.9276C29.2963 13.571 29.5638 13.2589 29.8865 13.0105L36.7323 7.56143C37.1491 7.23675 37.6469 7.03263 38.1716 6.97131C38.7023 6.90338 39.2414 6.99466 39.7191 7.23453C40.1951 7.46026 40.5985 7.81468 40.8836 8.25771C41.1687 8.70075 41.3241 9.21472 41.3324 9.7415Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="font-mono text-xs text-subfg">Upload</span>
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
          <span className="font-mono text-xs text-red-400 leading-tight">
            {errorMessage || 'Error'}
          </span>
        </div>
      )}
    </div>
  )
}
