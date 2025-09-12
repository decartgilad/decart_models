/**
 * Splice - Video to Video Transformation Model
 * High-quality video transformation via Decart AI API
 * Transforms videos with AI-powered character replacement and scene modification
 */

import { AIProvider, ProviderRunResult, ProviderStatusResult } from '@/lib/providers'

// Configuration
export const SPLICE_CONFIG = {
  id: 'splice',
  name: 'Splice',
  api: {
    endpoint: 'https://cdn.api.decart.ai/vid2vid/process',
    timeout: 300000, // 5 minutes - video processing can take time
  },
  limits: {
    maxFileSizeMB: 100,
    maxPromptLength: 1000,
    supportedFormats: ['mp4', 'avi', 'mov', 'mkv', 'webm'],
    orientations: {
      landscape: { width: 1280, height: 704 },
      portrait: { width: 704, height: 1280 }
    }
  }
} as const

// Types
export interface SpliceInput {
  type: 'video-to-video'
  modelCode: 'Splice' // Must match the model.code from database
  prompt: string
  orientation?: 'landscape' | 'portrait'
  enhance_prompt?: boolean
  file: {
    path: string
    signedUrl: string | null
    mime: string
    size: number
    originalName?: string
  }
}

export interface SpliceOutput {
  type: 'video'
  url: string
  format: 'mp4'
  width: number
  height: number
  provider: string
  model: string
  prompt: string
  orientation: string
}

// Validation
function validateInput(input: any): { valid: boolean; error?: string } {
  console.log('🔍 Splice: Validating input', {
    hasFile: !!input.file,
    hasSignedUrl: !!input.file?.signedUrl,
    fileSize: input.file?.size,
    promptLength: input.prompt?.length || 0,
    modelCode: input.modelCode,
    orientation: input.orientation
  })

  // Check model code
  if (input.modelCode !== 'Splice') {
    return { valid: false, error: `Invalid model code: ${input.modelCode}. Expected: Splice` }
  }

  // Check file
  if (!input.file?.signedUrl) return { valid: false, error: 'Video file with signed URL required' }
  
  // Check file size
  const fileSizeMB = input.file.size / (1024 * 1024)
  if (fileSizeMB > SPLICE_CONFIG.limits.maxFileSizeMB) {
    return { valid: false, error: `File too large (${fileSizeMB.toFixed(1)}MB max ${SPLICE_CONFIG.limits.maxFileSizeMB}MB)` }
  }
  
  // Check file type - support both video and image files for flexibility
  const allowedVideoTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/quicktime', 'video/x-msvideo', 'video/webm']
  const allowedImageTypes = ['image/png', 'image/jpeg', 'image/webp'] // Allow images for video-from-image
  const allowedTypes = [...allowedVideoTypes, ...allowedImageTypes]
  
  if (!allowedTypes.includes(input.file.mime)) {
    return { valid: false, error: `Unsupported file type: ${input.file.mime}. Allowed: ${allowedTypes.join(', ')}` }
  }
  
  // Check prompt
  if (!input.prompt || input.prompt.trim().length === 0) {
    return { valid: false, error: 'Prompt is required for video transformation' }
  }
  
  if (input.prompt.length > SPLICE_CONFIG.limits.maxPromptLength) {
    return { valid: false, error: `Prompt too long (max ${SPLICE_CONFIG.limits.maxPromptLength} chars)` }
  }
  
  // Check orientation (optional, defaults to landscape)
  if (input.orientation && !['landscape', 'portrait'].includes(input.orientation)) {
    return { valid: false, error: 'Orientation must be either "landscape" or "portrait"' }
  }
  
  console.log('✅ Splice: Input validation passed')
  return { valid: true }
}

// Environment check
export function isConfigured(): boolean {
  const hasApiKey = !!process.env.DECART_API_KEY
  
  console.log('🔧 Splice: Environment check', {
    hasApiKey,
    apiKeyPrefix: process.env.DECART_API_KEY ? `${process.env.DECART_API_KEY.substring(0, 10)}...` : 'missing',
    configured: hasApiKey
  })
  
  return hasApiKey
}

// Utility functions
function getOutputDimensions(orientation: string) {
  return SPLICE_CONFIG.limits.orientations[orientation as keyof typeof SPLICE_CONFIG.limits.orientations] || SPLICE_CONFIG.limits.orientations.landscape
}

// Detect orientation from file dimensions (server-side compatible)
async function detectFileOrientation(signedUrl: string, mimeType: string): Promise<'landscape' | 'portrait'> {
  console.log('🔍 Splice: Detecting file orientation...', { mimeType, url: signedUrl.substring(0, 100) + '...' })
  
  try {
    // Fetch only the first part of the file for metadata analysis (more efficient)
    const response = await fetch(signedUrl, {
      headers: {
        'Range': 'bytes=0-65535' // First 64KB should contain metadata
      }
    })
    
    if (!response.ok) {
      console.warn('⚠️ Splice: Could not fetch file for dimension analysis, defaulting to landscape')
      return 'landscape'
    }
    
    const buffer = await response.arrayBuffer()
    const uint8Array = new Uint8Array(buffer)
    
    console.log('📦 Splice: Fetched buffer size:', buffer.byteLength, 'bytes')
    
    if (mimeType.startsWith('video/')) {
      // Try MP4 dimension detection
      const dimensions = parseMP4Dimensions(uint8Array)
      if (dimensions) {
        const aspectRatio = dimensions.width / dimensions.height
        const orientation = aspectRatio > 1 ? 'landscape' : 'portrait'
        
        console.log('📐 Splice: Video dimensions detected', {
          width: dimensions.width,
          height: dimensions.height,
          aspectRatio: aspectRatio.toFixed(2),
          orientation,
          reasoning: aspectRatio > 1 ? 'width > height = landscape' : 'height >= width = portrait'
        })
        
        return orientation
      }
    } else if (mimeType.startsWith('image/')) {
      // Basic image dimension detection
      const dimensions = parseImageDimensions(uint8Array, mimeType)
      if (dimensions) {
        const aspectRatio = dimensions.width / dimensions.height
        const orientation = aspectRatio > 1 ? 'landscape' : 'portrait'
        
        console.log('📐 Splice: Image dimensions detected', {
          width: dimensions.width,
          height: dimensions.height,
          aspectRatio: aspectRatio.toFixed(2),
          orientation,
          reasoning: aspectRatio > 1 ? 'width > height = landscape' : 'height >= width = portrait'
        })
        
        return orientation
      }
    }
    
    // If we can't detect dimensions, try to infer from filename or default to portrait for mobile videos
    console.warn('⚠️ Splice: Could not detect file dimensions')
    
    // Simple heuristic: if it's a video and we can't detect dimensions, 
    // assume it might be mobile (portrait) format
    if (mimeType.startsWith('video/')) {
      console.log('📱 Splice: Defaulting to portrait for undetected video (mobile assumption)')
      return 'portrait'
    }
    
    console.log('🖼️ Splice: Defaulting to landscape for undetected image')
    return 'landscape'
    
  } catch (error) {
    console.warn('⚠️ Splice: Error detecting file orientation, defaulting to portrait for videos', error)
    // Default to portrait for videos (mobile-first assumption)
    return mimeType.startsWith('video/') ? 'portrait' : 'landscape'
  }
}

// Improved MP4 dimension parser
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
    
    // Alternative: Look for 'mvhd' atom (movie header)
    for (let i = 0; i < buffer.length - 32; i++) {
      if (buffer[i] === 0x6d && buffer[i + 1] === 0x76 && 
          buffer[i + 2] === 0x68 && buffer[i + 3] === 0x64) { // 'mvhd'
        console.log('📍 Found mvhd atom at position:', i)
        // mvhd doesn't contain dimensions, but we can continue looking
      }
    }
    
    console.log('❌ No valid MP4 dimensions found')
  } catch (error) {
    console.warn('Error parsing MP4 dimensions:', error)
  }
  return null
}

// Simple image dimension parser
function parseImageDimensions(buffer: Uint8Array, mimeType: string): { width: number; height: number } | null {
  try {
    if (mimeType === 'image/jpeg') {
      // JPEG dimension parsing - look for SOF0 marker
      for (let i = 0; i < buffer.length - 10; i++) {
        if (buffer[i] === 0xFF && buffer[i + 1] === 0xC0) { // SOF0 marker
          const height = (buffer[i + 5] << 8) | buffer[i + 6]
          const width = (buffer[i + 7] << 8) | buffer[i + 8]
          if (width > 0 && height > 0) {
            return { width, height }
          }
        }
      }
    } else if (mimeType === 'image/png') {
      // PNG dimension parsing - IHDR chunk
      if (buffer.length >= 24 && 
          buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) { // PNG signature
        const width = (buffer[16] << 24) | (buffer[17] << 16) | (buffer[18] << 8) | buffer[19]
        const height = (buffer[20] << 24) | (buffer[21] << 16) | (buffer[22] << 8) | buffer[23]
        if (width > 0 && height > 0) {
          return { width, height }
        }
      }
    }
  } catch (error) {
    console.warn('Error parsing image dimensions:', error)
  }
  return null
}

async function fileToBase64(signedUrl: string): Promise<string> {
  console.log('🔄 Splice: Converting file to base64', { url: signedUrl.substring(0, 80) + '...' })
  
  const response = await fetch(signedUrl)
  if (!response.ok) {
    throw new Error(`Failed to fetch file: ${response.statusText}`)
  }
  
  const buffer = await response.arrayBuffer()
  const base64 = Buffer.from(buffer).toString('base64')
  
  return base64
}

// Provider Implementation
export class SpliceProvider implements AIProvider {
  name = 'splice'

  async run(input: SpliceInput): Promise<ProviderRunResult> {
    if (!isConfigured()) {
      throw new Error('Splice not configured - missing DECART_API_KEY')
    }

    const validation = validateInput(input)
    if (!validation.valid) {
      throw new Error(validation.error)
    }

    const jobId = `splice_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
    console.log('🚀 Splice: Job queued', { 
      jobId, 
      hasFile: !!input.file,
      orientation: input.orientation || 'landscape',
      promptLength: input.prompt.length 
    })
    
    return { kind: 'deferred', providerJobId: jobId }
  }

  async result(jobId: string, input?: SpliceInput): Promise<ProviderStatusResult> {
    if (!jobId.startsWith('splice_') || !input) {
      return { status: 'running' }
    }

    try {
      // Auto-detect orientation from file if not explicitly provided
      const detectedOrientation = await detectFileOrientation(input.file.signedUrl!, input.file.mime)
      const orientation = input.orientation || detectedOrientation
      const dimensions = getOutputDimensions(orientation)
      
      console.log('🎯 Splice: Using orientation', {
        provided: input.orientation,
        detected: detectedOrientation,
        final: orientation,
        dimensions
      })
      
      // Convert file to base64
      const fileBase64 = await fileToBase64(input.file.signedUrl!)
      
      const payload = {
        prompt: input.prompt,
        video_base64: fileBase64, // Works for both video and image inputs
        enhance_prompt: input.enhance_prompt ?? true,
        ...dimensions
      }

      console.log('📡 Splice: Calling Decart API', {
        url: SPLICE_CONFIG.api.endpoint,
        hasApiKey: !!process.env.DECART_API_KEY,
        apiKeyPrefix: process.env.DECART_API_KEY ? `${process.env.DECART_API_KEY.substring(0, 10)}...` : 'missing',
        orientation,
        dimensions,
        promptLength: input.prompt.length
      })
      
      const response = await fetch(SPLICE_CONFIG.api.endpoint, {
        method: 'POST',
        headers: {
          'X-API-KEY': process.env.DECART_API_KEY!,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(SPLICE_CONFIG.api.timeout)
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ Splice: Decart API Error Response', {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
          body: errorText
        })
        throw new Error(`Decart API error (${response.status}): ${errorText}`)
      }

      // The API returns the processed video as binary data
      const processedVideoBlob = await response.blob()
      
      // Save the processed video to Supabase Storage
      const outputFilePath = `processed/${jobId}.mp4`
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
        console.error('❌ Splice: Failed to save processed video', uploadError)
        throw new Error(`Failed to save processed video: ${uploadError.message}`)
      }

      // Create signed URL for the processed video
      const signedUrlResult = await createSignedUrl(outputFilePath)
      if (signedUrlResult.error) {
        console.error('❌ Splice: Failed to create signed URL for processed video', signedUrlResult.error)
        throw new Error(`Failed to create video URL: ${signedUrlResult.error}`)
      }
      
      console.log('✅ Splice: Video processed and saved successfully')
      return {
        status: 'succeeded',
        output: {
          type: 'video',
          url: signedUrlResult.signedUrl!,
          format: 'mp4',
          width: dimensions.width,
          height: dimensions.height,
          provider: 'splice',
          model: 'vid2vid',
          prompt: input.prompt,
          orientation
        } as SpliceOutput
      }

    } catch (error) {
      console.error('❌ Splice: Processing failed', error)
      
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
