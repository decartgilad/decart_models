import type { ModelConfig } from '@/config/registry'
import Lucy14bView from '../views/Lucy14bView'
import SpliceView from '../views/SpliceView'
import MirageLSDView from '../views/MirageLSDView'

export type ModelViewProps = { model: ModelConfig }

// Maps ModelCode → React View Component using metadata from config/registry
export const MODEL_VIEWS: Record<string, React.ComponentType<ModelViewProps>> = {
  'lucy-14b': Lucy14bView,      // Custom upload logic with high quality
  'splice': SpliceView,         // Real-time video editing view
  'miragelsd': MirageLSDView,   // MirageLSD video transformation view
}

export function getModelView(slug: string) {
  const view = MODEL_VIEWS[slug]
  if (!view) {
    throw new Error(`No view found for model: ${slug}`)
  }
  return view
}
