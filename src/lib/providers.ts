// Simple provider system - consolidated from old providers/ directory
import { Lucy14bProvider, isConfigured as isLucy14bConfigured } from '@/config/lucy14b'
import { SpliceProvider, isConfigured as isSpliceConfigured } from '@/config/splice'
import { MirageLSDProvider, isConfigured as isMirageLSDConfigured } from '@/config/miragelsd'

// Provider interfaces (moved from providers/types.ts)
export interface ProviderRunResult {
  kind: 'immediate' | 'deferred'
  output?: any
  providerJobId?: string
}

export interface ProviderStatusResult {
  status: 'running' | 'succeeded' | 'failed'
  output?: any
  error?: string
}

export interface AIProvider {
  name: string
  run(input: any): Promise<ProviderRunResult>
  result(providerJobId: string, input?: any): Promise<ProviderStatusResult>
}

// Provider registry - only active models
const providers = new Map<string, () => AIProvider>([
  ['lucy14b', () => new Lucy14bProvider()],
  ['splice', () => new SpliceProvider()],
  ['miragelsd', () => new MirageLSDProvider()],
])

// Default provider - support both lucy14b and splice
export const DEFAULT_PROVIDER = (() => {
  if (process.env.PROVIDER_NAME === 'lucy14b' && isLucy14bConfigured()) {
    return 'lucy14b'
  }
  if (process.env.PROVIDER_NAME === 'splice' && isSpliceConfigured()) {
    return 'splice'
  }
  if (process.env.PROVIDER_NAME === 'miragelsd' && isMirageLSDConfigured()) {
    return 'miragelsd'
  }
  // Fallback to any configured provider
  if (isLucy14bConfigured()) {
    return 'lucy14b'
  }
  if (isSpliceConfigured()) {
    return 'splice'
  }
  if (isMirageLSDConfigured()) {
    return 'miragelsd'
  }
  throw new Error('No AI provider configured. Please set PROVIDER_NAME and required API keys in .env.local')
})()

// Debug log
console.log(`🔧 Provider configuration:`, {
  PROVIDER_NAME: process.env.PROVIDER_NAME,
  isLucy14bConfigured: isLucy14bConfigured(),
  isSpliceConfigured: isSpliceConfigured(),
  isMirageLSDConfigured: isMirageLSDConfigured(),
  DEFAULT_PROVIDER
})

// Get provider instance
export function getProvider(name: string = DEFAULT_PROVIDER): AIProvider {
  const factory = providers.get(name)
  
  if (!factory) {
    throw new Error(`Unknown provider: ${name}. Available providers: ${Array.from(providers.keys()).join(', ')}`)
  }
  
  return factory()
}

// Provider logging helper
export function logProviderOperation(
  requestId: string,
  provider: string,
  operation: 'run' | 'result',
  outcome: 'success' | 'error',
  details?: string
) {
  const timestamp = new Date().toISOString()
  const logLine = `${timestamp} [${requestId}] PROVIDER ${provider} ${operation} ${outcome}${details ? ` - ${details}` : ''}`
  
  if (outcome === 'error') {
    console.error(logLine)
  } else {
    console.log(logLine)
  }
}
