'use client'

import { HTMLAttributes } from 'react'

interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'determinate' | 'indeterminate'
  value?: number // 0-100 for determinate
  size?: 'sm' | 'md' | 'lg'
}

export function Progress({ variant = 'indeterminate', value = 0, size = 'md', className = '', ...props }: ProgressProps) {
  const baseClasses = 'w-full bg-surface rounded-full overflow-hidden'
  
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2', 
    lg: 'h-3'
  }

  const classes = `${baseClasses} ${sizeClasses[size]} ${className}`

  return (
    <div className={classes} {...props}>
      {variant === 'determinate' ? (
        <div 
          className="h-full bg-primary transition-all duration-300 ease-out"
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      ) : (
        <div 
          className="h-full bg-primary"
          style={{ animation: 'indeterminate 1.5s ease-in-out infinite' }}
        />
      )}
    </div>
  )
}
