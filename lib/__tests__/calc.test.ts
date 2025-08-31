import { describe, it, expect } from 'vitest'
import { solveUnknown, validateInputs, formatMoney, formatNumber } from '../calc'

describe('solveUnknown', () => {
  describe('solving for N (total rooms)', () => {
    it('should calculate N=9 for the €3500 rent example', () => {
      const result = solveUnknown({
        R: 3500,
        P: 725,
        S: 2,
        K: 1500,
        unknown: 'N'
      })

      expect(result.N).toBe(9)
      expect(result.rentableRooms).toBe(7)
      expect(result.income).toBe(5075)
      expect(result.profit).toBe(1575)
      expect(result.meetsTarget).toBe(true)
      expect(result.warnings).toHaveLength(0)
    })

    it('should calculate N=11 for the €4500 rent example', () => {
      const result = solveUnknown({
        R: 4500,
        P: 725,
        S: 2,
        K: 1500,
        unknown: 'N'
      })

      expect(result.N).toBe(11)
      expect(result.rentableRooms).toBe(9)
      expect(result.income).toBe(6525)
      expect(result.profit).toBe(2025)
      expect(result.meetsTarget).toBe(true)
    })

    it('should handle fractional N by rounding up', () => {
      const result = solveUnknown({
        R: 3000,
        P: 700,
        S: 1,
        K: 1000,
        unknown: 'N'
      })

      // N = ceil(1 + (3000 + 1000) / 700) = ceil(1 + 5.71) = ceil(6.71) = 7
      expect(result.N).toBe(7)
      expect(result.rentableRooms).toBe(6)
      expect(result.income).toBe(4200)
      expect(result.profit).toBe(1200)
      expect(result.meetsTarget).toBe(true)
    })
  })

  describe('solving for P (price per room)', () => {
    it('should calculate P correctly when N is fixed', () => {
      const result = solveUnknown({
        R: 3500,
        S: 2,
        K: 1500,
        N: 8,
        unknown: 'P'
      })

      // P = (R + K) / (N - S) = (3500 + 1500) / (8 - 2) = 5000 / 6 = 833.33
      expect(result.P).toBe(833.33)
      expect(result.rentableRooms).toBe(6)
      expect(result.income).toBe(5000)
      expect(result.profit).toBe(1500)
      expect(result.meetsTarget).toBe(true)
    })

    it('should throw error when N - S <= 0', () => {
      expect(() => {
        solveUnknown({
          R: 3500,
          S: 8,
          K: 1500,
          N: 8,
          unknown: 'P'
        })
      }).toThrow('Infeasible: N - S must be > 0 when solving for P')
    })
  })

  describe('solving for R (monthly rent)', () => {
    it('should calculate R correctly', () => {
      const result = solveUnknown({
        P: 725,
        S: 2,
        K: 1500,
        N: 9,
        unknown: 'R'
      })

      // R = (N - S) * P - K = (9 - 2) * 725 - 1500 = 5075 - 1500 = 3575
      expect(result.R).toBe(3575)
      expect(result.rentableRooms).toBe(7)
      expect(result.income).toBe(5075)
      expect(result.profit).toBe(1500)
      expect(result.meetsTarget).toBe(true)
    })

    it('should warn when calculated rent is negative', () => {
      const result = solveUnknown({
        P: 100,
        S: 1,
        K: 2000,
        N: 3,
        unknown: 'R'
      })

      // R = (3 - 1) * 100 - 2000 = 200 - 2000 = -1800
      expect(result.R).toBe(-1800)
      expect(result.warnings).toContain('Calculated rent is negative - check your inputs')
    })
  })

  describe('solving for S (reserved rooms)', () => {
    it('should calculate S and floor to integer', () => {
      const result = solveUnknown({
        R: 3500,
        P: 725,
        K: 1500,
        N: 9,
        unknown: 'S'
      })

      // S = N - (R + K) / P = 9 - (3500 + 1500) / 725 = 9 - 6.897 = 2.103 -> floor(2.103) = 2
      expect(result.S).toBe(2)
      expect(result.warnings).toContain('Reserved rooms was floored to nearest integer')
    })

    it('should adjust negative S to 0', () => {
      const result = solveUnknown({
        R: 5000,
        P: 500,
        K: 2000,
        N: 5,
        unknown: 'S'
      })

      // S = 5 - (5000 + 2000) / 500 = 5 - 14 = -9 -> adjusted to 0
      expect(result.S).toBe(0)
      expect(result.warnings).toContain('Reserved rooms adjusted to 0 (minimum)')
    })
  })

  describe('solving for K (target profit)', () => {
    it('should calculate K correctly', () => {
      const result = solveUnknown({
        R: 3500,
        P: 725,
        S: 2,
        N: 9,
        unknown: 'K'
      })

      // K = (N - S) * P - R = (9 - 2) * 725 - 3500 = 5075 - 3500 = 1575
      expect(result.K).toBe(1575)
      expect(result.rentableRooms).toBe(7)
      expect(result.income).toBe(5075)
      expect(result.profit).toBe(1575)
      expect(result.meetsTarget).toBe(true)
    })

    it('should warn when calculated profit is negative', () => {
      const result = solveUnknown({
        R: 5000,
        P: 500,
        S: 1,
        N: 5,
        unknown: 'K'
      })

      // K = (5 - 1) * 500 - 5000 = 2000 - 5000 = -3000
      expect(result.K).toBe(-3000)
      expect(result.warnings).toContain('Calculated target profit is negative')
    })
  })

  describe('suggestions when target not met', () => {
    it('should provide suggestions when profit below target and N is not unknown', () => {
      const result = solveUnknown({
        R: 4000,
        P: 600,
        S: 2,
        N: 8,
        unknown: 'P'
      })

      // With P unknown, we get P = (4000 + 0) / (8 - 2) = 4000 / 6 = 666.67
      // But let's test with a scenario where target is not met
      const result2 = solveUnknown({
        R: 4000,
        P: 500,
        S: 2,
        K: 2000,
        N: 8,
        unknown: 'R'
      })

      // R = (8-2) * 500 - 2000 = 3000 - 2000 = 1000
      // income = 6 * 500 = 3000, profit = 3000 - 1000 = 2000, meets target
      // Let's use a different scenario
      const result3 = solveUnknown({
        R: 4000,
        P: 500,
        S: 2,
        K: 1000,
        N: 6,
        unknown: 'R'
      })

      // R = (6-2) * 500 - 1000 = 2000 - 1000 = 1000
      // But we want R=4000, so let's solve for K instead
      const result4 = solveUnknown({
        R: 4000,
        P: 500,
        S: 2,
        N: 6,
        unknown: 'K'
      })

      // K = (6-2) * 500 - 4000 = 2000 - 4000 = -2000
      expect(result4.K).toBe(-2000)
      expect(result4.profit).toBe(-2000)
      expect(result4.meetsTarget).toBe(false)
      expect(result4.suggestions).toBeDefined()
      expect(result4.suggestions?.N_needed).toBe(10) // ceil(2 + (4000 + (-2000)) / 500)
      expect(result4.suggestions?.P_needed).toBe(500) // (4000 + (-2000)) / (6 - 2)
      expect(result4.suggestions?.R_allowed).toBe(4000) // (6 - 2) * 500 - (-2000)
    })
  })

  describe('infeasible scenarios', () => {
    it('should throw error when N - S <= 0', () => {
      expect(() => {
        solveUnknown({
          R: 3500,
          P: 725,
          S: 10,
          K: 1500,
          N: 8,
          unknown: 'K'
        })
      }).toThrow('Infeasible: Total rooms must be greater than reserved rooms')
    })
  })

  describe('money rounding', () => {
    it('should round money values to 2 decimal places', () => {
      const result = solveUnknown({
        R: 3333.333,
        S: 2,
        K: 1666.667,
        N: 8,
        unknown: 'P'
      })

      // P = (3333.333 + 1666.667) / (8 - 2) = 5000 / 6 = 833.3333...
      expect(result.P).toBe(833.33)
      expect(result.R).toBe(3333.33)
      expect(result.K).toBe(1666.67)
    })
  })
})

describe('validateInputs', () => {
  it('should validate correct inputs', () => {
    const result = validateInputs({
      R: 3500,
      P: 725,
      S: 2,
      K: 1500,
      N: 9,
      unknown: 'N'
    })

    expect(result.success).toBe(true)
  })

  it('should reject negative rent', () => {
    const result = validateInputs({
      R: -100,
      P: 725,
      S: 2,
      K: 1500,
      N: 9,
      unknown: 'N'
    })

    expect(result.success).toBe(false)
  })

  it('should reject zero price per room', () => {
    const result = validateInputs({
      R: 3500,
      P: 0,
      S: 2,
      K: 1500,
      N: 9,
      unknown: 'N'
    })

    expect(result.success).toBe(false)
  })

  it('should reject non-integer rooms', () => {
    const result = validateInputs({
      R: 3500,
      P: 725,
      S: 2.5,
      K: 1500,
      N: 9,
      unknown: 'N'
    })

    expect(result.success).toBe(false)
  })
})

describe('formatting functions', () => {
  describe('formatMoney', () => {
    it('should format money with Euro symbol', () => {
      expect(formatMoney(1234.56)).toBe('€1,234.56')
      expect(formatMoney(1000)).toBe('€1,000')
      expect(formatMoney(0.5)).toBe('€0.50')
    })
  })

  describe('formatNumber', () => {
    it('should format numbers with proper decimals', () => {
      expect(formatNumber(1234.56)).toBe('1,234.56')
      expect(formatNumber(1000)).toBe('1,000')
      expect(formatNumber(0.5)).toBe('0.5')
    })
  })
})

