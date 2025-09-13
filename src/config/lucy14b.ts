/**
 * Lucy 14B - Image to Video Model (Vercel Optimized)
 * Simple, direct integration with FAL AI for Vercel serverless functions
 */

import { AIProvider, ProviderRunResult, ProviderStatusResult } from '@/lib/providers'

// FAL AI Model Configuration - fal-ai/wan/v2.2-a14b/image-to-video
const FAL_ENDPOINT = 'https://fal.run/fal-ai/wan/v2.2-a14b/image-to-video'
const FAL_MODEL_ID = 'fal-ai/wan/v2.2-a14b/image-to-video'

// Vercel-compatible timeout helper
function createTimeoutSignal(ms: number): AbortSignal {
  // Check if we're in Edge Runtime
  const isEdgeRuntime = typeof globalThis !== 'undefined' && 'EdgeRuntime' in globalThis
  
  if (!isEdgeRuntime && typeof AbortSignal !== 'undefined' && AbortSignal.timeout) {
    return AbortSignal.timeout(ms)
  }
  
  // Fallback for Edge environments and older Node versions
  const controller = new AbortController()
  const timeoutId = setTimeout(() => {
    controller.abort()
  }, ms)
  
  // Clean up timeout if signal is used
  const originalSignal = controller.signal
  const cleanup = () => clearTimeout(timeoutId)
  originalSignal.addEventListener('abort', cleanup, { once: true })
  
  return originalSignal
}

// Vercel-optimized retry mechanism with shorter timeouts
async function postWithRetry(url: string, init: RequestInit, attempts = 2): Promise<Response> {
  let lastErr: any
  
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url, init)
      
      // Only retry on server errors and rate limits
      if ((res.status >= 500 || res.status === 429) && i < attempts - 1) {
        // Shorter backoff for Vercel's timeout constraints
        const wait = Math.min(1000, 100 * Math.pow(2, i))
        console.log(`[${new Date().toISOString()}] Retrying after ${wait}ms (${res.status}, attempt ${i + 1}/${attempts})`)
        await new Promise(r => setTimeout(r, wait))
        continue
      }
      
      return res
    } catch (e) {
      lastErr = e
      if (i < attempts - 1) {
        const wait = Math.min(1000, 100 * Math.pow(2, i))
        console.log(`[${new Date().toISOString()}] Network retry after ${wait}ms (attempt ${i + 1}/${attempts})`)
        await new Promise(r => setTimeout(r, wait))
      }
    }
  }
  
  if (lastErr) throw lastErr
  throw new Error('Request failed after retries')
}

// Types
export interface Lucy14bInput {
  type: 'image-to-video'
  modelCode: 'Lucy14b'
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
  prompt?: string
}

// Comprehensive validation with type guard
function isValidInput(input: any): input is Lucy14bInput {
  if (!input || input.modelCode !== 'Lucy14b') {
    return false
  }
  
  const f = input.file
  if (!f || !f.signedUrl || typeof f.size !== 'number') {
    return false
  }
  
  // File size validation (10MB max)
  if (f.size <= 0 || f.size > 10 * 1024 * 1024) {
    return false
  }
  
  // MIME type validation
  const allowedMimeTypes = new Set([
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/webp'
  ])
  if (!allowedMimeTypes.has(f.mime)) {
    return false
  }
  
  // Duration validation (1-10 seconds)
  if (input.duration != null) {
    const d = Number(input.duration)
    if (!Number.isFinite(d) || d < 1 || d > 10) {
      return false
    }
  }
  
  return true
}

// User-friendly error messages
function getValidationError(input: any): string {
  if (!input || input.modelCode !== 'Lucy14b') {
    return 'Invalid model code - expected Lucy14b'
  }
  
  const f = input.file
  if (!f || !f.signedUrl) {
    return 'Missing or invalid image file'
  }
  
  if (typeof f.size !== 'number' || f.size <= 0) {
    return 'Invalid file size'
  }
  
  if (f.size > 10 * 1024 * 1024) {
    return 'File too large - maximum 10MB allowed'
  }
  
  const allowedMimeTypes = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp'])
  if (!allowedMimeTypes.has(f.mime)) {
    return `Unsupported image format: ${f.mime}. Allowed: JPEG, PNG, WebP`
  }
  
  if (input.duration != null) {
    const d = Number(input.duration)
    if (!Number.isFinite(d) || d < 1 || d > 10) {
      return 'Duration must be between 1 and 10 seconds'
    }
  }
  
  return 'Unknown validation error'
}

// Vercel environment check with detailed logging
export function isConfigured(): boolean {
  const apiKey = process.env.FAL_API_KEY || process.env.FAL_KEY
  const isConfigured = !!apiKey
  
  if (!isConfigured) {
    console.error('[Lucy14b] FAL API key not found in environment variables')
    console.error('[Lucy14b] Expected: FAL_API_KEY or FAL_KEY')
    console.error('[Lucy14b] Available env vars:', Object.keys(process.env).filter(k => k.includes('FAL')).join(', ') || 'none')
  }
  
  return isConfigured
}

// Vercel-optimized Provider Implementation
export class Lucy14bProvider implements AIProvider {
  name = 'lucy14b'

  async run(input: Lucy14bInput): Promise<ProviderRunResult> {
    const startTime = Date.now()
    console.log(`[${new Date().toISOString()}] Lucy14b: Starting async video generation`, { 
      prompt: input.prompt?.substring(0, 100),
      fileSize: input.file?.size,
      duration: input.duration,
      endpoint: FAL_ENDPOINT.split('/').pop(), // Only log model name for security
      mode: 'async'
    })

    // Configuration validation
    if (!isConfigured()) {
      throw new Error('FAL API key not configured - check environment variables')
    }

    // Input validation with specific error messages
    if (!isValidInput(input)) {
      const errorMsg = getValidationError(input)
      console.error(`[${new Date().toISOString()}] Lucy14b validation failed:`, errorMsg)
      throw new Error(errorMsg)
    }

    const apiKey = process.env.FAL_API_KEY || process.env.FAL_KEY

    try {
      console.log(`[${new Date().toISOString()}] Submitting video generation to FAL API...`)
      
      // Direct video generation with retry mechanism
      const response = await postWithRetry(FAL_ENDPOINT, {
        method: 'POST',
        headers: {
          'Authorization': `Key ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          image_url: input.file.signedUrl,
          prompt: input.prompt || 'Create a smooth video animation',
          // Convert duration to num_frames (duration * fps)
          num_frames: Math.min(121, Math.max(17, (input.duration || 4) * 16)),
          frames_per_second: 16,
          resolution: '720p',
          aspect_ratio: 'auto',
          enable_safety_checker: false,
          acceleration: 'regular',
          video_quality: 'high',
          sync: false // Force async mode for Vercel
        }),
        signal: createTimeoutSignal(15000) // 15 seconds for async submission (Vercel safe)
      })

      const submitTime = Date.now() - startTime
      console.log(`[${new Date().toISOString()}] FAL API response received: ${submitTime}ms`)
      
      // Log response details (structured for Vercel logs)
      console.log(`[${new Date().toISOString()}] FAL API Response:`, {
        status: response.status,
        statusText: response.statusText,
        contentType: response.headers.get('content-type'),
        requestId: response.headers.get('x-request-id')
      })

      if (!response.ok) {
        const error = await response.text()
        const errorDetails = {
          status: response.status,
          statusText: response.statusText,
          errorBody: error,
          headers: Object.fromEntries(response.headers.entries())
        }
        console.error(`[${new Date().toISOString()}] FAL async submission failed:`, errorDetails)
        
        // User-friendly error messages
        if (response.status === 401 || response.status === 403) {
          throw new Error('Authentication failed - please check your FAL API key')
        } else if (response.status === 422) {
          throw new Error(`Invalid request: ${error}`)
        } else if (response.status === 429) {
          throw new Error('Rate limit exceeded - please try again later')
        } else if (response.status >= 500) {
          throw new Error('FAL service temporarily unavailable - please try again')
        } else {
          throw new Error(`Request failed with status ${response.status}: ${error}`)
        }
      }

      const result = await response.json()
      // Log structured response for Vercel analytics
      const totalTime = Date.now() - startTime
      console.log(`[${new Date().toISOString()}] FAL async job submitted:`, {
        hasRequestId: !!result.request_id,
        status: result.status,
        totalTime: `${totalTime}ms`
      })

      // Check if we got immediate result (sometimes happens with very simple requests)
      if (result.video?.url) {
        console.log(`[${new Date().toISOString()}] Got immediate video result`)
        return {
          kind: 'immediate',
          output: {
            type: 'video',
            url: result.video.url,
            format: 'mp4',
            width: 1280,
            height: 720,
            duration_s: input.duration || 4,
            provider: 'lucy14b',
            model: FAL_MODEL_ID,
            prompt: result.prompt || input.prompt || '',
          } as Lucy14bOutput
        }
      }

      // Validate async response - should have request_id
      if (!result.request_id) {
        console.error(`[${new Date().toISOString()}] FAL API missing request_id:`, {
          responseKeys: Object.keys(result),
          hasStatus: !!result.status
        })
        throw new Error('FAL API did not return request_id - async submission failed')
      }

      console.log(`[${new Date().toISOString()}] Async job queued successfully - will poll for results`)
      return {
        kind: 'deferred',
        providerJobId: result.request_id
      }

    } catch (error) {
      const totalTime = Date.now() - startTime
      
      if (error instanceof Error && error.name === 'TimeoutError') {
        console.error(`[${new Date().toISOString()}] FAL async submission timeout:`, {
          timeoutAfter: `${totalTime}ms`,
          maxTimeout: '15 seconds',
          suggestion: 'FAL API may be overloaded or not responding'
        })
        throw new Error('FAL API submission timeout - service may be overloaded. Please try again in a few minutes.')
      }

      console.error(`[${new Date().toISOString()}] Lucy14b async submission failed:`, {
        error: error instanceof Error ? error.message : 'Unknown error',
        errorName: error instanceof Error ? error.name : 'Unknown',
        totalTime: `${totalTime}ms`,
        input: {
          promptLength: input.prompt?.length || 0,
          duration: input.duration,
          fileSize: input.file?.size
        }
      })
      throw error
    }
  }

  async result(jobId: string, input?: Lucy14bInput): Promise<ProviderStatusResult> {
    if (!jobId) {
      return { status: 'failed', error: 'No job ID' }
    }

    const startTime = Date.now()
    console.log('🔍 Lucy14b: Checking job status', {
      jobId: jobId,
      statusUrl: `${FAL_ENDPOINT}/requests/${jobId}`,
      timestamp: new Date().toISOString()
    })

    const apiKey = process.env.FAL_API_KEY || process.env.FAL_KEY
    const statusUrl = `${FAL_ENDPOINT}/requests/${jobId}`

    try {
      const response = await fetch(statusUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Key ${apiKey}`,
        },
        signal: AbortSignal.timeout(8000) // 8 seconds for status check
      })

      const checkTime = Date.now() - startTime
      
      // Log response details
      console.log('📊 Status check response:', {
        status: response.status,
        statusText: response.statusText,
        checkTime: `${checkTime}ms`,
        headers: {
          'content-type': response.headers.get('content-type'),
          'x-request-id': response.headers.get('x-request-id')
        }
      })
      
      if (response.status === 404) {
        console.log(`⏳ Job still queued/processing (${checkTime}ms) - this is normal for new jobs`)
        return { status: 'running' }
      }

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`❌ FAL status check failed (${checkTime}ms):`, {
          status: response.status,
          statusText: response.statusText,
          errorBody: errorText,
          jobId: jobId
        })
        return { status: 'running' } // Keep trying
      }

      const data = await response.json()
      
      // Log detailed status information
      console.log('📋 Job status details:', {
        status: data.status,
        progress: data.progress,
        checkTime: `${checkTime}ms`,
        hasVideo: !!data.video?.url,
        hasError: !!data.error,
        responseKeys: Object.keys(data)
      })

      // Video is ready!
      if (data.status === 'COMPLETED' && data.video?.url) {
        console.log('🎬 Video completed!', {
          url: data.video.url.substring(0, 50) + '...',
          duration: data.video.duration,
          checkTime: `${checkTime}ms`
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
            model: 'fal-ai/wan/v2.2-a14b/image-to-video',
            prompt: input?.prompt || '',
          } as Lucy14bOutput
        }
      }

      // Job failed
      if (data.status === 'FAILED' || data.status === 'ERROR') {
        console.error('💥 Job failed with detailed info:', {
          status: data.status,
          error: data.error,
          checkTime: `${checkTime}ms`,
          jobId: jobId,
          fullResponse: data
        })
        return {
          status: 'failed',
          error: data.error || `Video generation failed with status: ${data.status}`
        }
      }

      // Still processing - show progress if available
      const progress = data.progress ? ` (${Math.round(data.progress * 100)}%)` : ''
      console.log(`⏳ Processing${progress} (${checkTime}ms)`)
      return { status: 'running' }

    } catch (error) {
      const checkTime = Date.now() - startTime
      
      if (error instanceof Error && error.name === 'TimeoutError') {
        console.error(`⏱️ Status check timeout (${checkTime}ms):`, {
          jobId: jobId,
          timeout: '8 seconds',
          suggestion: 'FAL API may be slow to respond'
        })
        return { status: 'running' } // Keep trying
      }

      console.error(`❌ Status check error (${checkTime}ms):`, {
        error: error instanceof Error ? error.message : 'Unknown error',
        errorName: error instanceof Error ? error.name : 'Unknown',
        jobId: jobId,
        statusUrl: `${FAL_ENDPOINT}/requests/${jobId}`
      })
      return { status: 'running' } // Keep trying
    }
  }
}