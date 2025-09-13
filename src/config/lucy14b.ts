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
    const startTime = Date.now()
    console.log('🚀 [LUCY14B-RUN] Starting job submission', { 
      modelCode: input.modelCode,
      fileSize: input.file?.size,
      prompt: input.prompt,
      duration: input.duration || 4,
      timestamp: new Date().toISOString()
    })

    // Step 1: Configuration check
    if (!isConfigured()) {
      console.error('❌ [LUCY14B-RUN] Configuration failed - missing FAL API key')
      throw new Error('Lucy14b not configured - missing FAL_API_KEY')
    }
    console.log('✅ [LUCY14B-RUN] Configuration valid')

    // Step 2: Input validation
    const validation = validateInput(input)
    if (!validation.valid) {
      console.error('❌ [LUCY14B-RUN] Input validation failed:', validation.error)
      throw new Error(validation.error)
    }
    console.log('✅ [LUCY14B-RUN] Input validation passed')

    // Step 3: Prepare FAL payload
    const payload = {
      image_url: input.file.signedUrl,
      prompt: input.prompt || 'Generate smooth video from image',
      duration: input.duration || 4,
      enable_safety_checker: false,
      sync: false
    }
    
    const apiKey = process.env.FAL_API_KEY || process.env.FAL_KEY
    const endpoint = `${LUCY14B_CONFIG.api.baseUrl}/${LUCY14B_CONFIG.api.endpoint}`
    
    console.log('📤 [LUCY14B-RUN] Sending request to FAL', {
      endpoint,
      payloadSize: JSON.stringify(payload).length,
      hasApiKey: !!apiKey,
      apiKeyPrefix: apiKey ? apiKey.substring(0, 8) + '...' : 'missing'
    })

    try {
      // Step 4: Submit to FAL API
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Key ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(25000)
      })

      const responseTime = Date.now() - startTime
      console.log('📨 [LUCY14B-RUN] FAL API response received', {
        status: response.status,
        statusText: response.statusText,
        responseTime: `${responseTime}ms`,
        contentType: response.headers.get('content-type')
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ [LUCY14B-RUN] FAL API rejected request', {
          status: response.status,
          statusText: response.statusText,
          errorBody: errorText,
          responseTime: `${responseTime}ms`
        })
        throw new Error(`FAL API error ${response.status}: ${errorText}`)
      }

      // Step 5: Parse response
      const data = await response.json()
      console.log('✅ [LUCY14B-RUN] FAL job submitted successfully', {
        requestId: data.request_id,
        status: data.status,
        responseKeys: Object.keys(data),
        totalTime: `${Date.now() - startTime}ms`
      })

      if (!data.request_id) {
        console.error('❌ [LUCY14B-RUN] FAL response missing request_id', { data })
        throw new Error('FAL API response missing request_id')
      }

      return { kind: 'deferred', providerJobId: data.request_id }
      
    } catch (error) {
      const totalTime = Date.now() - startTime
      
      if (error instanceof Error) {
        if (error.name === 'TimeoutError') {
          console.error('⏱️ [LUCY14B-RUN] Request timed out', {
            timeoutAfter: `${totalTime}ms`,
            maxTimeout: '25000ms'
          })
          throw new Error('FAL API request timed out after 25 seconds')
        }
        
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
          console.error('🌐 [LUCY14B-RUN] Network error', {
            error: error.message,
            totalTime: `${totalTime}ms`
          })
          throw new Error('Network error connecting to FAL API')
        }
      }

      console.error('❌ [LUCY14B-RUN] Unexpected error', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        totalTime: `${totalTime}ms`
      })
      
      throw error
    }
  }

  async result(jobId: string, input?: Lucy14bInput): Promise<ProviderStatusResult> {
    const startTime = Date.now()
    console.log('🔍 [LUCY14B-STATUS] Checking job status', { 
      jobId,
      timestamp: new Date().toISOString()
    })

    if (!jobId) {
      console.error('❌ [LUCY14B-STATUS] No job ID provided')
      return { status: 'failed', error: 'Missing job ID' }
    }

    // Simple validation - real FAL job IDs should be UUIDs or similar
    if (jobId.startsWith('lucy14b_') || jobId.startsWith('fallback_')) {
      console.error('❌ [LUCY14B-STATUS] Invalid job ID (fallback/timeout)', { jobId })
      return { 
        status: 'failed', 
        error: 'Job submission failed. Please try again.' 
      }
    }

    try {
      const apiKey = process.env.FAL_API_KEY || process.env.FAL_KEY
      const statusUrl = `${LUCY14B_CONFIG.api.baseUrl}/${LUCY14B_CONFIG.api.endpoint}/requests/${jobId}`
      
      console.log('📡 [LUCY14B-STATUS] Querying FAL API', {
        statusUrl,
        hasApiKey: !!apiKey,
        apiKeyPrefix: apiKey ? apiKey.substring(0, 8) + '...' : 'missing'
      })

      const response = await fetch(statusUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Key ${apiKey}`,
        },
        signal: AbortSignal.timeout(8000)
      })

      const responseTime = Date.now() - startTime
      console.log('📨 [LUCY14B-STATUS] FAL status response', {
        status: response.status,
        statusText: response.statusText,
        responseTime: `${responseTime}ms`
      })

      if (!response.ok) {
        if (response.status === 404) {
          console.log('⏳ [LUCY14B-STATUS] Job not found - still processing')
          return { status: 'running' }
        }
        
        const errorText = await response.text()
        console.error('❌ [LUCY14B-STATUS] FAL API error', {
          status: response.status,
          statusText: response.statusText,
          errorBody: errorText
        })
        return { status: 'running' } // Keep trying
      }

      const data = await response.json()
      console.log('📊 [LUCY14B-STATUS] Job status data', {
        falStatus: data.status,
        hasVideo: !!data.video,
        videoUrl: data.video?.url?.substring(0, 50) + '...',
        responseKeys: Object.keys(data),
        totalTime: `${Date.now() - startTime}ms`
      })

      // Handle completed job
      if (data.status === 'COMPLETED' && data.video?.url) {
        console.log('🎬 [LUCY14B-STATUS] Video generation completed!', {
          videoUrl: data.video.url,
          videoDuration: data.video.duration,
          videoSize: data.video.file_size
        })
        
        return {
          status: 'succeeded',
          output: {
            type: 'video',
            url: data.video.url,
            format: 'mp4',
            width: data.video.width || 1280,
            height: data.video.height || 720,
            duration_s: input?.duration || 4,
            provider: 'lucy14b',
            model: LUCY14B_CONFIG.api.endpoint,
            prompt: input?.prompt || '',
          } as Lucy14bOutput
        }
      }

      // Handle failed job
      if (data.status === 'FAILED' || data.status === 'ERROR') {
        console.error('💥 [LUCY14B-STATUS] Job failed', {
          falStatus: data.status,
          error: data.error,
          details: data.detail
        })
        
        return {
          status: 'failed',
          error: data.error || data.detail || 'Video generation failed'
        }
      }

      // Job still running
      console.log('⏳ [LUCY14B-STATUS] Job still processing', {
        falStatus: data.status,
        progress: data.progress || 'unknown'
      })
      
      return { status: 'running' }

    } catch (error) {
      const totalTime = Date.now() - startTime
      
      if (error instanceof Error && error.name === 'TimeoutError') {
        console.error('⏱️ [LUCY14B-STATUS] Status check timed out', {
          timeoutAfter: `${totalTime}ms`,
          maxTimeout: '8000ms'
        })
        return { status: 'running' } // Keep trying
      }

      console.error('❌ [LUCY14B-STATUS] Status check failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
        totalTime: `${totalTime}ms`
      })
      
      return { status: 'running' } // Keep trying on errors
    }
  }
}