import { ReactNode } from 'react'

interface RadioOption {
  value: string
  label: string
  description?: string
}

interface RadioGroupProps {
  value: string
  onChange: (value: string) => void
  options: RadioOption[]
  name: string
  className?: string
}

export function RadioGroup({ value, onChange, options, name, className = '' }: RadioGroupProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      {options.map((option) => (
        <label key={option.value} className="flex items-start cursor-pointer">
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={(e) => onChange(e.target.value)}
            className="mt-1 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
          />
          <div className="ml-3">
            <div className="text-sm font-medium text-gray-900">{option.label}</div>
            {option.description && (
              <div className="text-sm text-gray-500">{option.description}</div>
            )}
          </div>
        </label>
      ))}
    </div>
  )
}

interface RadioGroupItemProps {
  children: ReactNode
  value: string
}

export function RadioGroupItem({ children, value }: RadioGroupItemProps) {
  return <div data-value={value}>{children}</div>
}

