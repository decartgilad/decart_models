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
    const startTime = Date.now()
    console.log('🚀 Lucy14b: Quick async job submission', { 
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
      // FAST async submission with strict timeout
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
          sync: true // FAL doesn't work truly async - use sync mode
        }),
        signal: AbortSignal.timeout(50000) // 50 seconds for full video generation
      })

      const submitTime = Date.now() - startTime
      console.log(`⚡ FAL response in ${submitTime}ms`)

      if (!response.ok) {
        const error = await response.text()
        console.error('❌ FAL async submission failed:', response.status, error)
        throw new Error(`FAL API failed: ${response.status} - ${error}`)
      }

      const result = await response.json()
      console.log('✅ FAL sync generation completed:', {
        hasVideo: !!result.video?.url,
        videoUrl: result.video?.url?.substring(0, 50) + '...',
        totalTime: `${Date.now() - startTime}ms`
      })

      // In sync mode, we get the video directly
      if (result.video?.url) {
        return {
          kind: 'immediate',
          output: {
            type: 'video',
            url: result.video.url,
            format: 'mp4',
            width: result.video.width || 1280,
            height: result.video.height || 720,
            duration_s: input.duration || 4,
            provider: 'lucy14b',
            model: 'fal-ai/wan/v2.2-a14b/image-to-video',
            prompt: input.prompt || '',
          } as Lucy14bOutput
        }
      }

      console.error('❌ FAL sync mode missing video:', result)
      throw new Error('FAL sync generation failed - no video returned')

    } catch (error) {
      const totalTime = Date.now() - startTime
      
      if (error instanceof Error && error.name === 'TimeoutError') {
        console.error(`⏱️ FAL sync generation timed out after ${totalTime}ms`)
        throw new Error('Video generation took too long (>50 seconds)')
      }

      console.error('❌ Lucy14b sync generation failed:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        totalTime: `${totalTime}ms`
      })
      throw error
    }
  }

  async result(jobId: string, input?: Lucy14bInput): Promise<ProviderStatusResult> {
    if (!jobId) {
      return { status: 'failed', error: 'No job ID' }
    }

    const startTime = Date.now()
    console.log('🔍 Lucy14b: Fast status check for:', jobId)

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
      
      if (response.status === 404) {
        console.log(`⏳ Job queued/processing (${checkTime}ms)`)
        return { status: 'running' }
      }

      if (!response.ok) {
        console.error(`❌ FAL status error ${response.status} (${checkTime}ms)`)
        return { status: 'running' } // Keep trying
      }

      const data = await response.json()
      console.log(`📊 Job status: ${data.status} (${checkTime}ms)`)

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
        console.error('💥 Job failed:', {
          status: data.status,
          error: data.error,
          checkTime: `${checkTime}ms`
        })
        return {
          status: 'failed',
          error: data.error || 'Video generation failed'
        }
      }

      // Still processing - show progress if available
      const progress = data.progress ? ` (${Math.round(data.progress * 100)}%)` : ''
      console.log(`⏳ Processing${progress} (${checkTime}ms)`)
      return { status: 'running' }

    } catch (error) {
      const checkTime = Date.now() - startTime
      
      if (error instanceof Error && error.name === 'TimeoutError') {
        console.error(`⏱️ Status check timeout (${checkTime}ms)`)
        return { status: 'running' } // Keep trying
      }

      console.error(`❌ Status check error (${checkTime}ms):`, error)
      return { status: 'running' } // Keep trying
    }
  }
}