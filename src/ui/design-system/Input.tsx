'use client'

import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from 'react'

interface BaseInputProps {
  variant?: 'default' | 'large'
  error?: boolean
  label?: string
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement>, BaseInputProps {}
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement>, BaseInputProps {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ variant = 'default', error = false, label, className = '', ...props }, ref) => {
    const baseClasses = 'w-full bg-transparent border outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
    
    const variantClasses = {
      default: 'h-9 px-md text-md rounded-xs',
      large: 'h-12 px-lg text-lg rounded-sm'
    }
    
    const stateClasses = error 
      ? 'border-red-500 focus:border-red-400' 
      : 'border-border focus:border-borderStrong'
    
    const classes = `${baseClasses} ${variantClasses[variant]} ${stateClasses} ${className}`

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-fg mb-xs">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={classes}
          {...props}
        />
      </div>
    )
  }
)

Input.displayName = 'Input'

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ variant = 'default', error = false, label, className = '', ...props }, ref) => {
    const baseClasses = 'w-full bg-transparent border outline-none transition-colors resize-none disabled:opacity-50 disabled:cursor-not-allowed'
    
    const variantClasses = {
      default: 'min-h-[80px] p-md text-md rounded-xs',
      large: 'min-h-[105px] p-lg text-lg leading-snug rounded-sm'
    }
    
    const stateClasses = error 
      ? 'border-red-500 focus:border-red-400' 
      : 'border-border focus:border-borderStrong'
    
    const classes = `${baseClasses} ${variantClasses[variant]} ${stateClasses} ${className}`
    
    const textStyle = variant === 'large' ? {
      fontFamily: "'TT Commons', system-ui",
      fontSize: '18px',
      lineHeight: '1.31'
    } : {}

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-fg mb-xs">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={classes}
          style={textStyle}
          {...props}
        />
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'
