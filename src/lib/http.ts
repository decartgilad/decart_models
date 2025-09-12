// Consolidated HTTP client - merged from http/ directory
import { ApiError, JobResponse, JobStatus, UploadResult } from '@/types'

// Error handling
export class HttpError extends Error {
  constructor(public status: number, message: string, public details?: string) {
    super(message)
    this.name = 'HttpError'
  }
}

export async function handleResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type')
  
  // Check if response is JSON
  if (!contentType?.includes('application/json')) {
    throw new HttpError(
      response.status,
      'Unexpected server response',
      `Expected JSON, got ${contentType || 'unknown'}`
    )
  }

  let data: any
  try {
    data = await response.json()
  } catch {
    throw new HttpError(
      response.status,
      'Unexpected server response',
      'Invalid JSON response'
    )
  }

  // Handle error responses
  if (!response.ok) {
    if (data && typeof data === 'object' && data.status === 'failed') {
      throw new HttpError(response.status, data.error, data.details)
    } else if (data && data.error) {
      throw new HttpError(response.status, data.error, data.details)
    } else {
      throw new HttpError(response.status, 'Unexpected server response')
    }
  }

  return data
}

export function mapErrorToApiError(error: unknown): ApiError {
  if (error instanceof HttpError) {
    return {
      message: error.message,
      details: error.details
    }
  }
  
  if (error instanceof Error) {
    return {
      message: error.message
    }
  }
  
  return {
    message: 'An unexpected error occurred'
  }
}

// Job API
let jobCreationStartTime: number | null = null
let statusCheckStartTime: number | null = null

export async function createJob(input: any = {}): Promise<JobResponse> {
  jobCreationStartTime = performance.now()
  
  if (!input.modelCode) {
    throw new Error('modelCode is required in input')
  }
  
  try {
    const response = await fetch('/api/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input }),
    })

    const result = await handleResponse<JobResponse>(response)
    
    if (jobCreationStartTime) {
      const duration = Math.round(performance.now() - jobCreationStartTime)
      console.log(`Job creation completed in ${duration}ms`)
    }
    
    return result
  } catch (error) {
    if (jobCreationStartTime) {
      const duration = Math.round(performance.now() - jobCreationStartTime)
      console.log(`Job creation failed after ${duration}ms`)
    }
    throw error
  }
}

export async function getJobStatus(jobId: string, opts?: { modelCode?: string }): Promise<JobStatus> {
  statusCheckStartTime = performance.now()
  
  try {
    const queryParams = opts?.modelCode ? `?model=${encodeURIComponent(opts.modelCode)}` : ''
    const response = await fetch(`/api/jobs/${jobId}${queryParams}`)
    const result = await handleResponse<JobStatus>(response)
    
    // Log timing (10% sampling to avoid spam)
    if (statusCheckStartTime && Math.random() < 0.1) {
      const duration = Math.round(performance.now() - statusCheckStartTime)
      console.log(`Status check completed in ${duration}ms`)
    }
    
    return result
  } catch (error) {
    if (statusCheckStartTime) {
      const duration = Math.round(performance.now() - statusCheckStartTime)
      console.log(`Status check failed after ${duration}ms`)
    }
    throw error
  }
}

// Upload API
export async function uploadFile(file: File): Promise<UploadResult> {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  })

  return handleResponse<UploadResult>(response)
}
