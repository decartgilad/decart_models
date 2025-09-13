/**
 * Lucy 14B - Image to Video Model (Vercel Optimized)
 * Simple, direct integration with FAL AI for Vercel serverless functions
 */

import { AIProvider, ProviderRunResult, ProviderStatusResult } from '@/lib/providers'

// Simple configuration optimized for Vercel
const FAL_ENDPOINT = 'https://fal.run/fal-ai/wan/v2.2-a14b/image-to-video'

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
}

// Simple validation
function isValidInput(input: any): boolean {
  return input?.modelCode === 'Lucy14b' && 
         input?.file?.signedUrl &&
         input?.file?.size < 10 * 1024 * 1024 // 10MB max
}

// Environment check
export function isConfigured(): boolean {
  const apiKey = process.env.FAL_API_KEY || process.env.FAL_KEY
  return !!apiKey
}

// Vercel-optimized Provider Implementation
export class Lucy14bProvider implements AIProvider {
  name = 'lucy14b'

  async run(input: Lucy14bInput): Promise<ProviderRunResult> {
    console.log('🚀 Lucy14b: Starting video generation', { 
      prompt: input.prompt,
      fileSize: input.file?.size 
    })

    // Quick validation
    if (!isConfigured()) {
      throw new Error('FAL API key not configured')
    }

    if (!isValidInput(input)) {
      throw new Error('Invalid input - check file and model code')
    }

    const apiKey = process.env.FAL_API_KEY || process.env.FAL_KEY

    try {
      // Direct FAL API call - no complex logic
      const response = await fetch(FAL_ENDPOINT, {
        method: 'POST',
        headers: {
          'Authorization': `Key ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          image_url: input.file.signedUrl,
          prompt: input.prompt || 'Create a smooth video animation',
          duration: input.duration || 4,
          enable_safety_checker: false,
          sync: false // Async mode
        })
      })

      if (!response.ok) {
        const error = await response.text()
        console.error('❌ FAL API error:', response.status, error)
        throw new Error(`FAL API failed: ${response.status}`)
      }

      const result = await response.json()
      console.log('✅ FAL job created:', result.request_id)

      if (!result.request_id) {
        throw new Error('FAL API did not return request_id')
      }

      return { 
        kind: 'deferred', 
        providerJobId: result.request_id 
      }

    } catch (error) {
      console.error('❌ Lucy14b submission failed:', error)
      throw error
    }
  }

  async result(jobId: string, input?: Lucy14bInput): Promise<ProviderStatusResult> {
    if (!jobId) {
      return { status: 'failed', error: 'No job ID' }
    }

    console.log('🔍 Lucy14b: Checking status for job:', jobId)

    const apiKey = process.env.FAL_API_KEY || process.env.FAL_KEY
    const statusUrl = `${FAL_ENDPOINT}/requests/${jobId}`

    try {
      const response = await fetch(statusUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Key ${apiKey}`,
        }
      })

      if (response.status === 404) {
        console.log('⏳ Job not found yet, still processing...')
        return { status: 'running' }
      }

      if (!response.ok) {
        console.error('❌ FAL status check failed:', response.status)
        return { status: 'running' } // Keep trying
      }

      const data = await response.json()
      console.log('📊 Job status:', data.status)

      // Video is ready!
      if (data.status === 'COMPLETED' && data.video?.url) {
        console.log('🎬 Video ready!', data.video.url)
        
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
        console.error('💥 Job failed:', data.error)
        return {
          status: 'failed',
          error: data.error || 'Video generation failed'
        }
      }

      // Still processing
      return { status: 'running' }

    } catch (error) {
      console.error('❌ Status check error:', error)
      return { status: 'running' } // Keep trying
    }
  }
}