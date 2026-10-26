import ReactECharts from "echarts-for-react";
import { useRef, useEffect, useState } from "react";
import type { ECharts } from "echarts";

import type { MonthlyProjection } from "../types/finance";
type EditableSeries = "income" | "expenses";

interface FinancialChartProps {
  projections: MonthlyProjection[];
  savingsGoal: number;
  onAssumptionsChange: (
    series: EditableSeries,
    month: number,
    newAmount: number,
  ) => void;
}

function FinancialChart({
  projections,
  savingsGoal,
  onAssumptionsChange,
}: FinancialChartProps) {
  const chartRef = useRef<ReactECharts>(null);
  const [chart, setChart] = useState<ECharts | null>(null);
  const monthsToGoal = projections[projections.length - 1].month

  const option = {
    tooltip: {
      trigger: "axis",
      valueFormatter: (value: number) => `₦${value.toLocaleString("en-NG")}`,
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
        formatter: (value: number) => `₦${value.toLocaleString("en-NG")}`,
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

  useEffect(() => {
    if (!chart || projections.length === 0) return;

    // Wait for the current chart update to complete.
    const timeoutId = setTimeout(() => {
      if (chart.isDisposed()) return;

      function createHandles(series: EditableSeries) {
        return projections
          .map((entry, index) => {
            const amount = series === "income" ? entry.income : entry.expenses;

            const position = chart?.convertToPixel("grid", [
              index,
              amount,
            ]) as number[];

            if (
              !Array.isArray(position) ||
              position.length < 2 ||
              !position.every(Number.isFinite)
            ) {
              return null;
            }

            return {
              id: `${series}-${entry.month}`,
              type: "circle",
              position,
              shape: { cx: 0, cy: 0, r: 9 },
              invisible: false,
              style: {
                fill: series === "income" ? "#3984e8" : "#bce261",
                stroke: "#ffffff",
                lineWidth: 2,
              },
              draggable: true,
              cursor: "ns-resize",
              z: 100,
              ondragend: function (this: { x: number; y: number }) {
                const coordinates = chart?.convertFromPixel("grid", [
                  this.x,
                  this.y,
                ]) as number[];

                if (!coordinates || !Number.isFinite(coordinates[1])) {
                  return;
                }

                onAssumptionsChange(
                  series,
                  entry.month,
                  Math.max(0, Math.round(coordinates[1])),
                );
              },
            };
          })
          .filter((handle) => handle !== null);
      }

      chart.setOption({
        graphic: [...createHandles("income"), ...createHandles("expenses")],
      });
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [chart, projections, onAssumptionsChange]);

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
          ref={chartRef}
          option={option}
          style={{ height: "420px", width: "100%" }}
          notMerge
          onChartReady={setChart}
        />
      ) : (
        <p className="py-12 text-center text-slate-500">
          Enter your financial details to see your projection.
        </p>
      )}
      {projections.length > 0 && (
  <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50 p-5">
    <p className="text-sm font-medium text-emerald-800">
      Time to reach your savings goal
    </p>

    {monthsToGoal !== undefined ? (
      <>
        <p className="mt-1 text-3xl font-bold text-emerald-900">
          {monthsToGoal === 0
            ? "Goal achieved!"
            : `${monthsToGoal} ${monthsToGoal === 1 ? "month" : "months"}`}
        </p>

        <p className="mt-1 text-sm text-emerald-700">
          {monthsToGoal === 0
            ? "Your savings already meet your target."
            : `You're projected to reach your ${savingsGoal.toLocaleString("en-NG", {
                style: "currency",
                currency: "NGN",
                maximumFractionDigits: 0,
              })} goal in ${monthsToGoal} ${monthsToGoal === 1 ? "month" : "months"}.`}
        </p>
      </>
    ) : (
      <>
        <p className="mt-1 text-xl font-bold text-amber-800">
          Goal not reached yet
        </p>
        <p className="mt-1 text-sm text-slate-600">
          Your savings goal wasn't reached within the simulated period.
        </p>
      </>
    )}
  </div>
)}
    </section>
  );
}

export default FinancialChart;
