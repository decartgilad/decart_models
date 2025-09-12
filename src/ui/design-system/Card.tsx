'use client'

interface CardProps {
  title: string
  subtitle: string
  selected?: boolean
  comingSoon?: boolean
  onClick?: () => void
  variant?: 'feature' | 'model' // feature uses accent, model uses primary
  icon?: string
}

export function Card({ 
  title, 
  subtitle, 
  selected = false, 
  comingSoon = false, 
  onClick,
  variant = 'model',
  icon
}: CardProps) {
  const swatchColor = variant === 'feature' ? 'bg-accent' : 'bg-primary'
  
  return (
    <div
      onClick={comingSoon ? undefined : onClick}
      className={`
        w-[350px] min-h-[62px] px-md py-sm rounded-[5px] border cursor-pointer transition-colors
        ${selected ? 'border-white' : 'border-border'}
        ${comingSoon ? 'opacity-50 pointer-events-none' : 'hover:bg-white/10'}
      `}
      tabIndex={comingSoon ? -1 : 0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && !comingSoon && onClick) {
          onClick()
        }
      }}
    >
      <div className="flex items-center gap-sm">
        {/* Icon or Color swatch - varies by variant */}
        <div className={`w-[54px] h-[54px] rounded-[6px] flex-shrink-0 overflow-hidden ${!icon ? swatchColor : ''}`}>
          {icon ? (
            <img 
              src={icon} 
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : null}
        </div>
        
        {/* Text content - left-aligned */}
        <div className="flex-1 min-w-0 text-left">
          <div className="text-[18px] text-fg font-sans leading-snug">{title}</div>
          <div className="text-[14px] text-subfg font-sans leading-loose whitespace-nowrap overflow-hidden text-ellipsis">
            {subtitle}
          </div>
        </div>
        
        {/* Custom arrow SVG - top-aligned */}
        <svg 
          width="9" 
          height="9" 
          viewBox="0 0 11 11" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg" 
          className={`flex-shrink-0 self-start mt-xs ${selected ? '' : 'opacity-60'}`}
        >
          <path 
            d="M5.92935 2.38918L5.92935 9.98624L4.68107 9.98624L4.68107 2.38918L1.33317 5.73708L0.450633 4.85454L5.30521 -2.87982e-05L10.1598 4.85455L9.27725 5.73708L5.92935 2.38918Z" 
            fill="currentColor"
          />
        </svg>
      </div>
    </div>
  )
}

// Convenience components for backward compatibility and clarity
export function ModelCard(props: Omit<CardProps, 'variant'>) {
  return <Card {...props} variant="model" />
}

export function FeatureCard(props: Omit<CardProps, 'variant'>) {
  return <Card {...props} variant="feature" />
}
