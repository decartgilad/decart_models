'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getJobStatus } from '@/lib/http'
import { jobQueryKeys } from '@/lib/queries/keys'
import { ModelConfig, JobStatus } from '@/types'

export interface UseJobStatusOptions {
  enabled?: boolean
  autoRefresh?: boolean
}

export interface UseJobStatusReturn {
  data: JobStatus | undefined
  isLoading: boolean
  isFetching: boolean
  error: Error | null
  refetch: () => void
  invalidate: () => void
}

export function useJobStatus(
  model: ModelConfig, 
  jobId: string | null,
  options: UseJobStatusOptions = {}
): UseJobStatusReturn {
  const { enabled = true, autoRefresh = true } = options
  const queryClient = useQueryClient()

  // Job status query with conditional auto-refresh and model scoping
  const query = useQuery({
    queryKey: jobQueryKeys.byId(model.code, jobId || ''),  // Model scoped
    queryFn: async () => {
      console.log('🔍 Fetching job status', { jobId, model: model.code })
      const result = await getJobStatus(jobId!, { modelCode: model.code })
      console.log('📊 Job status result', { jobId, status: result.status, error: result.error })
      return result
    },
    enabled: enabled && !!jobId,
    refetchInterval: (query) => {
      // Only auto-refresh if enabled and job is not in terminal state
      if (!autoRefresh) return false
      
      // Get the actual data from the query state
      const jobStatus = query.state.data as JobStatus | undefined
      
      if (!jobStatus) return 2000 // Continue polling if no data yet
      
      const isTerminal = ['succeeded', 'failed'].includes(jobStatus.status)
      
      console.log('🔄 Job status polling', { 
        status: jobStatus.status, 
        isTerminal, 
        willContinuePolling: !isTerminal 
      })
      
      return isTerminal ? false : 2000
    },
    refetchIntervalInBackground: false,
  })

  const invalidate = () => {
    if (jobId) {
      queryClient.invalidateQueries({ queryKey: jobQueryKeys.byId(model.code, jobId) })
    }
  }

  return {
    data: query.data as JobStatus | undefined,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    refetch: query.refetch,
    invalidate,
  }
}
