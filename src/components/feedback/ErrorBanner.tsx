interface ErrorBannerProps {
  message: string
  details?: string
  onDismiss?: () => void
}

export function ErrorBanner({ message, details, onDismiss }: ErrorBannerProps) {
  return (
    <div className="bg-panel border border-border rounded-sm p-md">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-subfg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-md flex-1">
          <h3 className="text-sm font-medium text-fg">
            {message}
          </h3>
          {details && (
            <div className="mt-xs text-sm text-subfg">
              {details}
            </div>
          )}
        </div>
        {onDismiss && (
          <div className="ml-auto pl-md">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                onClick={onDismiss}
                className="inline-flex bg-panel rounded-sm p-xs text-subfg hover:bg-surface focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-panel focus:ring-primary"
              >
                <span className="sr-only">Dismiss</span>
                <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
