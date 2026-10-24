export interface FinancialChange {
  month: number
  newAmount: number
}
export interface FinancialInputs {
  startingSavings: number
  savingsGoal: number
  monthlyIncome: number
  monthlyExpenses: number
  annualInterestRate: number
  incomeChanges: FinancialChange[]
  expenseChanges: FinancialChange[]
}

export interface MonthlyProjection {
  month: number
  income: number
  expenses: number
  interestEarned: number
  savingsBalance: number
}

export interface SimulationResult {
  projections: MonthlyProjection[]
}