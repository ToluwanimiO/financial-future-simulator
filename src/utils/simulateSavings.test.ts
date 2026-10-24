import { describe, expect, it } from 'vitest'
import { SimulateSavings } from './simulateSavings'
import type { FinancialInputs } from '../types/finance'

const baseInputs: FinancialInputs = {
  startingSavings: 1000,
  savingsGoal: 1500,
  monthlyIncome: 500,
  monthlyExpenses: 300,
  annualInterestRate: 0,
  incomeChanges: [],
  expenseChanges: [],
}

describe('simulateSavings', () => {
  it('calculates monthly savings correctly', () => {
    const result = SimulateSavings(baseInputs)

    expect(result.projections[1].savingsBalance).toBe(1200)
    expect(result.projections[2].savingsBalance).toBe(1400)
    expect(result.projections[3].savingsBalance).toBe(1600)
  })

  it('finds how many month it takes to reach goal', () => {
    const projections = SimulateSavings(baseInputs).projections

    expect(projections[projections.length-1].month).toBe(3)
  })

  it('applies scheduled income increases', () => {
    const result = SimulateSavings({
      ...baseInputs,
      incomeChanges: [{ month: 2, newAmount: 600 }],
    })

    expect(result.projections[1].income).toBe(500)
    expect(result.projections[2].income).toBe(600)
  })
})