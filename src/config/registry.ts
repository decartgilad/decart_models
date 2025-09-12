/**
 * Models Registry - Single source of truth for all model metadata and capabilities
 */

import { Lucy14bProvider, isConfigured as isLucy14bConfigured } from './lucy14b'
import { SpliceProvider, isConfigured as isSpliceConfigured } from './splice'
import { MirageLSDProvider, isConfigured as isMirageLSDConfigured } from './miragelsd'

export type ModelCode = 'Lucy14b' | 'Lucy5b' | 'Splice' | 'MirageLSD' | 'Lucid'
export type ModelSlug = 'lucy-14b' | 'lucy-5b' | 'splice' | 'miragelsd' | 'lucid'

export interface ModelConfig {
  slug: ModelSlug
  name: string
  description: string
  code: ModelCode
  enabled: boolean
  falModel?: string
  icon?: string
}

// Model metadata - single source of truth
export const MODELS: ModelConfig[] = [
  { 
    slug: 'lucy-14b', 
    name: 'Lucy 14B', 
    description: 'High quality Image to video model', 
    code: 'Lucy14b', 
    enabled: true,
    falModel: 'fal-ai/wan/v2.2-a14b/image-to-video',
    icon: '/fav_lucy14b.png'
  },

  { 
    slug: 'splice', 
    name: 'Splice', 
    description: 'Real-time video editing', 
    code: 'Splice', 
    enabled: true, 
    falModel: 'fal-ai/splice/v1.0',
    icon: '/fav_splice.png'
  },
  { 
    slug: 'miragelsd', 
    name: 'MirageLSD', 
    description: 'High-quality video to video transformation', 
    code: 'MirageLSD', 
    enabled: true,
    icon: '/fav_mirage.png'
  },
]

// Provider registry for AI processing
export const PROVIDERS = {
  lucy14b: {
    provider: () => new Lucy14bProvider(),
    isConfigured: isLucy14bConfigured,
    displayName: 'Lucy 14B',
  },
  splice: {
    provider: () => new SpliceProvider(),
    isConfigured: isSpliceConfigured,
    displayName: 'Splice',
  },
  miragelsd: {
    provider: () => new MirageLSDProvider(),
    isConfigured: isMirageLSDConfigured,
    displayName: 'MirageLSD',
  },
} as const

export type ProviderId = keyof typeof PROVIDERS

// Helper functions for model metadata
export function getModelBySlug(slug: string): ModelConfig | null {
  return MODELS.find(m => m.slug === slug) ?? null
}

export function getModelByCode(code: string): ModelConfig | null {
  return MODELS.find(m => m.code === code) ?? null
}

// Helper functions for providers
export function getModelProvider(providerId: ProviderId) {
  const provider = PROVIDERS[providerId]
  if (!provider) throw new Error(`Unknown provider: ${providerId}`)
  return provider.provider()
}

export function isModelConfigured(providerId: ProviderId): boolean {
  const provider = PROVIDERS[providerId]
  return provider ? provider.isConfigured() : false
}

export function getAvailableProviders(): ProviderId[] {
  return Object.keys(PROVIDERS).filter(id => 
    PROVIDERS[id as ProviderId].isConfigured()
  ) as ProviderId[]
}

// Re-exports
export { Lucy14bProvider } from './lucy14b'
export { SpliceProvider } from './splice'
export { MirageLSDProvider } from './miragelsd'
