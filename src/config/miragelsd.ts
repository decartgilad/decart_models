/**
 * MirageLSD - Video to Video Transformation Model
 * High-quality video transformation via Mirage API
 * Transforms videos with AI-powered processing using text prompts
 */

import { AIProvider, ProviderRunResult, ProviderStatusResult } from '@/lib/providers'

// Configuration
export const MIRAGELSD_CONFIG = {
  id: 'miragelsd',
  name: 'MirageLSD',
  api: {
    endpoint: 'https://bouncer.staging.mirage.decart.ai/process_video',
    timeout: 600000, // 10 minutes - video processing can take longer
  },
  limits: {
    maxFileSizeMB: 200, // Larger limit for video processing
    maxPromptLength: 1000,
    supportedFormats: ['mp4', 'avi', 'mov', 'mkv', 'webm'],
    orientations: {
      landscape: { width: 1280, height: 704 },
      portrait: { width: 704, height: 1280 }
    }
  }
} as const

// Types
export interface MirageLSDInput {
  type: 'video-to-video'
  modelCode: 'MirageLSD' // Must match the model.code from database
  prompt: string
  generationsCount?: number // Optional, default = 1
  file: {
    path: string
    signedUrl: string | null
    mime: string
    size: number
    originalName?: string
  }
}

export interface MirageLSDOutput {
  type: 'video'
  url: string
  format: 'mp4'
  width: number
  height: number
  provider: string
  model: string
  prompt: string
  generationsCount: number
}

// Validation
function validateInput(input: unknown): { valid: boolean; error?: string } {
  console.log('🔍 MirageLSD: Validating input', {
    hasFile: !!input.file,
    hasSignedUrl: !!input.file?.signedUrl,
    fileSize: input.file?.size,
    promptLength: input.prompt?.length || 0,
    modelCode: input.modelCode,
    generationsCount: input.generationsCount
  })

  // Check model code
  if (input.modelCode !== 'MirageLSD') {
    return { valid: false, error: `Invalid model code: ${input.modelCode}. Expected: MirageLSD` }
  }

  // Check file
  if (!input.file?.signedUrl) return { valid: false, error: 'Video file with signed URL required' }
  
  // Check file size
  const fileSizeMB = input.file.size / (1024 * 1024)
  if (fileSizeMB > MIRAGELSD_CONFIG.limits.maxFileSizeMB) {
    return { valid: false, error: `File too large (${fileSizeMB.toFixed(1)}MB max ${MIRAGELSD_CONFIG.limits.maxFileSizeMB}MB)` }
  }
  
  // Check file type - only video files for MirageLSD
  const allowedVideoTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/quicktime', 'video/x-msvideo', 'video/webm']
  
  if (!allowedVideoTypes.includes(input.file.mime)) {
    return { valid: false, error: `Unsupported file type: ${input.file.mime}. Allowed: ${allowedVideoTypes.join(', ')}` }
  }
  
  // Check prompt
  if (!input.prompt || input.prompt.trim().length === 0) {
    return { valid: false, error: 'Prompt is required for video transformation' }
  }
  
  if (input.prompt.length > MIRAGELSD_CONFIG.limits.maxPromptLength) {
    return { valid: false, error: `Prompt too long (max ${MIRAGELSD_CONFIG.limits.maxPromptLength} chars)` }
  }
  
  // Check generationsCount (optional, defaults to 1)
  if (input.generationsCount !== undefined) {
    if (!Number.isInteger(input.generationsCount) || input.generationsCount < 1 || input.generationsCount > 10) {
      return { valid: false, error: 'generationsCount must be an integer between 1 and 10' }
    }
  }
  
  console.log('✅ MirageLSD: Input validation passed')
  return { valid: true }
}

// Environment check
export function isConfigured(): boolean {
  // MirageLSD API doesn't require authentication according to requirements
  const configured = true
  
  console.log('🔧 MirageLSD: Environment check', {
    configured,
    apiEndpoint: MIRAGELSD_CONFIG.api.endpoint
  })
  
  return configured
}

// Utility functions
function getOutputDimensions(orientation: string) {
  return MIRAGELSD_CONFIG.limits.orientations[orientation as keyof typeof MIRAGELSD_CONFIG.limits.orientations] || MIRAGELSD_CONFIG.limits.orientations.landscape
}

// Detect orientation from file dimensions (server-side compatible)
async function detectFileOrientation(signedUrl: string, mimeType: string): Promise<'landscape' | 'portrait'> {
  console.log('🔍 MirageLSD: Detecting file orientation...', { mimeType, url: signedUrl.substring(0, 100) + '...' })
  
  try {
    // Fetch only the first part of the file for metadata analysis (more efficient)
    const response = await fetch(signedUrl, {
      headers: {
        'Range': 'bytes=0-65535' // First 64KB should contain metadata
      }
    })
    
    if (!response.ok) {
      console.warn('⚠️ MirageLSD: Could not fetch file for dimension analysis, defaulting to landscape')
      return 'landscape'
    }
    
    const buffer = await response.arrayBuffer()
    const uint8Array = new Uint8Array(buffer)
    
    console.log('📦 MirageLSD: Fetched buffer size:', buffer.byteLength, 'bytes')
    
    // Try MP4 dimension detection
    const dimensions = parseMP4Dimensions(uint8Array)
    if (dimensions) {
      const aspectRatio = dimensions.width / dimensions.height
      const orientation = aspectRatio > 1 ? 'landscape' : 'portrait'
      
      console.log('📐 MirageLSD: Video dimensions detected', {
        width: dimensions.width,
        height: dimensions.height,
        aspectRatio: aspectRatio.toFixed(2),
        orientation,
        reasoning: aspectRatio > 1 ? 'width > height = landscape' : 'height >= width = portrait'
      })
      
      return orientation
    }
    
    // If we can't detect dimensions, default to landscape
    console.warn('⚠️ MirageLSD: Could not detect file dimensions, defaulting to landscape')
    return 'landscape'
    
  } catch (error) {
    console.warn('⚠️ MirageLSD: Error detecting file orientation, defaulting to landscape', error)
    return 'landscape'
  }
}

// MP4 dimension parser (reused from Splice)
function parseMP4Dimensions(buffer: Uint8Array): { width: number; height: number } | null {
  try {
    console.log('🔍 Parsing MP4 dimensions from buffer of size:', buffer.length)
    
    // Look for 'tkhd' atom which contains track header with dimensions
    for (let i = 0; i < buffer.length - 84; i++) {
      if (buffer[i] === 0x74 && buffer[i + 1] === 0x6b && 
          buffer[i + 2] === 0x68 && buffer[i + 3] === 0x64) { // 'tkhd'
        
        console.log('📍 Found tkhd atom at position:', i)
        
        // tkhd atom structure varies, try multiple offset positions
        const offsets = [76, 80, 84] // Different versions have different layouts
        
        for (const baseOffset of offsets) {
          const offset = i + baseOffset
          if (offset + 8 <= buffer.length) {
            // Try big-endian 32-bit integers for width/height
            const width = (buffer[offset] << 24) | (buffer[offset + 1] << 16) | 
                         (buffer[offset + 2] << 8) | buffer[offset + 3]
            const height = (buffer[offset + 4] << 24) | (buffer[offset + 5] << 16) | 
                          (buffer[offset + 6] << 8) | buffer[offset + 7]
            
            console.log(`🔢 Trying offset ${baseOffset}: width=${width}, height=${height}`)
            
            if (width > 0 && height > 0 && width < 10000 && height < 10000) {
              console.log('✅ Valid dimensions found:', { width, height })
              return { width, height }
            }
          }
        }
      }
    }
    
    console.log('❌ No valid MP4 dimensions found')
  } catch (error) {
    console.warn('Error parsing MP4 dimensions:', error)
  }
  return null
}

// Convert file to multipart/form-data for Mirage API
async function fileToFormData(signedUrl: string, prompt: string, generationsCount: number = 1): Promise<FormData> {
  console.log('🔄 MirageLSD: Converting file to FormData', { 
    url: signedUrl.substring(0, 80) + '...',
    prompt: prompt.substring(0, 50) + '...',
    generationsCount
  })
  
  const response = await fetch(signedUrl)
  if (!response.ok) {
    throw new Error(`Failed to fetch file: ${response.statusText}`)
  }
  
  const blob = await response.blob()
  const formData = new FormData()
  
  // Add required fields according to API spec
  formData.append('video', blob, 'video.mp4')
  formData.append('prompt', prompt)
  formData.append('generationsCount', generationsCount.toString())
  
  return formData
}

// Provider Implementation
export class MirageLSDProvider implements AIProvider {
  name = 'miragelsd'

  async run(input: MirageLSDInput): Promise<ProviderRunResult> {
    const validation = validateInput(input)
    if (!validation.valid) {
      throw new Error(validation.error)
    }

    const jobId = `miragelsd_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
    console.log('🚀 MirageLSD: Job queued', { 
      jobId, 
      hasFile: !!input.file,
      promptLength: input.prompt.length,
      generationsCount: input.generationsCount || 1
    })
    
    return { kind: 'deferred', providerJobId: jobId }
  }

  async result(jobId: string, input?: MirageLSDInput): Promise<ProviderStatusResult> {
    if (!jobId.startsWith('miragelsd_') || !input) {
      return { status: 'running' }
    }

    try {
      // Auto-detect orientation from file
      const detectedOrientation = await detectFileOrientation(input.file.signedUrl!, input.file.mime)
      const dimensions = getOutputDimensions(detectedOrientation)
      const generationsCount = input.generationsCount || 1
      
      console.log('🎯 MirageLSD: Processing with parameters', {
        orientation: detectedOrientation,
        dimensions,
        generationsCount
      })
      
      // Convert file to FormData for multipart/form-data request
      const formData = await fileToFormData(input.file.signedUrl!, input.prompt, generationsCount)
      
      console.log('📡 MirageLSD: Calling Mirage API', {
        url: MIRAGELSD_CONFIG.api.endpoint,
        promptLength: input.prompt.length,
        generationsCount
      })
      
      const response = await fetch(MIRAGELSD_CONFIG.api.endpoint, {
        method: 'POST',
        body: formData,
        signal: AbortSignal.timeout(MIRAGELSD_CONFIG.api.timeout)
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ MirageLSD: Mirage API Error Response', {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
          body: errorText
        })
        throw new Error(`Mirage API error (${response.status}): ${errorText}`)
      }

      // The API returns the processed video as binary data
      const processedVideoBlob = await response.blob()
      
      // Save the processed video to Supabase Storage
      const outputFilePath = `output_model/out_${jobId}.mp4`
      const fileBuffer = await processedVideoBlob.arrayBuffer()
      
      // Upload processed video to storage
      const { supabaseAdmin } = await import('@/lib/server/supabase')
      const { createSignedUrl } = await import('@/lib/storage')
      const { STORAGE_CONFIG } = await import('@/lib/server/constants')
      
      const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
        .from(STORAGE_CONFIG.BUCKET_NAME)
        .upload(outputFilePath, fileBuffer, {
          contentType: 'video/mp4',
          upsert: true // Allow overwrite if exists
        })

      if (uploadError) {
        console.error('❌ MirageLSD: Failed to save processed video', uploadError)
        throw new Error(`Failed to save processed video: ${uploadError.message}`)
      }

      // Create signed URL for the processed video
      const signedUrlResult = await createSignedUrl(outputFilePath)
      if (signedUrlResult.error) {
        console.error('❌ MirageLSD: Failed to create signed URL for processed video', signedUrlResult.error)
        throw new Error(`Failed to create video URL: ${signedUrlResult.error}`)
      }
      
      // Build result_url as specified in requirements
      const result_url = `http://localhost:3333/output_model/out_${jobId.replace('miragelsd_', '')}.mp4`
      
      console.log('✅ MirageLSD: Video processed and saved successfully', {
        outputPath: outputFilePath,
        resultUrl: result_url
      })
      
      return {
        status: 'succeeded',
        output: {
          type: 'video',
          url: signedUrlResult.signedUrl!,
          result_url, // Additional field as per API spec
          format: 'mp4',
          width: dimensions.width,
          height: dimensions.height,
          provider: 'miragelsd',
          model: 'mirage',
          prompt: input.prompt,
          generationsCount
        } as MirageLSDOutput
      }

    } catch (error) {
      console.error('❌ MirageLSD: Processing failed', error)
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          return {
            status: 'failed',
            error: 'Video processing timed out. Please try again with a smaller video.'
          }
        }
        return {
          status: 'failed',
          error: error.message.includes('timeout') 
            ? 'Video processing is taking longer than expected. Please try again.'
            : `Video processing failed: ${error.message}`
        }
      }
      
      return {
        status: 'failed',
        error: 'Unknown error occurred during video processing'
      }
    }
  }
}
