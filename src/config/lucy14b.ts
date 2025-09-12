/**
 * Lucy 14B - Image to Video Model
 * High-quality image-to-video generation via FAL AI
 */

import { AIProvider, ProviderRunResult, ProviderStatusResult } from '@/lib/providers'

// Configuration
export const LUCY14B_CONFIG = {
  id: 'lucy14b',
  name: 'Lucy 14B',
  api: {
    endpoint: 'fal-ai/wan/v2.2-a14b/image-to-video',
    baseUrl: process.env.FAL_BASE_URL || 'https://fal.run',
    timeout: 300000, // 5 minutes - video generation can take time
  },
  limits: {
    maxFileSizeMB: 10,
    maxPromptLength: 500,
    maxDuration: 10,
  }
} as const

// Types
export interface Lucy14bInput {
  type: 'image-to-video'
  modelCode: 'Lucy14b' // Must match the model.code from database
  prompt?: string
  duration?: number
  file: {
    path: string
    signedUrl: string | null
    mime: string
    size: number
  }
}

export interface Lucy14bOutput {
  type: 'video'
  url: string
  format: 'mp4'
  width: number
  height: number
  duration_s: number
  provider: string
  model: string
}

// Validation
function validateInput(input: any): { valid: boolean; error?: string } {
  console.log('🔍 Lucy14b: Validating input', {
    hasFile: !!input.file,
    hasSignedUrl: !!input.file?.signedUrl,
    fileSize: input.file?.size,
    promptLength: input.prompt?.length || 0,
    modelCode: input.modelCode
  })

  // Check model code
  if (input.modelCode !== 'Lucy14b') {
    return { valid: false, error: `Invalid model code: ${input.modelCode}. Expected: Lucy14b` }
  }

  // Check file
  if (!input.file?.signedUrl) return { valid: false, error: 'Image file with signed URL required' }
  
  // Check file size
  const fileSizeMB = input.file.size / (1024 * 1024)
  if (fileSizeMB > LUCY14B_CONFIG.limits.maxFileSizeMB) {
    return { valid: false, error: `File too large (${fileSizeMB.toFixed(1)}MB max ${LUCY14B_CONFIG.limits.maxFileSizeMB}MB)` }
  }
  
  // Check file type
  const allowedTypes = ['image/png', 'image/jpeg', 'image/webp']
  if (!allowedTypes.includes(input.file.mime)) {
    return { valid: false, error: `Unsupported file type: ${input.file.mime}. Allowed: ${allowedTypes.join(', ')}` }
  }
  
  // Check prompt
  if (input.prompt && input.prompt.length > LUCY14B_CONFIG.limits.maxPromptLength) {
    return { valid: false, error: `Prompt too long (max ${LUCY14B_CONFIG.limits.maxPromptLength} chars)` }
  }
  
  console.log('✅ Lucy14b: Input validation passed')
  return { valid: true }
}

// Environment check
export function isConfigured(): boolean {
  const apiKey = process.env.FAL_API_KEY || process.env.FAL_KEY
  const hasApiKey = !!apiKey
  const hasBaseUrl = !!process.env.FAL_BASE_URL
  
  console.log('🔧 Lucy14b: Environment check', {
    hasApiKey,
    hasBaseUrl,
    baseUrl: process.env.FAL_BASE_URL,
    apiKeySource: process.env.FAL_API_KEY ? 'FAL_API_KEY' : (process.env.FAL_KEY ? 'FAL_KEY' : 'missing'),
    configured: hasApiKey && hasBaseUrl
  })
  
  return hasApiKey && hasBaseUrl
}

// Provider Implementation
export class Lucy14bProvider implements AIProvider {
  name = 'lucy14b'

  async run(input: Lucy14bInput): Promise<ProviderRunResult> {
    console.log('🔧 Lucy14b: Starting run function', { 
      modelCode: input.modelCode,
      hasFile: !!input.file,
      hasSignedUrl: !!input.file?.signedUrl,
      prompt: input.prompt?.substring(0, 50) + '...'
    })

    if (!isConfigured()) {
      console.error('❌ Lucy14b: Not configured - missing environment variables')
      throw new Error('Lucy14b not configured - missing FAL_API_KEY')
    }

    const validation = validateInput(input)
    if (!validation.valid) {
      console.error('❌ Lucy14b: Input validation failed', validation.error)
      throw new Error(validation.error)
    }

    try {
      const payload = {
        image_url: input.file.signedUrl,
        prompt: input.prompt || 'Generate smooth video from image',
        duration: input.duration || 4,
        enable_safety_checker: false,
        sync: false // IMPORTANT: This makes it async!
      }

      const apiKey = process.env.FAL_API_KEY || process.env.FAL_KEY
      console.log('🚀 Lucy14b: Submitting ASYNC job to FAL', {
        hasApiKey: !!apiKey,
        promptLength: payload.prompt.length,
        imageUrl: input.file.signedUrl ? 'present' : 'missing',
        endpoint: `${LUCY14B_CONFIG.api.baseUrl}/${LUCY14B_CONFIG.api.endpoint}`
      })
      
      // Submit async job to FAL with retry logic
      let response: Response | undefined
      const maxRetries = 2
      
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          console.log(`🔄 Lucy14b: Attempt ${attempt}/${maxRetries}`)
          
          response = await fetch(`${LUCY14B_CONFIG.api.baseUrl}/${LUCY14B_CONFIG.api.endpoint}`, {
            method: 'POST',
            headers: {
              'Authorization': `Key ${apiKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload),
            signal: AbortSignal.timeout(30000) // 30 seconds for async submission
          })
          
          // If successful, break out of retry loop
          if (response.ok) break
          
          // If not the last attempt and got 5xx error, retry
          if (attempt < maxRetries && response.status >= 500) {
            console.log(`⚠️ Lucy14b: Server error ${response.status}, retrying in 2s...`)
            await new Promise(resolve => setTimeout(resolve, 2000))
            continue
          }
          
          break // Don't retry for client errors (4xx)
          
        } catch (error) {
          if (attempt === maxRetries) throw error
          
          if (error instanceof Error && error.name === 'TimeoutError') {
            console.log(`⚠️ Lucy14b: Timeout on attempt ${attempt}, retrying in 2s...`)
            await new Promise(resolve => setTimeout(resolve, 2000))
            continue
          }
          
          throw error // Don't retry for other errors
        }
      }

      if (!response || !response.ok) {
        const errorMsg = response ? `${response.status} ${response.statusText}` : 'No response received'
        console.error('❌ Lucy14b: All retry attempts failed', { error: errorMsg })
        throw new Error(`FAL API submission failed after ${maxRetries} attempts: ${errorMsg}`)
      }

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ Lucy14b: Failed to submit async job', {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
          url: `${LUCY14B_CONFIG.api.baseUrl}/${LUCY14B_CONFIG.api.endpoint}`
        })
        throw new Error(`FAL API error: ${response.status} ${response.statusText} - ${errorText}`)
      }

      const data = await response.json()
      console.log('✅ Lucy14b: Async job submitted successfully', { 
        requestId: data.request_id,
        status: data.status,
        responseKeys: Object.keys(data)
      })
      
      // Return the request_id from FAL for status checking
      return { kind: 'deferred', providerJobId: data.request_id || `fallback_${Date.now()}` }
      
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error'
      console.error('❌ Lucy14b: Async job submission failed', {
        error: errorMsg,
        stack: error instanceof Error ? error.stack : undefined
      })
      throw new Error(`Lucy14b async submission failed: ${errorMsg}`)
    }
  }

  async result(jobId: string, input?: Lucy14bInput): Promise<ProviderStatusResult> {
    if (!jobId || !input) {
      return { status: 'running' }
    }

    // Handle fallback jobs (if FAL didn't return request_id)
    if (jobId.startsWith('fallback_') || jobId.startsWith('lucy14b_')) {
      console.log('🔍 Lucy14b: Fallback job - cannot check real status', { jobId })
      return { status: 'running' } // Keep running indefinitely for fallback jobs
    }

    try {
      const apiKey = process.env.FAL_API_KEY || process.env.FAL_KEY
      console.log('📡 Lucy14b: Checking REAL job status with FAL API', { jobId })
      
      // Check job status using FAL's status endpoint
      const statusUrl = `${LUCY14B_CONFIG.api.baseUrl}/${LUCY14B_CONFIG.api.endpoint}/requests/${jobId}`
      console.log('🔍 Calling FAL status URL:', statusUrl)
      
      const response = await fetch(statusUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Key ${apiKey}`,
        },
        signal: AbortSignal.timeout(8000) // 8 seconds for status check
      })

      if (!response.ok) {
        if (response.status === 404) {
          console.log('⏳ Lucy14b: Job not found yet, still running...')
          return { status: 'running' }
        }
        
        const errorText = await response.text()
        console.error('❌ Lucy14b: Status check failed', {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
          url: statusUrl
        })
        return { status: 'running' } // Keep trying
      }

      const data = await response.json()
      console.log('📊 Lucy14b: FAL Status response', { 
        status: data.status,
        hasVideo: !!data.video,
        videoUrl: data.video?.url,
        responseKeys: Object.keys(data)
      })
      
      // Check if job is completed
      if (data.status === 'COMPLETED' && data.video?.url) {
        console.log('🎬 Lucy14b: REAL video generated successfully!', { url: data.video.url })
        return {
          status: 'succeeded',
          output: {
            type: 'video',
            url: data.video.url,
            format: 'mp4',
            width: data.video.width || 1280,
            height: data.video.height || 720,
            duration_s: input.duration || 4,
            provider: 'lucy14b',
            model: LUCY14B_CONFIG.api.endpoint,
            prompt: input.prompt,
          } as Lucy14bOutput
        }
      } else if (data.status === 'FAILED' || data.status === 'ERROR') {
        console.error('💥 Lucy14b: Job failed', { error: data.error })
        return {
          status: 'failed',
          error: data.error || 'Video generation failed'
        }
      } else {
        console.log('⏳ Lucy14b: Job still running...', { status: data.status })
        return { status: 'running' }
      }

    } catch (error) {
      console.error('❌ Lucy14b: Processing failed', error)
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          return {
            status: 'failed',
            error: 'Video generation timed out. Please try again.'
          }
        }
        return {
          status: 'failed',
          error: error.message.includes('timeout') 
            ? 'Video generation is taking longer than expected. Please try again with a smaller image or simpler prompt.'
            : `Video generation failed: ${error.message}`
        }
      }
      
      return {
        status: 'failed',
        error: 'Unknown error occurred during video generation'
      }
    }
  }
}