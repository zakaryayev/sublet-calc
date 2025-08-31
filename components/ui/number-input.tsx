import { forwardRef } from 'react'

interface NumberInputProps {
  value: number | ''
  onChange: (value: number | '') => void
  disabled?: boolean
  placeholder?: string
  step?: number
  min?: number
  className?: string
}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  ({ value, onChange, disabled, placeholder, step = 0.01, min = 0, className = '' }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value
      if (val === '') {
        onChange('')
      } else {
        const numVal = parseFloat(val)
        if (!isNaN(numVal)) {
          onChange(numVal)
        }
      }
    }

    return (
      <input
        ref={ref}
        type="number"
        value={value}
        onChange={handleChange}
        disabled={disabled}
        placeholder={placeholder}
        step={step}
        min={min}
        className={`
          block w-full rounded-lg border-gray-300 shadow-sm
          focus:border-blue-500 focus:ring-blue-500
          disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
          sm:text-sm
          ${className}
        `}
      />
    )
  }
)

NumberInput.displayName = 'NumberInput'

