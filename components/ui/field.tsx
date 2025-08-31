import { ReactNode } from 'react'

interface FieldProps {
  label: string
  children: ReactNode
  error?: string
  hint?: string
  className?: string
}

export function Field({ label, children, error, hint, className = '' }: FieldProps) {
  return (
    <div className={`space-y-1 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      {children}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      {hint && !error && (
        <p className="text-sm text-gray-500">{hint}</p>
      )}
    </div>
  )
}

