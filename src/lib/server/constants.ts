// Input validation constants
export const INPUT_LIMITS = {
  MAX_FILE_SIZE: 100 * 1024 * 1024, // 100 MB for video files
  MAX_INPUT_JSON_SIZE: 1024 * 1024, // 1 MB for JSON input
  MAX_ERROR_MESSAGE_LENGTH: 500,
} as const

// Allowed MIME types
export const ALLOWED_MIME_TYPES = {
  IMAGES: ['image/png', 'image/jpeg', 'image/webp', 'image/jpg'] as const,
  VIDEOS: ['video/mp4', 'video/avi', 'video/mov', 'video/quicktime', 'video/x-msvideo', 'video/webm'] as const,
  ALL: [...['image/png', 'image/jpeg', 'image/webp', 'image/jpg'], ...['video/mp4', 'video/avi', 'video/mov', 'video/quicktime', 'video/x-msvideo', 'video/webm']] as const,
} as const

// Storage configuration
export const STORAGE_CONFIG = {
  BUCKET_NAME: 'uploads',
  SIGNED_URL_EXPIRES_IN: 3600, // 1 hour in seconds
} as const

// Job statuses
export const JOB_STATUS = {
  CREATED: 'created',
  RUNNING: 'running', 
  SUCCEEDED: 'succeeded',
  FAILED: 'failed',
} as const

export type JobStatus = typeof JOB_STATUS[keyof typeof JOB_STATUS]
