// import { useState } from 'react'
// import heroImg from './assets/hero.png'
// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
import './App.css'
import FinancialChart from './components/FinancialChart'
import { SimulateSavings } from './utils/simulateSavings'
import type { FinancialInputs } from './types/finance'

function App() {
  const baseInputs: FinancialInputs = {
    startingSavings: 1000,
    savingsGoal: 150000,
    monthlyIncome: 50000,
    monthlyExpenses: 30000,
    annualInterestRate: 10,
    incomeChanges: [{month:3,newAmount:65000}],
    expenseChanges: [{month:2,newAmount:45000}],
  }
  const simulationResult = SimulateSavings(baseInputs)
  return (
    <main className="min-h-screen bg-slate-950 p-8 text-white">
      <h1 className="text-3xl font-bold">
        Financial Future Simulator
      </h1>

      <p className="mt-3 text-slate-300">
        Plan today. Explore your financial future.
      </p>
      <FinancialChart projections={simulationResult.projections}
        savingsGoal={baseInputs.savingsGoal} />
    </main>
  )
}

export default App
