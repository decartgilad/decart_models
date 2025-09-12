import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/server/supabase'
import { 
  createErrorResponse, 
  logServerError, 
  generateRequestId 
} from '@/lib/server/server-utils'
import { INPUT_LIMITS, ALLOWED_MIME_TYPES, STORAGE_CONFIG } from '@/lib/server/constants'
import { createSignedUrl, generateFilePath } from '@/lib/storage'

// Force Node.js runtime for file uploads
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  const requestId = generateRequestId()
  const method = 'POST'
  const route = '/api/upload'

  try {
    // Parse multipart form data
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file || !(file instanceof File)) {
      logServerError(method, route, requestId, 'No file provided', 400)
      return createErrorResponse('No file provided', 'File field is required', 400)
    }

    // Validate file size
    if (file.size > INPUT_LIMITS.MAX_FILE_SIZE) {
      const sizeMB = (file.size / 1024 / 1024).toFixed(1)
      const maxSizeMB = (INPUT_LIMITS.MAX_FILE_SIZE / 1024 / 1024).toFixed(0)
      logServerError(method, route, requestId, `File too large: ${sizeMB}MB`, 400)
      return createErrorResponse(
        `File too large (${sizeMB}MB)`,
        `Maximum file size is ${maxSizeMB}MB`,
        400
      )
    }

    // Validate file type (allow both images and videos)
    if (!ALLOWED_MIME_TYPES.ALL.includes(file.type as any)) {
      logServerError(method, route, requestId, `Invalid file type: ${file.type}`, 400)
      return createErrorResponse(
        'Invalid file type',
        `Allowed types: ${ALLOWED_MIME_TYPES.ALL.join(', ')}`,
        400
      )
    }

    // Generate unique file path
    const filePath = generateFilePath(file.name)

    // Convert file to buffer
    const fileBuffer = await file.arrayBuffer()

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from(STORAGE_CONFIG.BUCKET_NAME)
      .upload(filePath, fileBuffer, {
        contentType: file.type,
        upsert: false
      })

    if (uploadError) {
      logServerError(method, route, requestId, 'Storage upload failed', 500, uploadError.message)
      return createErrorResponse(
        'Upload failed',
        'Storage operation failed',
        500
      )
    }

    // Create signed URL for immediate access
    const signedUrlResult = await createSignedUrl(filePath)
    if (signedUrlResult.error) {
      logServerError(method, route, requestId, 'Failed to create signed URL', 500, signedUrlResult.error)
      // Don't fail the entire upload - file was uploaded successfully
    }

    // Success response
    const response = {
      status: 'succeeded' as const,
      path: filePath,
      publicUrl: null, // Private bucket
      signedUrl: signedUrlResult.signedUrl,
      mime: file.type,
      size: file.size
    }

    // Log successful upload
    console.log(`${new Date().toISOString()} [${requestId}] ${method} ${route} 201 - Upload succeeded: ${filePath} (${(file.size / 1024).toFixed(1)}KB, ${file.type})`)

    return NextResponse.json(response, { status: 201 })

  } catch (error) {
    const errorMsg = 'Upload failed'
    const details = error instanceof Error ? error.message : 'Unknown error'
    logServerError(method, route, requestId, errorMsg, 500, details)
    return createErrorResponse(errorMsg, details, 500)
  }
}
