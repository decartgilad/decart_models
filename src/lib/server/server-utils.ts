import { NextResponse } from 'next/server'
import { INPUT_LIMITS } from './constants'

// Unified server error response shape
export interface ServerErrorResponse {
  status: 'failed'
  error: string
  details?: string
}

// Generate a simple request ID for logging
export function generateRequestId(): string {
  return Math.random().toString(36).substring(2, 15)
}

// Create unified error response
export function createErrorResponse(
  error: string,
  details?: string,
  statusCode: number = 400
): NextResponse<ServerErrorResponse> {
  const response: ServerErrorResponse = {
    status: 'failed',
    error: error.slice(0, INPUT_LIMITS.MAX_ERROR_MESSAGE_LENGTH),
    ...(details && { details: details.slice(0, INPUT_LIMITS.MAX_ERROR_MESSAGE_LENGTH) })
  }

  return NextResponse.json(response, { status: statusCode })
}

// Log server errors in a compact format
export function logServerError(
  method: string,
  route: string,
  requestId: string,
  error: string,
  statusCode: number,
  details?: string
) {
  const timestamp = new Date().toISOString()
  const logLine = `${timestamp} [${requestId}] ${method} ${route} ${statusCode} - ${error}${details ? ` (${details})` : ''}`
  
  console.error(logLine)
}

// Validate UUID format
export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(uuid.trim())
}

// Validate JSON input size and structure
export function validateJsonInput(input: any): { isValid: boolean; error?: string } {
  if (input === null || input === undefined) {
    return { isValid: true } // Allow empty input
  }

  if (typeof input !== 'object') {
    return { isValid: false, error: 'Input must be a valid JSON object' }
  }

  try {
    const jsonString = JSON.stringify(input)
    if (jsonString.length > INPUT_LIMITS.MAX_INPUT_JSON_SIZE) {
      return { 
        isValid: false, 
        error: `Input JSON too large (max ${INPUT_LIMITS.MAX_INPUT_JSON_SIZE / 1024}KB)` 
      }
    }
  } catch {
    return { isValid: false, error: 'Invalid JSON structure' }
  }

  return { isValid: true }
}

// Safe JSON parsing with size limits
export async function safeParseRequestBody(request: Request): Promise<{
  success: boolean
  data?: any
  error?: string
}> {
  try {
    const contentLength = request.headers.get('content-length')
    
    if (contentLength && parseInt(contentLength) > INPUT_LIMITS.MAX_INPUT_JSON_SIZE) {
      return {
        success: false,
        error: `Request body too large (max ${INPUT_LIMITS.MAX_INPUT_JSON_SIZE / 1024}KB)`
      }
    }

    const body = await request.text()
    
    if (body.length > INPUT_LIMITS.MAX_INPUT_JSON_SIZE) {
      return {
        success: false,
        error: `Request body too large (max ${INPUT_LIMITS.MAX_INPUT_JSON_SIZE / 1024}KB)`
      }
    }

    if (!body.trim()) {
      return { success: true, data: {} }
    }

    const data = JSON.parse(body)
    return { success: true, data }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Invalid JSON'
    }
  }
}
