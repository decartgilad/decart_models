import { supabaseAdmin } from './server/supabase'
import { STORAGE_CONFIG } from './server/constants'

export interface SignedUrlResult {
  signedUrl: string | null
  error?: string
}

// Generate a signed URL for a storage path
export async function createSignedUrl(path: string, expiresIn: number = STORAGE_CONFIG.SIGNED_URL_EXPIRES_IN): Promise<SignedUrlResult> {
  try {
    const { data, error } = await supabaseAdmin.storage
      .from(STORAGE_CONFIG.BUCKET_NAME)
      .createSignedUrl(path, expiresIn)

    if (error) {
      return { signedUrl: null, error: error.message }
    }

    return { signedUrl: data.signedUrl }
  } catch (error) {
    return { 
      signedUrl: null, 
      error: error instanceof Error ? error.message : 'Failed to create signed URL'
    }
  }
}

// Generate a unique file path with date and UUID
export function generateFilePath(originalName: string): string {
  const now = new Date()
  const dateFolder = now.toISOString().slice(0, 10).replace(/-/g, '') // yyyymmdd
  const uuid = crypto.randomUUID()
  const extension = originalName.split('.').pop()?.toLowerCase() || 'bin'
  
  return `${dateFolder}/${uuid}.${extension}`
}

// Validate file type and size
export function validateFile(file: File): { isValid: boolean; error?: string } {
  // Check file size
  if (file.size > 10 * 1024 * 1024) { // 10 MB
    return { 
      isValid: false, 
      error: `File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum size is 10MB.` 
    }
  }

  // Check file type
  const allowedTypes = ['image/png', 'image/jpeg']
  if (!allowedTypes.includes(file.type)) {
    return { 
      isValid: false, 
      error: `Invalid file type (${file.type}). Allowed types: PNG, JPEG.` 
    }
  }

  return { isValid: true }
}
