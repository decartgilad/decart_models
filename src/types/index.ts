// Consolidated types - merged from api.ts, jobs.ts, models.ts, upload.ts

// === API Types ===
export interface ApiError {
  message: string
  details?: string
}

export interface ServerErrorResponse {
  status: 'failed'
  error: string
  details?: string
}

export interface ApiResponse<T> {
  data?: T
  error?: ApiError
}

export enum HttpStatusCode {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

// === Job Types ===
export type JobStatusType = 'created' | 'running' | 'succeeded' | 'failed'

export interface JobResponse {
  id: string
  modelCode?: string
}

export interface JobStatus {
  id: string
  status: JobStatusType
  output: any
  error: string | null
  modelCode?: string
}

export interface JobInput {
  type?: string
  timestamp?: string
  modelCode: string
  prompt?: string
  file?: {
    path: string
    signedUrl: string | null
    mime: string
    size: number
  }
  [key: string]: any // Allow additional properties
}

export interface CreateJobRequest {
  input: JobInput
  provider?: string
}

// === Model Types ===
export type ModelSlug = 'lucy-14b' | 'lucy-5b' | 'splice' | 'miragelsd' | 'lucid'

export interface ModelConfig {
  slug: ModelSlug
  name: string
  description: string
  code: string     // backend identifier
  enabled: boolean
  falModel?: string // FAL model endpoint
}

export interface ModelStatusResponse {
  modelCode: string
  available: boolean
  queueLength?: number
}

// === Upload Types ===
export interface UploadResult {
  status: 'succeeded'
  path: string
  publicUrl: null
  signedUrl: string | null
  mime: string
  size: number
  // Optional additional parameters for specific models
  enhance_prompt?: boolean
  orientation?: 'landscape' | 'portrait'
  originalName?: string
}

export interface UploadError {
  status: 'failed'
  error: string
  details?: string
}

export interface FileConstraints {
  maxSize: number // in bytes
  allowedMimeTypes: string[]
  maxDimensions?: {
    width: number
    height: number
  }
}

export interface FileMetadata {
  name: string
  size: number
  type: string
  lastModified: number
}
