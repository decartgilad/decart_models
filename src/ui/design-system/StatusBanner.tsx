'use client'

interface StatusBannerProps {
  kind?: 'info' | 'success' | 'warning' | 'danger'
  title: string
  message?: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function StatusBanner({ kind = 'info', title, message, action }: StatusBannerProps) {
  const kindClasses = {
    info: 'bg-blue-950/20 text-blue-300 border-blue-700/30',
    success: 'bg-green-950/20 text-green-300 border-green-700/30',
    warning: 'bg-yellow-950/20 text-yellow-300 border-yellow-700/30',
    danger: 'bg-red-950/20 text-red-300 border-red-700/30',
  }

  return (
    <div 
      className={`border rounded-xs p-lg ${kindClasses[kind]}`}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-medium text-sm">{title}</h3>
          {message && (
            <p className="text-xs mt-xs opacity-80 whitespace-pre-wrap break-words">{message}</p>
          )}
        </div>
        {action && (
          <button
            onClick={action.onClick}
            className="ml-lg px-md py-xs bg-white/10 hover:bg-white/20 rounded-xs transition-colors"
            aria-label={`${action.label} - ${title}`}
          >
            <span className="mono text-xs">{action.label}</span>
          </button>
        )}
      </div>
    </div>
  )
}
