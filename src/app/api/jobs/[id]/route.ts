import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/server/supabase'
import { 
  createErrorResponse, 
  logServerError, 
  generateRequestId, 
  isValidUUID 
} from '@/lib/server/server-utils'
import { JOB_STATUS } from '@/lib/server/constants'
import { getProvider, logProviderOperation } from '@/lib/providers'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const requestId = generateRequestId()
  const method = 'GET'
  const route = '/api/jobs/[id]'

  try {
    const { id } = await params

    // Validate UUID format
    if (!id || !isValidUUID(id)) {
      logServerError(method, route, requestId, 'Invalid job ID format', 400)
      return createErrorResponse('Invalid job ID format', 'Job ID must be a valid UUID', 400)
    }

    // Fetch job from database with provider info and input
    const { data: job, error } = await supabaseAdmin
      .from('jobs')
      .select('status, output, error, provider, provider_job_id, created_at, input, model_code')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        logServerError(method, route, requestId, 'Job not found', 404)
        return createErrorResponse('Job not found', `No job found with ID: ${id}`, 404)
      }
      
      const errorMsg = 'Failed to fetch job status'
      logServerError(method, route, requestId, errorMsg, 500, error.message)
      return createErrorResponse(errorMsg, 'Database operation failed', 500)
    }

    // Check for job timeout (15 minutes)
    if (job.status === JOB_STATUS.RUNNING && job.created_at) {
      const jobAge = Date.now() - new Date(job.created_at).getTime()
      const timeoutMs = 15 * 60 * 1000 // 15 minutes
      
      if (jobAge > timeoutMs) {
        // Job has timed out - mark as failed
        const { error: updateError } = await supabaseAdmin
          .from('jobs')
          .update({
            status: JOB_STATUS.FAILED,
            error: 'This job took too long and was aborted'
          })
          .eq('id', id)

        if (!updateError) {
          job.status = JOB_STATUS.FAILED
          job.error = 'This job took too long and was aborted'
        }

        logServerError(method, route, requestId, 'Job TTL exceeded', 200, `Job ${id} exceeded 15min TTL after ${Math.round(jobAge / 1000)}s`)
      }
    }

    // If job is running and has provider job ID, check provider status (lazy polling)
    if (job.status === JOB_STATUS.RUNNING && job.provider && job.provider_job_id) {
      try {
        const provider = getProvider(job.provider)
        const providerResult = await provider.result(job.provider_job_id, job.input)
        
        // Only update database if status changed
        if (providerResult.status !== 'running') {
          const updateData: any = {
            status: providerResult.status === 'succeeded' ? JOB_STATUS.SUCCEEDED : JOB_STATUS.FAILED
          }

          if (providerResult.status === 'succeeded') {
            updateData.output = providerResult.output
            updateData.error = null
            logProviderOperation(requestId, job.provider, 'result', 'success', 'job completed')
          } else {
            updateData.error = providerResult.error || 'Provider processing failed'
            logProviderOperation(requestId, job.provider, 'result', 'success', 'job failed')
          }

          // Update job in database
          const { error: updateError } = await supabaseAdmin
            .from('jobs')
            .update(updateData)
            .eq('id', id)

          if (updateError) {
            logServerError(method, route, requestId, 'Failed to update job with provider result', 500, updateError.message)
            // Continue with current job data - don't fail the request
          } else {
            // Update local job data to return the latest status
            job.status = updateData.status
            job.output = updateData.output
            job.error = updateData.error
          }
        } else {
          // Still running - no need to log every poll
        }
      } catch (providerError) {
        // Provider check failed - log but don't update job status yet
        logProviderOperation(requestId, job.provider, 'result', 'error', providerError instanceof Error ? providerError.message : 'Provider check failed')
        // Continue with current job data from database
      }
    }

    // Success response - include modelCode for client-side model isolation
    console.log(`${new Date().toISOString()} [${requestId}] ${method} ${route} 200 - Job status: ${job.status} (model: ${job.model_code})`)
    return NextResponse.json({
      id: id,
      status: job.status,
      output: job.output,
      error: job.error,
      modelCode: job.model_code
    })

  } catch (error) {
    const errorMsg = 'Unexpected server error'
    const details = error instanceof Error ? error.message : 'Unknown error'
    logServerError(method, route, requestId, errorMsg, 500, details)
    return createErrorResponse(errorMsg, undefined, 500)
  }
}
