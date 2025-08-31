import { z } from 'zod'

export type UnknownVariable = 'R' | 'P' | 'S' | 'K' | 'N'

export const inputSchema = z.object({
  R: z.number().min(0, 'Monthly rent must be ≥ 0'),
  P: z.number().min(0.01, 'Average rent per room must be > 0'),
  S: z.number().int().min(0, 'Reserved rooms must be ≥ 0'),
  K: z.number().min(0, 'Target profit must be ≥ 0'),
  N: z.number().int().min(1, 'Total rooms must be ≥ 1'),
  unknown: z.enum(['R', 'P', 'S', 'K', 'N']),
})

export type InputData = z.infer<typeof inputSchema>

export type Result = {
  R: number
  P: number
  S: number
  K: number
  N: number
  rentableRooms: number
  income: number
  profit: number
  meetsTarget: boolean
  warnings: string[]
  suggestions?: {
    N_needed?: number
    P_needed?: number
    R_allowed?: number
  }
}

export function validateInputs(data: Partial<InputData>): z.SafeParseResult<InputData> {
  return inputSchema.safeParse(data)
}

export function solveUnknown(input: Omit<InputData, input['unknown']> & { unknown: UnknownVariable }): Result {
  const { unknown } = input
  let R = input.R ?? 0
  let P = input.P ?? 0
  let S = input.S ?? 0
  let K = input.K ?? 0
  let N = input.N ?? 0

  const warnings: string[] = []
  
  // Solve for the unknown variable
  switch (unknown) {
    case 'N':
      N = Math.ceil(S + (R + K) / P)
      break
      
    case 'P':
      if (N - S <= 0) {
        throw new Error('Infeasible: N - S must be > 0 when solving for P')
      }
      P = (R + K) / (N - S)
      break
      
    case 'R':
      R = (N - S) * P - K
      if (R < 0) {
        warnings.push('Calculated rent is negative - check your inputs')
      }
      break
      
    case 'S':
      const calculatedS = N - (R + K) / P
      S = Math.floor(calculatedS)
      if (S !== calculatedS) {
        warnings.push('Reserved rooms was floored to nearest integer')
      }
      if (S < 0) {
        S = 0
        warnings.push('Reserved rooms adjusted to 0 (minimum)')
      }
      break
      
    case 'K':
      K = (N - S) * P - R
      if (K < 0) {
        warnings.push('Calculated target profit is negative')
      }
      break
  }

  // Validate feasibility
  if (N - S <= 0) {
    throw new Error('Infeasible: Total rooms must be greater than reserved rooms')
  }

  // Calculate derived values
  const rentableRooms = N - S
  const income = rentableRooms * P
  const profit = income - R
  const meetsTarget = profit >= K

  // Round money values to 2 decimal places
  const roundMoney = (val: number) => Math.round(val * 100) / 100

  const result: Result = {
    R: roundMoney(R),
    P: roundMoney(P),
    S: Math.round(S),
    K: roundMoney(K),
    N: Math.round(N),
    rentableRooms,
    income: roundMoney(income),
    profit: roundMoney(profit),
    meetsTarget,
    warnings,
  }

  // Add suggestions if target not met and N is fixed
  if (!meetsTarget && unknown !== 'N') {
    const suggestions: Result['suggestions'] = {}
    
    // Calculate needed N
    suggestions.N_needed = Math.ceil(S + (R + K) / P)
    
    // Calculate needed P (if feasible)
    if (N - S > 0) {
      suggestions.P_needed = roundMoney((R + K) / (N - S))
    }
    
    // Calculate allowed R
    suggestions.R_allowed = roundMoney((N - S) * P - K)
    
    result.suggestions = suggestions
  }

  return result
}

export function formatMoney(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(num)
}

