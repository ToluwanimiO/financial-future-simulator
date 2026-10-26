import { useState } from "react";
import type { FinancialInputs } from "../types/finance";

interface FinancialInputsFormProps {
  onSubmit: (inputs: FinancialInputs) => void;
}

function FinancialInputsForm({ onSubmit }: FinancialInputsFormProps) {
  const [startingSavings, setStartingSavings] = useState("0");
  const [savingsGoal, setSavingsGoal] = useState("");
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [monthlyExpenses, setMonthlyExpenses] = useState("");
  const [annualInterestRate, setAnnualInterestRate] = useState("0");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const inputs: FinancialInputs = {
      startingSavings: Number(startingSavings),
      savingsGoal: Number(savingsGoal),
      monthlyIncome: Number(monthlyIncome),
      monthlyExpenses: Number(monthlyExpenses),
      annualInterestRate: Number(annualInterestRate),
      incomeChanges: [],
      expenseChanges: [],
    };

    onSubmit(inputs);
  }

  const fields = [
    {
      label: "Starting savings (₦)",
      value: startingSavings,
      setter: setStartingSavings,
      min: "0",
      step: "1",
    },
    {
      label: "Savings goal (₦)",
      value: savingsGoal,
      setter: setSavingsGoal,
      min: "1",
      step: "1",
    },
    {
      label: "Monthly income (₦)",
      value: monthlyIncome,
      setter: setMonthlyIncome,
      min: "0",
      step: "1",
    },
    {
      label: "Monthly expenses (₦)",
      value: monthlyExpenses,
      setter: setMonthlyExpenses,
      min: "0",
      step: "1",
    },
    {
      label: "Annual interest rate on savings (%)",
      value: annualInterestRate,
      setter: setAnnualInterestRate,
      min: "0",
      step: "0.1",
    },
  ];
  const formatNumber = (value: string) => {
    const digits = value.replace(/,/g, "");

    if (digits === "") return "";

    const number = Number(digits);

    if (!Number.isFinite(number)) return "";

    return number.toLocaleString("en-NG");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
    >
      <h2 className="text-lg font-semibold text-slate-900">
        Your financial details
      </h2>

      <p className="mt-1 text-sm text-slate-500">
        Enter your current finances to see how long it could take to reach your
        savings goal.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {fields.map((field) => (
          <div key={field.label}>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              {field.label}
            </label>

            <input
              type="text"
              min={field.min}
              step={field.step}
              required
              value={formatNumber(field.value)}
              onChange={(event) => {
                const rawValue = event.target.value.replace(/,/g, "");

                if (/^\d*$/.test(rawValue)) {
                  field.setter(rawValue);
                }
              }}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </div>
        ))}
      </div>

      <button
        type="submit"
        className="mt-6 w-full rounded-xl bg-emerald-700 px-4 py-3 font-semibold text-white transition hover:bg-emerald-800 sm:w-auto"
      >
        Calculate my projection
      </button>
    </form>
  );
}

export default FinancialInputsForm;
