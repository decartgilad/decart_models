'use client'

import * as React from 'react'
import type { ModelViewProps } from '../models/registry'
import { useFileUpload } from '../models/useFileUpload'
import { useJobCreation } from '../models/useJobCreation'
import { useJobStatus } from '../models/useJobStatus'
import { ErrorBanner } from '@/components/feedback/ErrorBanner'
import { ModelHeader, Stage, VideoPromptRail } from '@/ui/design-system'

export default function SpliceView({ model }: ModelViewProps) {
  // Use existing hooks
  const fileUpload = useFileUpload()
  const jobCreation = useJobCreation(model)
  const jobStatus = useJobStatus(model, jobCreation.currentJobId, { autoRefresh: true })
  
  // Local state for upload loading
  const [isUploading, setIsUploading] = React.useState(false)

  // Combined error from all sources
  const error = fileUpload.error || jobCreation.error

  const handlePromptSubmit = React.useCallback(async (prompt: string, file: File) => {
    // Prevent duplicate job creation
    if (jobCreation.isCreating || isUploading) {
      console.warn('Job already in progress, ignoring duplicate request')
      return
    }

    try {
      setIsUploading(true)
      console.log('📤 Starting file upload...', { name: file.name, size: file.size })
      
      // Actually upload the file to the server
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
      
      // Set the real upload result
      fileUpload.setUploadResult(uploadResult)
      
      // Create job with real uploaded file and Splice-specific parameters
      const spliceInput = {
        ...uploadResult,
        originalName: file.name, // Add original filename for format validation
        enhance_prompt: true, // Default to enhanced prompts
        // orientation will be auto-detected by the provider - don't override it
      }
      
      jobCreation.createJobWithModel(spliceInput, prompt)
      
    } catch (error) {
      console.error('❌ Upload failed:', error)
      fileUpload.setUploadResult(null)
      // You might want to show an error to the user here
    } finally {
      setIsUploading(false)
    }
  }, [jobCreation, fileUpload, isUploading])

  const dismissError = React.useCallback(() => {
    fileUpload.reset()
    jobCreation.reset()
  }, [fileUpload, jobCreation])

  const getStageState = React.useCallback((): 'idle' | 'loading' | 'error' | 'result' => {
    
    // Check for successful completion with video output (be more flexible with output structure)
    if (jobStatus.data?.status === 'succeeded' && jobStatus.data?.output) {
      const output = jobStatus.data.output
      // Check if we have a video URL in any of the expected formats - check nested video first
      const hasVideoUrl = (output.video && output.video.url) ||
                          output.url || output.video_url || output.videoUrl || 
                          (output.type === 'video' && output.url)
      
      
      if (hasVideoUrl) {
        return 'result'
      }
    }
    if (jobStatus.data?.status === 'failed') {
      return 'error'
    }
    if (isUploading || jobCreation.isCreating || (jobCreation.currentJobId && (jobStatus.isFetching || jobStatus.data?.status === 'running'))) {
      return 'loading'
    }
    return 'idle'
  }, [isUploading, jobCreation.isCreating, jobCreation.currentJobId, jobStatus.isFetching, jobStatus.data?.status, jobStatus.data?.output])

  return (
    <div className="space-y-xl">
      {/* Header from design system */}
      <ModelHeader
        model={model}
      />

      {/* Error Banner */}
      {error && (
        <ErrorBanner
          message={error.message}
          details={error.details}
          onDismiss={dismissError}
        />
      )}

      {/* Stage from design system */}
      <Stage
        state={getStageState()}
        videoUrl={(() => {
          if (jobStatus.data?.status === 'succeeded' && jobStatus.data?.output) {
            const output = jobStatus.data.output
            // Return the first available video URL - check nested video object first
            return (output.video && output.video.url) || 
                   output.url || output.video_url || output.videoUrl || undefined
          }
          return undefined
        })()}
        posterUrl={fileUpload.uploadResult?.signedUrl || undefined}
        errorMessage={jobStatus.data?.status === 'failed' ? jobStatus.data?.error || undefined : undefined}
        onRetry={() => {
          jobCreation.reset()
          if (fileUpload.uploadResult) {
            jobCreation.createJobWithModel(fileUpload.uploadResult, 'Retry generation')
          }
        }}
      />


      {/* Video Prompt Rail from design system - optimized for video files */}
      <VideoPromptRail
        onSubmit={handlePromptSubmit}
        loading={jobCreation.isCreating || isUploading}
        disabled={jobCreation.isCreating || isUploading}
      />
    </div>
  )
}
