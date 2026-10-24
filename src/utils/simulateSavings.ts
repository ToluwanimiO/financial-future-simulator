import type { FinancialInputs, MonthlyProjection, SimulationResult} from '../types/finance'

export function SimulateSavings(inputs:FinancialInputs):SimulationResult{
    const {startingSavings, savingsGoal, monthlyIncome, monthlyExpenses, annualInterestRate, incomeChanges, expenseChanges} = inputs
    let totalSaved = startingSavings
    let income = monthlyIncome
    let expense = monthlyExpenses
    const projections: MonthlyProjection[] = [
        {
            month: 0,
            income:income,
            expenses: expense,
            interestEarned:0,
            savingsBalance:totalSaved
        }
    ]
    for (let month = 1; totalSaved <= savingsGoal; month++ ){
        const newIncome = incomeChanges.filter(incomeChange => incomeChange.month == month)
        if (newIncome.length){
             income = newIncome[0].newAmount
        }
        const newExpense = expenseChanges.filter(expenseChange => expenseChange.month == month)
        if (newExpense.length){
             expense = newExpense[0].newAmount
        }
        const monthlyInterest = Math.pow(1 + annualInterestRate, 1/12) - 1
        const interestEarned = totalSaved * monthlyInterest
        totalSaved = totalSaved + interestEarned + monthlyIncome - monthlyExpenses
        projections.push({
            month: month,
            income:income,
            expenses: expense,
            interestEarned:interestEarned,
            savingsBalance:totalSaved
        })
    }
    return {
        projections:projections
    }
}