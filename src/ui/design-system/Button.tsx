'use client'

import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  children: React.ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading = false, disabled, children, className = '', ...props }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center gap-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] active:duration-75'
    
    const variantClasses = {
      primary: 'bg-white hover:bg-white/90 text-black border border-white',
      secondary: 'bg-transparent hover:bg-surface text-fg border border-borderStrong',
      ghost: 'bg-transparent hover:bg-surface text-fg border-none',
      danger: 'bg-red-600 hover:bg-red-700 text-white border border-red-600'
    }
    
    const sizeClasses = {
      sm: 'h-8 px-md text-xs rounded-xs',
      md: 'h-9 px-lg text-sm rounded-xs', 
      lg: 'h-[39px] px-xl text-sm rounded-xs'
    }

    const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={classes}
        {...props}
      >
        {loading && (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
        )}
        <span className="mono leading-loose">{children}</span>
      </button>
    )
  }
)

Button.displayName = 'Button'
