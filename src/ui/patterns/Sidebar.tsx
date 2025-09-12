'use client'

import { useState, useEffect } from 'react'

interface Model {
  id: string
  title: string
  subtitle: string
  comingSoon?: boolean
}

interface Feature {
  id: string
  title: string
  subtitle: string
  comingSoon?: boolean
}

interface SidebarProps {
  selectedModelId?: string
  selectedFeatureId?: string
  onModelSelect?: (modelId: string) => void
  onFeatureSelect?: (featureId: string) => void
}

const models: Model[] = [
  {
    id: 'lucy-14b',
    title: 'Lucy 14b',
    subtitle: 'Image to video generation'
  },
  {
    id: 'claude-3',
    title: 'Claude 3',
    subtitle: 'Advanced reasoning',
    comingSoon: true
  },
  {
    id: 'gpt-4',
    title: 'GPT-4',
    subtitle: 'Language model',
    comingSoon: true
  }
]

const features: Feature[] = [
  {
    id: 'storyboard',
    title: 'Storyboard',
    subtitle: 'Scene planning',
    comingSoon: true
  },
  {
    id: 'upscale',
    title: 'Upscale',
    subtitle: '4K enhancement',
    comingSoon: true
  },
  {
    id: 'style-transfer',
    title: 'Style Transfer',
    subtitle: 'Artistic effects',
    comingSoon: true
  }
]

export function Sidebar({ selectedModelId, selectedFeatureId, onModelSelect, onFeatureSelect }: SidebarProps) {
  const [focusedIndex, setFocusedIndex] = useState(0)
  const [focusedSection, setFocusedSection] = useState<'models' | 'features'>('models')
  
  const totalItems = models.length + features.length
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        if (focusedIndex < totalItems - 1) {
          setFocusedIndex(focusedIndex + 1)
          if (focusedIndex + 1 >= models.length) {
            setFocusedSection('features')
          }
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        if (focusedIndex > 0) {
          setFocusedIndex(focusedIndex - 1)
          if (focusedIndex - 1 < models.length) {
            setFocusedSection('models')
          }
        }
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (focusedSection === 'models' && focusedIndex < models.length) {
          const model = models[focusedIndex]
          if (!model.comingSoon && onModelSelect) {
            onModelSelect(model.id)
          }
        } else if (focusedSection === 'features' && focusedIndex >= models.length) {
          const feature = features[focusedIndex - models.length]
          if (!feature.comingSoon && onFeatureSelect) {
            onFeatureSelect(feature.id)
          }
        }
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [focusedIndex, focusedSection, totalItems, onModelSelect, onFeatureSelect])

  return (
    <div className="h-full flex flex-col p-xl space-y-xl">
      {/* Models Section */}
      <div className="space-y-md">
        <h2 className="text-lg text-subfg mb-lg">Models</h2>
        <ul className="space-y-sm">
          {models.map((model, index) => (
            <li
              key={model.id}
              onClick={model.comingSoon ? undefined : () => onModelSelect?.(model.id)}
              className="h-[77px] rounded-[5px] border px-lg flex items-center justify-between border-border data-[active=true]:border-white data-[disabled=true]:opacity-50 cursor-pointer transition-colors hover:bg-panel"
              data-active={selectedModelId === model.id}
              data-disabled={model.comingSoon}
              tabIndex={model.comingSoon ? -1 : 0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !model.comingSoon && onModelSelect) {
                  onModelSelect(model.id)
                }
              }}
            >
              {/* Color swatch - 68x68 */}
              <div className="w-[68px] h-[68px] bg-primary rounded-[6px] flex-shrink-0" />
              
              {/* Text content */}
              <div className="flex-1 ml-md">
                <h3 className="text-[22px] leading-[1.31] text-fg font-medium">{model.title}</h3>
                <p className="font-mono text-[14px] leading-[1.51] text-subfg">{model.subtitle}</p>
              </div>
              
              {/* Chevron - 12x12 */}
              <div className="ml-sm">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 16 16"
                  fill="none"
                  className={`transition-transform ${selectedModelId === model.id ? 'rotate-[-45deg] text-fg' : 'text-subfg'}`}
                >
                  <path
                    d="M6 4L10 8L6 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Features Section */}
      <div className="space-y-md">
        <h2 className="text-lg text-subfg mb-lg">Features</h2>
        <ul className="space-y-sm">
          {features.map((feature, index) => (
            <li
              key={feature.id}
              onClick={feature.comingSoon ? undefined : () => onFeatureSelect?.(feature.id)}
              className="h-[77px] rounded-[5px] border px-lg flex items-center justify-between border-border data-[active=true]:border-white data-[disabled=true]:opacity-50 cursor-pointer transition-colors hover:bg-panel"
              data-active={selectedFeatureId === feature.id}
              data-disabled={feature.comingSoon}
              tabIndex={feature.comingSoon ? -1 : 0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !feature.comingSoon && onFeatureSelect) {
                  onFeatureSelect(feature.id)
                }
              }}
            >
              {/* Color swatch - accent color for features */}
              <div className="w-[68px] h-[68px] bg-accent rounded-[6px] flex-shrink-0" />
              
              {/* Text content */}
              <div className="flex-1 ml-md">
                <h3 className="text-[22px] leading-[1.31] text-fg font-medium">{feature.title}</h3>
                <p className="font-mono text-[14px] leading-[1.51] text-subfg">{feature.subtitle}</p>
              </div>
              
              {/* Chevron */}
              <div className="ml-sm">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 16 16"
                  fill="none"
                  className={`transition-transform ${selectedFeatureId === feature.id ? 'rotate-[-45deg] text-fg' : 'text-subfg'}`}
                >
                  <path
                    d="M6 4L10 8L6 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
