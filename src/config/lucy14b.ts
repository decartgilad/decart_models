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
    if (!isConfigured()) {
      throw new Error('Lucy14b not configured - missing FAL_API_KEY')
    }

    const validation = validateInput(input)
    if (!validation.valid) {
      throw new Error(validation.error)
    }

    const jobId = `lucy14b_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
    console.log('🚀 Lucy14b: Job queued', { jobId, hasFile: !!input.file })
    
    return { kind: 'deferred', providerJobId: jobId }
  }

  async result(jobId: string, input?: Lucy14bInput): Promise<ProviderStatusResult> {
    if (!jobId.startsWith('lucy14b_') || !input) {
      return { status: 'running' }
    }

    try {
      const payload = {
        image_url: input.file.signedUrl,
        prompt: input.prompt || 'Generate smooth video from image',
        duration: input.duration || 4,
        enable_safety_checker: false,
      }

      const apiKey = process.env.FAL_API_KEY || process.env.FAL_KEY
      console.log('📡 Lucy14b: Calling FAL API', {
        url: `${LUCY14B_CONFIG.api.baseUrl}/${LUCY14B_CONFIG.api.endpoint}`,
        model: LUCY14B_CONFIG.api.endpoint,
        hasApiKey: !!apiKey,
        apiKeyPrefix: apiKey ? `${apiKey.substring(0, 10)}...` : 'missing',
        payload: {
          ...payload,
          image_url: payload.image_url ? `${payload.image_url.substring(0, 80)}...` : 'none'
        }
      })
      
      // Log the full image URL for debugging (be careful with this in production)
      console.log('🖼️ Lucy14b: Full image URL:', payload.image_url)
      
      const response = await fetch(`${LUCY14B_CONFIG.api.baseUrl}/${LUCY14B_CONFIG.api.endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Key ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(LUCY14B_CONFIG.api.timeout)
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ Lucy14b: FAL API Error Response', {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
          body: errorText
        })
        throw new Error(`FAL API error (${response.status}): ${errorText}`)
      }

      const data = await response.json()
      console.log('✅ Lucy14b: FAL API Response', data)
      
      // FAL returns the video immediately
      if (data.video?.url) {
        console.log('🎬 Lucy14b: Video generated successfully')
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
      } else {
        return {
          status: 'failed',
          error: 'Video generation completed but no video URL found'
        }
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