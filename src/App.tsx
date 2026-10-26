// import { useState } from 'react'
// import heroImg from './assets/hero.png'
// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
import "./App.css";
import FinancialChart from "./components/FinancialChart";
import { SimulateSavings } from "./utils/simulateSavings";
import type { FinancialInputs } from "./types/finance";
import { useState,useEffect, useMemo } from "react";
import FinancialInputsForm from "./components/FinancialInputsForm";
function App() {
  
  type EditableSeries = "income" | "expenses";
  const [baseInputs, setBaseInputs] = useState<FinancialInputs>({
    // startingSavings: 1000,
    // savingsGoal: 150000,
    // monthlyIncome: 50000,
    // monthlyExpenses: 30000,
    // annualInterestRate: 10,
    // incomeChanges: [{ month: 3, newAmount: 65000 }],
    // expenseChanges: [{ month: 2, newAmount: 45000 }],
    startingSavings: 0,
    savingsGoal: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    annualInterestRate: 0,
    incomeChanges: [],
    expenseChanges: [],
  });
  useEffect(() => {
    console.log("Updated baseInputs:", baseInputs);
  }, [baseInputs]);

  // const simulationResult = SimulateSavings(baseInputs);
    const simulationResult = useMemo(() => {
    return SimulateSavings(baseInputs);
  }, [baseInputs]);
  const handleAssumptionsChange = (
    series: EditableSeries,
    month: number,
    newAmount: number,
  ) => {
    console.log(series);
    console.log(month);
    console.log(newAmount);
    if (series == "income") {
      setBaseInputs((previousInputs) => {
        const existingIncomeIndex = previousInputs.incomeChanges.findIndex(
          (change) => change.month === month,
        );
        let newIncomeChanges;
        if (existingIncomeIndex >= 0) {
          newIncomeChanges = previousInputs.incomeChanges.map((change) =>
            change.month === month ? { ...change, newAmount } : change,
          );
        } else {
          newIncomeChanges = [
            ...previousInputs.incomeChanges,
            {
              month,
              newAmount,
            },
          ];
        }
        return { ...previousInputs, incomeChanges:newIncomeChanges };
      });
    }
    if (series == "expenses") {
      setBaseInputs((previousInputs) => {
        const existingExpenseIndex = previousInputs.expenseChanges.findIndex(
          (change) => change.month === month,
        );
        let newExpenseChanges;
        if (existingExpenseIndex >= 0) {
          newExpenseChanges = previousInputs.expenseChanges.map((change) =>
            change.month === month ? { ...change, newAmount } : change,
          );
        } else {
          newExpenseChanges = [
            ...previousInputs.expenseChanges,
            {
              month,
              newAmount,
            },
          ];
        }
        return { ...previousInputs, expenseChanges:newExpenseChanges };
      });
    }
    console.log(baseInputs);
  };
  return (
    <main className="min-h-screen bg-slate-950 p-8 text-white">
      <h1 className="text-3xl font-bold">Financial Future Simulator</h1>

      <p className="mt-3 text-slate-300">
        Plan today. Explore your financial future.
      </p>
      <FinancialInputsForm onSubmit={setBaseInputs} /><br/>
      <div className={baseInputs.savingsGoal?"":"hidden"}>{baseInputs.savingsGoal && <FinancialChart
        projections={simulationResult.projections}
        savingsGoal={baseInputs.savingsGoal}
        onAssumptionsChange={handleAssumptionsChange}
      />}</div>
      
    </main>
  );
}

export default App;
