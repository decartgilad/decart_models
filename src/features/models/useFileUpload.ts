'use client'

import { useState, useCallback } from 'react'
import { useMutation } from '@tanstack/react-query'
import { uploadFile, mapErrorToApiError } from '@/lib/http'
import { UploadResult, ApiError } from '@/types'

export interface FileUploadState {
  selectedFile: File | null
  uploadResult: UploadResult | null
  isUploading: boolean
  error: ApiError | null
  imageAspectRatio: number | null
}

export interface UseFileUploadReturn extends FileUploadState {
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleDrop: (e: React.DragEvent) => void
  handleDragOver: (e: React.DragEvent) => void
  handleUpload: () => void
  setUploadResult: (result: UploadResult | null) => void
  reset: () => void
}

export function useFileUpload(): UseFileUploadReturn {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null)
  const [error, setError] = useState<ApiError | null>(null)
  const [imageAspectRatio, setImageAspectRatio] = useState<number | null>(null)

  // Upload file mutation
  const uploadMutation = useMutation({
    mutationFn: uploadFile,
    onSuccess: (data) => {
      console.log('✅ Upload successful:', data)
      setUploadResult(data)
      setError(null)
    },
    onError: (err) => {
      console.error('❌ Upload failed:', err)
      setError(mapErrorToApiError(err))
    },
  })

  const processFile = useCallback((file: File) => {
    console.log('📁 File processed:', { name: file.name, size: file.size, type: file.type })
    setSelectedFile(file)
    setUploadResult(null) // Reset upload result when new file selected
    setImageAspectRatio(null) // Reset aspect ratio when new file selected
    setError(null)
    
    // Measure image dimensions to get aspect ratio
    const img = new Image()
    img.onload = () => {
      const ratio = img.width / img.height
      console.log('📐 Image dimensions:', { width: img.width, height: img.height, ratio })
      setImageAspectRatio(ratio)
    }
    img.src = URL.createObjectURL(file)
    
    // Upload file immediately
    uploadMutation.mutate(file)
  }, [uploadMutation])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      processFile(file)
    }
  }, [processFile])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) {
      console.log('🎯 File dropped:', { name: file.name, size: file.size, type: file.type })
      processFile(file)
    }
  }, [processFile])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
  }, [])

  const handleUpload = useCallback(() => {
    if (!selectedFile) {
      setError({ message: 'Please select a file first' })
      return
    }
    
    setError(null)
    uploadMutation.mutate(selectedFile)
  }, [selectedFile, uploadMutation])

  const reset = useCallback(() => {
    setSelectedFile(null)
    setUploadResult(null)
    setImageAspectRatio(null)
    setError(null)
  }, [])

  return {
    selectedFile,
    uploadResult,
    isUploading: uploadMutation.isPending,
    error,
    imageAspectRatio,
    handleFileSelect,
    handleDrop,
    handleDragOver,
    handleUpload,
    setUploadResult,
    reset,
  }
}
