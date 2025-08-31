'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { solveUnknown, formatMoney, formatNumber, type UnknownVariable, type Result } from '@/lib/calc'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Field } from '@/components/ui/field'
import { NumberInput } from '@/components/ui/number-input'
import { RadioGroup } from '@/components/ui/radio-group'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert } from '@/components/ui/alert'

interface FormData {
  R: number | ''
  P: number | ''
  S: number | ''
  K: number | ''
  N: number | ''
  unknown: UnknownVariable
}

const defaultValues: FormData = {
  R: 3500,
  P: 725,
  S: 2,
  K: 1500,
  N: '',
  unknown: 'N'
}

const presets = [
  { name: '€3500 rent', data: { R: 3500, P: 725, S: 2, K: 1500, N: '', unknown: 'N' as UnknownVariable } },
  { name: '€4500 rent', data: { R: 4500, P: 725, S: 2, K: 1500, N: '', unknown: 'N' as UnknownVariable } },
  { name: 'Find P', data: { R: 3500, P: '', S: 2, K: 1500, N: 8, unknown: 'P' as UnknownVariable } },
]

export default function HomePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [formData, setFormData] = useState<FormData>(defaultValues)
  const [result, setResult] = useState<Result | null>(null)
  const [error, setError] = useState<string>('')

  // Load state from URL on mount
  useEffect(() => {
    const urlData: Partial<FormData> = {}
    
    const R = searchParams.get('R')
    const P = searchParams.get('P')
    const S = searchParams.get('S')
    const K = searchParams.get('K')
    const N = searchParams.get('N')
    const unknown = searchParams.get('unknown') as UnknownVariable
    
    if (R !== null) urlData.R = parseFloat(R) || ''
    if (P !== null) urlData.P = parseFloat(P) || ''
    if (S !== null) urlData.S = parseInt(S) || ''
    if (K !== null) urlData.K = parseFloat(K) || ''
    if (N !== null) urlData.N = parseInt(N) || ''
    if (unknown && ['R', 'P', 'S', 'K', 'N'].includes(unknown)) {
      urlData.unknown = unknown
    }

    if (Object.keys(urlData).length > 0) {
      setFormData(prev => ({ ...prev, ...urlData }))
    }
  }, [searchParams])

  // Update URL when form data changes
  const updateUrl = useCallback((data: FormData) => {
    const params = new URLSearchParams()
    
    Object.entries(data).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        params.set(key, value.toString())
      }
    })

    router.replace(`/?${params.toString()}`, { scroll: false })
  }, [router])

  const handleInputChange = (field: keyof FormData) => (value: number | '' | string) => {
    const newData = { ...formData, [field]: value }
    setFormData(newData)
    updateUrl(newData)
  }

  const handlePreset = (preset: typeof presets[0]) => {
    setFormData(preset.data)
    updateUrl(preset.data)
    setResult(null)
    setError('')
  }

  const handleCalculate = () => {
    try {
      setError('')
      
      // Prepare input for calculation
      const input: any = { unknown: formData.unknown }
      
      // Add all non-unknown values
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'unknown' && key !== formData.unknown && value !== '') {
          input[key] = typeof value === 'string' ? parseFloat(value) : value
        }
      })

      // Validate we have all required inputs
      const requiredFields = ['R', 'P', 'S', 'K', 'N'].filter(f => f !== formData.unknown)
      const missingFields = requiredFields.filter(field => 
        formData[field as keyof FormData] === '' || 
        formData[field as keyof FormData] === null ||
        formData[field as keyof FormData] === undefined
      )

      if (missingFields.length > 0) {
        setError(`Please fill in: ${missingFields.join(', ')}`)
        return
      }

      const calculationResult = solveUnknown(input)
      setResult(calculationResult)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Calculation failed')
      setResult(null)
    }
  }

  const handleReset = () => {
    setFormData(defaultValues)
    updateUrl(defaultValues)
    setResult(null)
    setError('')
  }

  const radioOptions = [
    { value: 'R', label: 'Monthly Rent (R)', description: 'Total monthly rent + expenses' },
    { value: 'P', label: 'Price per Room (P)', description: 'Average monthly rent per rentable room' },
    { value: 'S', label: 'Reserved Rooms (S)', description: 'Rooms reserved for you' },
    { value: 'K', label: 'Target Profit (K)', description: 'Desired monthly profit after expenses' },
    { value: 'N', label: 'Total Rooms (N)', description: 'Total number of rooms in property' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Sublet Profit Calculator
          </h1>
          <p className="text-lg text-gray-600">
            Calculate rental subletting scenarios by auto-filling one unknown variable
          </p>
        </div>

        {/* Quick Presets */}
        <div className="mb-6 text-center">
          <p className="text-sm text-gray-500 mb-3">Quick examples:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {presets.map((preset) => (
              <button
                key={preset.name}
                onClick={() => handlePreset(preset)}
                className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Panel */}
          <Card>
            <CardHeader>
              <CardTitle>Calculator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Unknown Variable Selection */}
              <Field label="Which variable should I solve for?">
                <RadioGroup
                  value={formData.unknown}
                  onChange={handleInputChange('unknown')}
                  options={radioOptions}
                  name="unknown"
                />
              </Field>

              {/* Input Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field 
                  label="Monthly Rent (€)"
                  hint="Total rent + all expenses"
                >
                  <NumberInput
                    value={formData.unknown === 'R' ? (result?.R ?? '') : formData.R}
                    onChange={handleInputChange('R')}
                    disabled={formData.unknown === 'R'}
                    placeholder={formData.unknown === 'R' ? 'calculated' : '3500'}
                    step={0.01}
                  />
                </Field>

                <Field 
                  label="Price per Room (€)"
                  hint="Average monthly rent per rentable room"
                >
                  <NumberInput
                    value={formData.unknown === 'P' ? (result?.P ?? '') : formData.P}
                    onChange={handleInputChange('P')}
                    disabled={formData.unknown === 'P'}
                    placeholder={formData.unknown === 'P' ? 'calculated' : '725'}
                    step={0.01}
                  />
                </Field>

                <Field 
                  label="Reserved Rooms"
                  hint="Rooms you keep for yourself"
                >
                  <NumberInput
                    value={formData.unknown === 'S' ? (result?.S ?? '') : formData.S}
                    onChange={handleInputChange('S')}
                    disabled={formData.unknown === 'S'}
                    placeholder={formData.unknown === 'S' ? 'calculated' : '2'}
                    step={1}
                  />
                </Field>

                <Field 
                  label="Target Profit (€)"
                  hint="Desired monthly profit"
                >
                  <NumberInput
                    value={formData.unknown === 'K' ? (result?.K ?? '') : formData.K}
                    onChange={handleInputChange('K')}
                    disabled={formData.unknown === 'K'}
                    placeholder={formData.unknown === 'K' ? 'calculated' : '1500'}
                    step={0.01}
                  />
                </Field>

                <Field 
                  label="Total Rooms"
                  hint="Total rooms in property"
                >
                  <NumberInput
                    value={formData.unknown === 'N' ? (result?.N ?? '') : formData.N}
                    onChange={handleInputChange('N')}
                    disabled={formData.unknown === 'N'}
                    placeholder={formData.unknown === 'N' ? 'calculated' : '8'}
                    step={1}
                  />
                </Field>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button onClick={handleCalculate} className="flex-1">
                  Calculate
                </Button>
                <Button onClick={handleReset} variant="outline">
                  Reset
                </Button>
              </div>

              {error && (
                <Alert variant="error">
                  {error}
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Results Panel */}
          <Card>
            <CardHeader>
              <CardTitle>Results</CardTitle>
            </CardHeader>
            <CardContent>
              {result ? (
                <div className="space-y-6">
                  {/* Calculated Values */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Calculated Values</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>Monthly Rent: <span className="font-medium">{formatMoney(result.R)}</span></div>
                      <div>Price per Room: <span className="font-medium">{formatMoney(result.P)}</span></div>
                      <div>Reserved Rooms: <span className="font-medium">{result.S}</span></div>
                      <div>Target Profit: <span className="font-medium">{formatMoney(result.K)}</span></div>
                      <div>Total Rooms: <span className="font-medium">{result.N}</span></div>
                    </div>
                  </div>

                  {/* Derived Values */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Analysis</h4>
                    <div className="space-y-2 text-sm">
                      <div>Rentable Rooms: <span className="font-medium">{result.rentableRooms}</span></div>
                      <div>Monthly Income: <span className="font-medium">{formatMoney(result.income)}</span></div>
                      <div>Monthly Profit: <span className="font-medium">{formatMoney(result.profit)}</span></div>
                    </div>
                  </div>

                  {/* Target Status */}
                  <div className="text-center">
                    <Badge variant={result.meetsTarget ? 'success' : 'error'}>
                      {result.meetsTarget ? 'MEETS TARGET' : 'BELOW TARGET'}
                    </Badge>
                  </div>

                  {/* Warnings */}
                  {result.warnings.length > 0 && (
                    <Alert variant="warning">
                      <ul className="list-disc list-inside space-y-1">
                        {result.warnings.map((warning, i) => (
                          <li key={i}>{warning}</li>
                        ))}
                      </ul>
                    </Alert>
                  )}

                  {/* Suggestions */}
                  {result.suggestions && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Suggestions to Meet Target</h4>
                      <div className="space-y-2 text-sm bg-blue-50 p-3 rounded-lg">
                        {result.suggestions.N_needed && (
                          <div>Need at least <span className="font-medium">{result.suggestions.N_needed} total rooms</span></div>
                        )}
                        {result.suggestions.P_needed && (
                          <div>Need <span className="font-medium">{formatMoney(result.suggestions.P_needed)}</span> per room</div>
                        )}
                        {result.suggestions.R_allowed && (
                          <div>Maximum rent: <span className="font-medium">{formatMoney(result.suggestions.R_allowed)}</span></div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  Fill in the form and click Calculate to see results
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Footnote */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            Rounding policy: Total rooms (N) rounded up to ensure profit ≥ target. Reserved rooms (S) rounded down when derived.
          </p>
        </div>
      </div>
    </div>
  )
}

