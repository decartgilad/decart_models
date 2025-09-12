'use client'

import { HTMLAttributes } from 'react'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  kind?: 'info' | 'success' | 'warning' | 'danger'
  size?: 'sm' | 'md'
  children: React.ReactNode
}

export function Badge({ kind = 'info', size = 'sm', children, className = '', ...props }: BadgeProps) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-xs border'
  
  const kindClasses = {
    info: 'bg-blue-950/20 text-blue-300 border-blue-700/30',
    success: 'bg-green-950/20 text-green-300 border-green-700/30',
    warning: 'bg-yellow-950/20 text-yellow-300 border-yellow-700/30',
    danger: 'bg-red-950/20 text-red-300 border-red-700/30'
  }
  
  const sizeClasses = {
    sm: 'h-6 px-sm text-xs',
    md: 'h-7 px-md text-sm'
  }

  const classes = `${baseClasses} ${kindClasses[kind]} ${sizeClasses[size]} ${className}`

  return (
    <span className={classes} {...props}>
      <span className="mono">{children}</span>
    </span>
  )
}
