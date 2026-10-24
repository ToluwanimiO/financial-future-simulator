
import ReactECharts from "echarts-for-react";

import type { MonthlyProjection } from "../types/finance";

interface FinancialChartProps {
  projections: MonthlyProjection[];
  savingsGoal: number;
}

function FinancialChart({
  projections,
  savingsGoal,
}: FinancialChartProps) {
  const option = {
    tooltip: {
      trigger: "axis",
      valueFormatter: (value: number) =>
        `₦${value.toLocaleString("en-NG")}`,
    },

    legend: {
      data: ["Income", "Expenses", "Savings"],
    },

    grid: {
      left: 80,
      right: 24,
      top: 60,
      bottom: 60,
    },

    xAxis: {
      type: "category",
      name: "Month",
      data: projections.map((entry) => `Month ${entry.month}`),
      boundaryGap: false,
    },

    yAxis: {
      type: "value",
      name: "Amount (₦)",
      axisLabel: {
        formatter: (value: number) =>
          `₦${value.toLocaleString("en-NG")}`,
      },
    },

    series: [
      {
        name: "Income",
        type: "line",
        smooth: false,
        showSymbol: true,
        data: projections.map((entry) => entry.income),
      },
      {
        name: "Expenses",
        type: "line",
        smooth: false,
        showSymbol: true,
        data: projections.map((entry) => entry.expenses),
      },
      {
        name: "Savings",
        type: "line",
        smooth: false,
        showSymbol: true,
        data: projections.map((entry) => entry.savingsBalance),
        markLine: {
          silent: true,
          symbol: "none",
          data: [{ yAxis: savingsGoal, name: "Savings goal" }],
          label: {
            formatter: "Goal",
          },
        },
      },
    ],
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="mb-1 text-lg font-semibold text-slate-900">
        Your financial projection
      </h2>

      <p className="mb-4 text-sm text-slate-500">
        Explore how your income, expenses, and savings may change over time.
      </p>

      {projections.length > 0 ? (
        <ReactECharts
          option={option}
          style={{ height: "420px", width: "100%" }}
          notMerge
          lazyUpdate
        />
      ) : (
        <p className="py-12 text-center text-slate-500">
          Enter your financial details to see your projection.
        </p>
      )}
    </section>
  );
}

export default FinancialChart;
