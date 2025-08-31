import { ReactNode } from 'react'

interface AlertProps {
  children: ReactNode
  variant?: 'error' | 'warning' | 'info'
  className?: string
}

export function Alert({ children, variant = 'info', className = '' }: AlertProps) {
  const variantStyles = {
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  }

  return (
    <div className={`rounded-lg border p-4 ${variantStyles[variant]} ${className}`}>
      {children}
    </div>
  )
}

