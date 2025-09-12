import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/server/supabase'
import { 
  createErrorResponse, 
  logServerError, 
  generateRequestId, 
  safeParseRequestBody,
  validateJsonInput 
} from '@/lib/server/server-utils'
import { JOB_STATUS } from '@/lib/server/constants'
import { getProvider, DEFAULT_PROVIDER, logProviderOperation } from '@/lib/providers'

export async function POST(request: NextRequest) {
  const requestId = generateRequestId()
  const method = 'POST'
  const route = '/api/jobs'

  try {
    // Parse request body with size validation
    const parseResult = await safeParseRequestBody(request)
    if (!parseResult.success) {
      logServerError(method, route, requestId, parseResult.error!, 400)
      return createErrorResponse(parseResult.error!, undefined, 400)
    }

    const { input = {}, provider: requestedProvider } = parseResult.data || {}

    // Extract and validate modelCode
    const modelCode = input.modelCode
    if (!modelCode || typeof modelCode !== 'string') {
      logServerError(method, route, requestId, 'modelCode is required', 400)
      return createErrorResponse('modelCode is required', 'modelCode must be provided in input', 400)
    }

    // Validate input JSON
    const inputValidation = validateJsonInput(input)
    if (!inputValidation.isValid) {
      logServerError(method, route, requestId, inputValidation.error!, 400)
      return createErrorResponse(inputValidation.error!, undefined, 400)
    }

    // Map model code to provider
    const getProviderForModel = (modelCode: string): string => {
      switch (modelCode) {
        case 'Lucy14b':
        case 'Lucy5b':
          return 'lucy14b'
        case 'Splice':
          return 'splice'
        case 'MirageLSD':
          return 'miragelsd'
        default:
          return DEFAULT_PROVIDER
      }
    }

    // Get provider (use requested, model-specific, or default)
    const providerName = requestedProvider || getProviderForModel(modelCode)
    let provider
    try {
      provider = getProvider(providerName)
    } catch (error) {
      const errorMsg = 'Invalid provider'
      logServerError(method, route, requestId, errorMsg, 400, error instanceof Error ? error.message : undefined)
      return createErrorResponse(errorMsg, error instanceof Error ? error.message : undefined, 400)
    }

    // Insert job into database with initial status
    const { data: jobData, error: insertError } = await supabaseAdmin
      .from('jobs')
      .insert({
        status: JOB_STATUS.CREATED,
        input,
        provider: providerName,
        model_code: modelCode
      })
      .select('id')
      .single()

    if (insertError) {
      const errorMsg = 'Failed to create job'
      logServerError(method, route, requestId, errorMsg, 500, insertError.message)
      return createErrorResponse(errorMsg, 'Database operation failed', 500)
    }

    const jobId = jobData.id

    // Call provider to start processing
    try {
      const providerResult = await provider.run(input)
      logProviderOperation(requestId, providerName, 'run', 'success', `kind: ${providerResult.kind}`)

      if (providerResult.kind === 'immediate') {
        // Update job to completed immediately
        const { error: updateError } = await supabaseAdmin
          .from('jobs')
          .update({
            status: JOB_STATUS.SUCCEEDED,
            output: providerResult.output
          })
          .eq('id', jobId)

        if (updateError) {
          logServerError(method, route, requestId, 'Failed to update job with immediate result', 500, updateError.message)
          // Don't fail the request - job was created successfully
        }
      } else {
        // Update job to running with provider job ID
        const { error: updateError } = await supabaseAdmin
          .from('jobs')
          .update({
            status: JOB_STATUS.RUNNING,
            provider_job_id: providerResult.providerJobId
          })
          .eq('id', jobId)

        if (updateError) {
          logServerError(method, route, requestId, 'Failed to update job with provider job ID', 500, updateError.message)
          // Don't fail the request - job was created successfully
        }
      }
    } catch (providerError) {
      // Provider failed - update job to failed
      const errorMessage = providerError instanceof Error ? providerError.message : 'Unknown provider error'
      logProviderOperation(requestId, providerName, 'run', 'error', errorMessage)
      
      // Log detailed error for debugging
      console.error('🔥 Provider Error Details:', {
        provider: providerName,
        error: errorMessage,
        stack: providerError instanceof Error ? providerError.stack : undefined,
        requestId
      })
      
      const { error: updateError } = await supabaseAdmin
        .from('jobs')
        .update({
          status: JOB_STATUS.FAILED,
          error: `Provider failed: ${errorMessage}`
        })
        .eq('id', jobId)

      if (updateError) {
        logServerError(method, route, requestId, 'Failed to update job with provider error', 500, updateError.message)
      }
    }

    // Success response - always return job ID quickly
    console.log(`${new Date().toISOString()} [${requestId}] ${method} ${route} 201 - Job created: ${jobId} (model: ${modelCode})`)
    return NextResponse.json({ id: jobId, modelCode }, { status: 201 })

  } catch (error) {
    const errorMsg = 'Unexpected server error'
    const details = error instanceof Error ? error.message : 'Unknown error'
    logServerError(method, route, requestId, errorMsg, 500, details)
    return createErrorResponse(errorMsg, undefined, 500)
  }
}
