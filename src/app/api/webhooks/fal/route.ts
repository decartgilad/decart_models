import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/server/supabase'
import { 
  createErrorResponse, 
  logServerError, 
  generateRequestId,
  safeParseRequestBody 
} from '@/lib/server/server-utils'
import { JOB_STATUS } from '@/lib/server/constants'
import crypto from 'crypto'

// Force Node.js runtime for webhook handling
export const runtime = 'nodejs'

function verifyWebhookSignature(body: string, signature: string, secret: string): boolean {
  if (!signature || !secret) {
    return false
  }

  try {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body, 'utf8')
      .digest('hex')
    
    // Handle both "sha256=" prefixed and non-prefixed signatures
    const cleanSignature = signature.startsWith('sha256=') ? signature.slice(7) : signature
    
    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature, 'hex'),
      Buffer.from(cleanSignature, 'hex')
    )
  } catch (error) {
    return false
  }
}

export async function POST(request: NextRequest) {
  const requestId = generateRequestId()
  const method = 'POST'
  const route = '/api/webhooks/fal'

  try {
    // Get webhook secret
    const webhookSecret = process.env.WEBHOOK_SECRET
    if (!webhookSecret) {
      logServerError(method, route, requestId, 'WEBHOOK_SECRET not configured', 500)
      return createErrorResponse('Webhook not configured', undefined, 500)
    }

    // Get raw body for signature verification
    const rawBody = await request.text()
    
    // Verify webhook signature
    const signature = request.headers.get('x-signature-sha256') || request.headers.get('x-hub-signature-256') || ''
    if (!verifyWebhookSignature(rawBody, signature, webhookSecret)) {
      logServerError(method, route, requestId, 'Invalid webhook signature', 401)
      return createErrorResponse('Unauthorized', 'Invalid webhook signature', 401)
    }

    // Parse webhook payload
    let webhookData
    try {
      webhookData = JSON.parse(rawBody)
    } catch (error) {
      logServerError(method, route, requestId, 'Invalid JSON payload', 400)
      return createErrorResponse('Invalid payload', 'Webhook payload must be valid JSON', 400)
    }

    // Extract required fields
    const { request_id: providerJobId, status, output, error: webhookError } = webhookData

    if (!providerJobId) {
      logServerError(method, route, requestId, 'Missing request_id in webhook', 400)
      return createErrorResponse('Invalid payload', 'request_id is required', 400)
    }

    if (!status) {
      logServerError(method, route, requestId, 'Missing status in webhook', 400)
      return createErrorResponse('Invalid payload', 'status is required', 400)
    }

    // Find job by provider job ID
    const { data: job, error: fetchError } = await supabaseAdmin
      .from('jobs')
      .select('id, status, model_code')
      .eq('provider_job_id', providerJobId)
      .single()

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        logServerError(method, route, requestId, `Job not found for provider_job_id: ${providerJobId}`, 404)
        return createErrorResponse('Job not found', `No job found with provider ID: ${providerJobId}`, 404)
      }
      
      const errorMsg = 'Failed to fetch job'
      logServerError(method, route, requestId, errorMsg, 500, fetchError.message)
      return createErrorResponse(errorMsg, 'Database operation failed', 500)
    }

    // Skip update if job is already in a final state
    if (job.status === JOB_STATUS.SUCCEEDED || job.status === JOB_STATUS.FAILED) {
      console.log(`${new Date().toISOString()} [${requestId}] ${method} ${route} 200 - Job ${job.id} already in final state: ${job.status}`)
      return NextResponse.json({ message: 'Job already completed' })
    }

    // Map provider status to our job status
    let jobStatus: string
    let jobOutput = null
    let jobError = null

    switch (status.toLowerCase()) {
      case 'completed':
      case 'succeeded':
        jobStatus = JOB_STATUS.SUCCEEDED
        jobOutput = output || null
        break
      case 'failed':
      case 'error':
        jobStatus = JOB_STATUS.FAILED
        jobError = webhookError || 'Provider processing failed'
        break
      case 'running':
      case 'in_progress':
        jobStatus = JOB_STATUS.RUNNING
        break
      default:
        logServerError(method, route, requestId, `Unknown provider status: ${status}`, 400)
        return createErrorResponse('Invalid status', `Unknown provider status: ${status}`, 400)
    }

    // Update job in database
    const updateData: any = { status: jobStatus }
    if (jobOutput !== null) updateData.output = jobOutput
    if (jobError !== null) updateData.error = jobError

    const { error: updateError } = await supabaseAdmin
      .from('jobs')
      .update(updateData)
      .eq('id', job.id)

    if (updateError) {
      const errorMsg = 'Failed to update job'
      logServerError(method, route, requestId, errorMsg, 500, updateError.message)
      return createErrorResponse(errorMsg, 'Database update failed', 500)
    }

    // Success response
    console.log(`${new Date().toISOString()} [${requestId}] ${method} ${route} 200 - Updated job ${job.id} to ${jobStatus} (model: ${job.model_code})`)
    return NextResponse.json({ 
      message: 'Webhook processed successfully',
      jobId: job.id,
      status: jobStatus 
    })

  } catch (error) {
    const errorMsg = 'Unexpected server error'
    const details = error instanceof Error ? error.message : 'Unknown error'
    logServerError(method, route, requestId, errorMsg, 500, details)
    return createErrorResponse(errorMsg, undefined, 500)
  }
}
