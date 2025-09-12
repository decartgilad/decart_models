'use client'

import { ModelConfig } from '@/config/registry'

interface ModelHeaderProps {
  model: ModelConfig
}

export function ModelHeader({ 
  model 
}: ModelHeaderProps) {
  return (
    <div className="flex items-end justify-between mb-xl">
      {/* Left side - swatch and title */}
      <div className="flex items-end gap-md">
        {/* 68x68 icon or swatch */}
        <div className={`w-[68px] h-[68px] rounded-[7px] flex-shrink-0 overflow-hidden ${!model.icon ? 'bg-primary' : ''}`}>
          {model.icon ? (
            <img 
              src={model.icon} 
              alt={model.name}
              className="w-full h-full object-cover"
            />
          ) : null}
        </div>
        
        {/* Title and description */}
        <div>
          <h1 className="text-[46px] leading-[1] tracking-[-0.04em] text-fg font-medium">
            {model.name}
          </h1>
          <p className="font-mono text-[14px] leading-[1.51] text-subfg">
            {model.description}
          </p>
        </div>
      </div>
      
      {/* Right side - model name with label */}
      <div className="font-mono text-[14px]">
        <span className="text-subfg">Model: </span>
        <span className="text-fg">{model.name}</span>
      </div>
    </div>
  )
}
