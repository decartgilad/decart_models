/**
 * Centralized query keys for React Query operations
 * All query keys in one place for better cache management
 */

export const queryKeys = {
  // Jobs related queries
  jobs: {
    all: ['jobs'] as const,
    byModel: (modelCode: string) => [...queryKeys.jobs.all, modelCode] as const,
    byId: (modelCode: string, jobId: string) => [...queryKeys.jobs.byModel(modelCode), jobId] as const,
  },
  
  // Models related queries
  models: {
    all: ['models'] as const,
    bySlug: (slug: string) => [...queryKeys.models.all, slug] as const,
  },
  
  // Upload related queries
  uploads: {
    all: ['uploads'] as const,
    byPath: (path: string) => [...queryKeys.uploads.all, path] as const,
  },
} as const

// Convenience exports for backward compatibility
export const jobQueryKeys = queryKeys.jobs
export const modelQueryKeys = queryKeys.models
