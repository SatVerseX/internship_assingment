import { useApp } from "../context/AppContext";
import { CATEGORY_ICONS } from "../data/mockTransactions";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";

const formatCurrency = (val) => "₹" + Number(val).toLocaleString("en-IN");

const DONUT_COLORS = ["#01071c", "#006c4a", "#7f87a2", "#3e465e", "#565e77", "#fb3e38", "#171f35", "#76777c", "#45474c"];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface-lowest py-3 px-4 rounded-md shadow-elevated text-xs">
      <p className="font-bold mb-1 text-on-surface">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color || p.fill }} className="font-semibold">
          {p.name}: {formatCurrency(p.value)}
        </p>
      ))}
    </div>
  );
}

export default function Insights() {
  const { insights, monthlyData, categoryData, transactions, totals } = useApp();

  if (transactions.length === 0) {
    return (
      <div className="animate-fade-in">
        <div className="mb-10">
          <h2 className="font-headline text-3xl font-extrabold tracking-tight text-on-surface max-md:text-xl">
            Equity Slate Analytics
          </h2>
        </div>
        <div className="text-center py-16 px-8 text-on-primary-container">
          <span className="material-symbols-outlined text-5xl opacity-30 mb-4 block">show_chart</span>
          <h3 className="font-headline font-bold text-on-surface mb-2">Not enough data to generate insights</h3>
          <p className="text-sm">Add some transactions to see your financial analytics.</p>
        </div>
      </div>
    );
  }

  const efficiency = totals.income > 0
    ? ((totals.balance / totals.income) * 100).toFixed(1)
    : 0;

  const topCategories = categoryData.slice(0, 3);

  return (
    <div className="animate-fade-in">
      {/* top insights */}
      <div className="grid grid-cols-[2fr_1fr] gap-6 mb-10 max-lg:grid-cols-1">
        {/* flow chart */}
        <div className="animate-slide-up stagger-1 bg-surface-lowest rounded-lg p-8 max-md:p-5">
          <div className="flex justify-between items-start mb-8 max-md:mb-4">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-[0.1em] text-on-surface-variant mb-2">
                Cash Flow Dynamics
              </h2>
              <p className="font-headline tabular-nums text-4xl font-bold tracking-tight max-md:text-2xl">
                {formatCurrency(totals.income)}
              </p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyData} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11, fontWeight: 600 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <ReTooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} />
              <Bar dataKey="expenses" fill="var(--color-surface-low)" radius={[2, 2, 0, 0]} name="Expenses">
                {monthlyData.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={i === monthlyData.length - 1 ? "#01071c" : "var(--color-surface-low)"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* quick stats */}
        <div className="flex flex-col gap-6">
          <div className="animate-slide-up stagger-2 bg-surface-low rounded-lg p-6 border-l-4 border-secondary max-md:p-5">
            <h3 className="text-[0.6875rem] uppercase tracking-[0.15em] text-on-surface-variant font-bold mb-1">Net Savings</h3>
            <p className="font-headline tabular-nums text-2xl font-bold">{formatCurrency(insights.savingsThisMonth)}</p>
            <p className="text-xs text-secondary font-medium mt-2">
              {insights.monthlyChange <= 0 ? "↓" : "↑"} {Math.abs(insights.monthlyChange)}% from last month
            </p>
          </div>

          <div className="animate-slide-up stagger-3 bg-surface-low rounded-lg p-6 border-l-4 border-primary max-md:p-5">
            <h3 className="text-[0.6875rem] uppercase tracking-[0.15em] text-on-surface-variant font-bold mb-1">Efficiency Index</h3>
            <p className="font-headline text-2xl font-bold">{efficiency}</p>
            <div className="w-full h-1 bg-surface-high rounded-full mt-4 overflow-hidden">
              <div className="h-full rounded-full bg-primary transition-[width] duration-1000" style={{ width: `${Math.min(efficiency, 100)}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* specific insights */}
      <h3 className="font-headline text-xl font-bold text-on-surface mb-6 max-md:text-base">Spending Observations</h3>
      <div className="grid grid-cols-4 gap-6 mb-10 max-lg:grid-cols-2 max-md:!grid-cols-1">
        {topCategories.map((cat, i) => (
          <div key={cat.name} className={`animate-slide-up stagger-${i + 2} bg-surface-lowest rounded-lg p-6 transition-all duration-200 hover:bg-surface-low max-md:p-5`}>
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center mb-4"
              style={{
                background: i === 0 ? "rgba(251,62,56,0.1)" : i === 1 ? "var(--color-secondary-container)" : "var(--color-surface-high)",
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{
                  color: i === 0 ? "var(--color-on-tertiary-container)" : i === 1 ? "var(--color-on-secondary-container)" : "var(--color-on-surface)",
                }}
              >
                {CATEGORY_ICONS[cat.name] || "category"}
              </span>
            </div>
            <h4 className="font-bold text-sm mb-1 text-on-surface">{cat.name}</h4>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              {formatCurrency(cat.value)} spent ({cat.percentage}% of total expenses)
            </p>
          </div>
        ))}

        {/* auto generated tips */}
        <div className="animate-slide-up stagger-5 bg-primary-container rounded-lg p-6 text-white [[data-theme='dark']_&]:bg-surface-high max-md:p-5">
          <h4 className="font-bold text-sm text-white mt-2 [[data-theme='dark']_&]:text-on-surface">
            {insights.highestCategory ? "Optimization Available" : "Analyzing..."}
          </h4>
          <p className="text-xs text-on-primary-container mt-3 leading-relaxed">
            {insights.highestCategory
              ? `Reducing ${insights.highestCategory.name} by 10% could save ${formatCurrency(Math.round(insights.highestCategory.amount * 0.1))}/month.`
              : "Not enough data yet."}
          </p>
        </div>
      </div>

      {/* final stats section */}
      <div className="grid grid-cols-[2fr_3fr] gap-6 max-lg:grid-cols-1">
        {/* ring chart */}
        <div className="animate-slide-up stagger-4 bg-surface-lowest rounded-lg p-8 max-md:p-5">
          <h3 className="font-headline text-lg font-bold mb-8 max-md:mb-4">Category Proportions</h3>
          <div className="flex flex-col items-center gap-8">
            <div className="relative w-48 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={55} outerRadius={75} dataKey="value" paddingAngle={2} strokeWidth={0}>
                    {categoryData.map((entry, i) => (
                      <Cell key={entry.name} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />
                    ))}
                  </Pie>
                  <ReTooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-headline text-2xl font-bold">{categoryData[0]?.percentage || 0}%</span>
                <span className="text-[0.625rem] uppercase text-on-surface-variant">{categoryData[0]?.name || ""}</span>
              </div>
            </div>
            <div className="w-full flex flex-col gap-3">
              {categoryData.slice(0, 5).map((cat, i) => (
                <div key={cat.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-on-surface-variant">
                    <div className="w-2 h-2 rounded-full" style={{ background: DONUT_COLORS[i % DONUT_COLORS.length] }} />
                    <span>{cat.name}</span>
                  </div>
                  <span className="font-bold tabular-nums">{formatCurrency(cat.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* extra grid stats */}
        <div className="grid grid-cols-2 gap-6 content-start max-md:grid-cols-1">
          {/* big ticket item */}
          {insights.highestExpense && (
            <div className="animate-slide-up stagger-5 bg-surface-lowest rounded-lg p-6 max-md:p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-xl text-on-tertiary-container">priority_high</span>
                <span className="text-[0.6875rem] uppercase tracking-[0.15em] font-bold text-on-surface-variant">Highest Expense</span>
              </div>
              <p className="font-headline tabular-nums text-xl font-bold mb-1">{formatCurrency(insights.highestExpense.amount)}</p>
              <p className="text-xs text-on-surface-variant">{insights.highestExpense.description}</p>
            </div>
          )}

          {/* common charges */}
          {insights.mostFrequentCategory && (
            <div className="animate-slide-up stagger-5 bg-surface-lowest rounded-lg p-6 max-md:p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-xl text-secondary">repeat</span>
                <span className="text-[0.6875rem] uppercase tracking-[0.15em] font-bold text-on-surface-variant">Most Frequent</span>
              </div>
              <p className="font-headline text-xl font-bold mb-1">{insights.mostFrequentCategory.name}</p>
              <p className="text-xs text-on-surface-variant">{insights.mostFrequentCategory.count} transactions</p>
            </div>
          )}

          {/* daily burn rate */}
          <div className="animate-slide-up stagger-6 bg-surface-lowest rounded-lg p-6 max-md:p-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-xl text-on-surface">calendar_today</span>
              <span className="text-[0.6875rem] uppercase tracking-[0.15em] font-bold text-on-surface-variant">Avg Daily Spend</span>
            </div>
            <p className="font-headline tabular-nums text-xl font-bold mb-1">{formatCurrency(insights.avgDailySpending)}</p>
            <p className="text-xs text-on-surface-variant">Over the last 30 days</p>
          </div>

          {/* net money saved */}
          <div className="animate-slide-up stagger-6 bg-surface-lowest rounded-lg p-6 max-md:p-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-xl text-secondary">savings</span>
              <span className="text-[0.6875rem] uppercase tracking-[0.15em] font-bold text-on-surface-variant">Monthly Savings</span>
            </div>
            <p className={`font-headline tabular-nums text-xl font-bold mb-1 ${insights.savingsThisMonth >= 0 ? "text-secondary" : "text-on-tertiary-container"}`}>
              {insights.savingsThisMonth >= 0 ? "+" : ""}{formatCurrency(insights.savingsThisMonth)}
            </p>
            <p className="text-xs text-on-surface-variant">Income − Expenses (this month)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
