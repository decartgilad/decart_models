'use client'

import { useState, useCallback } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createJob, mapErrorToApiError } from '@/lib/http'
import { jobQueryKeys } from '@/lib/queries/keys'
import { ModelConfig, UploadResult, ApiError } from '@/types'

export interface JobCreationState {
  currentJobId: string | null
  isCreating: boolean
  error: ApiError | null
}

export interface UseJobCreationReturn extends JobCreationState {
  createJobWithModel: (uploadResult: UploadResult, prompt: string) => void
  reset: () => void
}

export function useJobCreation(model: ModelConfig): UseJobCreationReturn {
  const [currentJobId, setCurrentJobId] = useState<string | null>(null)
  const [error, setError] = useState<ApiError | null>(null)
  const queryClient = useQueryClient()

  // Create job mutation with model scoping
  const createJobMutation = useMutation({
    mutationFn: ({ uploadResult, prompt }: { uploadResult: UploadResult; prompt: string }) => {
      const input: any = {
        type: 'image-to-video',
        timestamp: new Date().toISOString(),
        modelCode: model.code,     // Include model code for backend
      }

      // Include file metadata
      input.file = {
        path: uploadResult.path,
        signedUrl: uploadResult.signedUrl,
        mime: uploadResult.mime,
        size: uploadResult.size
      }
      
      // Add prompt for video generation
      if (prompt.trim()) {
        input.prompt = prompt.trim()
      }

      // Pass through any additional parameters from uploadResult (like enhance_prompt, orientation)
      if (uploadResult.enhance_prompt !== undefined) {
        input.enhance_prompt = uploadResult.enhance_prompt
      }
      if (uploadResult.orientation) {
        input.orientation = uploadResult.orientation
      }
      if (uploadResult.originalName) {
        input.file.originalName = uploadResult.originalName
      }

      console.log('🚀 Creating job with input:', input)
      return createJob(input)
    },
    onSuccess: (data) => {
      console.log('✅ Job created successfully:', data)
      setCurrentJobId(data.id)
      setError(null)
      // Clear any existing job status cache for this model
      queryClient.removeQueries({ queryKey: jobQueryKeys.byModel(model.code) })
    },
    onError: (err) => {
      console.error('❌ Job creation failed:', err)
      setError(mapErrorToApiError(err))
    },
  })

  const createJobWithModel = useCallback((uploadResult: UploadResult, prompt: string) => {
    setError(null)
    createJobMutation.mutate({ uploadResult, prompt })
  }, [createJobMutation])

  const reset = useCallback(() => {
    setCurrentJobId(null)
    setError(null)
  }, [])

  return {
    currentJobId,
    isCreating: createJobMutation.isPending,
    error,
    createJobWithModel,
    reset,
  }
}
