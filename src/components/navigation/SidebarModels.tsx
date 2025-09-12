'use client'

import { useSelectedLayoutSegment } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { MODELS } from '@/config/registry'
import { ModelCard, FeatureCard } from '@/ui/design-system'

export function SidebarModels() {
  const segment = useSelectedLayoutSegment() // equals [slug] under /models
  const router = useRouter()

  return (
    <aside className="w-[374px] py-xxl pr-xl h-full overflow-y-auto flex-shrink-0">
      <div className="space-y-xl">
        {/* Models Section */}
        <div>
          <h3 className="text-xl text-subfg mb-md font-sans leading-snug">Models</h3>
          <div className="space-y-sm">
            {MODELS.map(m => {
              const isActive = segment === m.slug
              
              return (
                <ModelCard
                  key={m.slug}
                  title={m.name}
                  subtitle={m.description}
                  selected={isActive}
                  comingSoon={!m.enabled}
                  icon={m.icon}
                  onClick={() => {
                    if (m.enabled) {
                      router.push(`/models/${m.slug}`)
                    }
                  }}
                />
              )
            })}
          </div>
        </div>

        {/* Features Section */}
        <div>
          <h3 className="text-xl text-subfg mb-md font-sans leading-snug">Features</h3>
          <div className="space-y-sm">
            <FeatureCard
              title="Quick Image to Live"
              subtitle="Fast multi image to video no prompt"
              comingSoon={true}
              onClick={() => {
                // Future feature implementation
              }}
            />

            <FeatureCard
              title="Reverse storyboard"
              subtitle="Turn any video to storyboard"
              comingSoon={true}
              onClick={() => {
                // Future feature implementation
              }}
            />

            <FeatureCard
              title="System prompt builder"
              subtitle="Build great system prompt from pics"
              comingSoon={true}
              onClick={() => {
                // Future feature implementation
              }}
            />
          </div>
        </div>
      </div>
    </aside>
  )
}
