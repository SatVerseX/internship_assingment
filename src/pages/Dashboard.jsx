import { useApp } from "../context/AppContext";
import { CATEGORY_ICONS, CATEGORY_COLORS } from "../data/mockTransactions";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip,
  ResponsiveContainer, Area, AreaChart, PieChart, Pie, Cell, Legend,
} from "recharts";

const formatCurrency = (val) => "₹" + Number(val).toLocaleString("en-IN");

const DONUT_COLORS = ["#01071c", "#006c4a", "#3e465e", "#565e77", "#7f87a2", "#fb3e38", "#171f35", "#76777c", "#45474c"];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface-lowest py-3 px-4 rounded-md shadow-elevated text-xs">
      <p className="font-bold mb-2 text-on-surface">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-semibold">
          {p.name}: {formatCurrency(p.value)}
        </p>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const { totals, monthlyData, categoryData, transactions, insights } = useApp();

  // detect time for greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const userName = "Satish"; // Matches the mock user in the Sidebar

  const balanceChange = insights.savingsThisMonth !== undefined && totals.income > 0
    ? ((totals.balance / totals.income) * 100).toFixed(1)
    : 0;

  const recentTxs = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 4);

  const maxCategoryValue = categoryData.length > 0 ? categoryData[0].value : 1;
  const isPositiveSavings = insights.savingsThisMonth >= 0;

  return (
    <div className="animate-fade-in">
      {/* friendly greeting */}
      <div className="mb-10">
        <h2 className="font-headline text-3xl font-extrabold tracking-tight text-on-surface max-md:text-2xl">
          {greeting}, {userName}.
        </h2>
        <p className="text-on-surface-variant mt-1.5 text-sm font-medium">
          Here is what's happening with your money right now.
        </p>
      </div>

      {/* top cards overview */}
      <div className="grid grid-cols-12 gap-6 mb-8 max-md:grid-cols-1 max-lg:grid-cols-6">
        {/* left block */}
        <div className="col-span-4 max-lg:col-span-3 max-md:col-span-1 flex flex-col gap-6">
          {/* show overall balance */}
          <div className="animate-slide-up stagger-1 relative p-6 rounded-lg bg-linear-to-br from-[#01071c] to-[#171f35] text-white overflow-hidden [[data-theme='dark']_&]:from-[#1a2028] [[data-theme='dark']_&]:to-[#222830] [[data-theme='dark']_&]:border [[data-theme='dark']_&]:border-surface-high">
            <div className="relative z-10">
              <p className="text-[0.6875rem] uppercase tracking-[0.15em] font-bold text-on-primary-container mb-3">Your Total Balance</p>
              <h3 className="font-headline font-extrabold tracking-tight tabular-nums text-[2.75rem] max-md:text-2xl text-white mb-3">
                {formatCurrency(totals.balance)}
              </h3>
              <div className="flex items-center gap-2 mt-3">
                <span
                  className="py-0.5 px-2 rounded-full text-xs font-bold"
                  style={{
                    background: totals.balance >= 0 ? "rgba(0,108,74,0.2)" : "rgba(251,62,56,0.2)",
                    color: totals.balance >= 0 ? "#85f8c4" : "#ffb4ab",
                  }}
                >
                  {totals.balance >= 0 ? "+" : ""}{balanceChange}%
                </span>
                <span className="text-sm font-medium text-on-primary-container">compared to last month</span>
              </div>
            </div>
            <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-[6rem] opacity-[0.06] transition-transform duration-700 hover:scale-110">
              account_balance
            </span>
          </div>

          {/* contextual text summary */}
          <div className="animate-slide-up stagger-2 bg-surface-lowest rounded-lg p-6 border-l-4 border-primary pl-6">
            <p className="text-sm text-on-surface-variant leading-relaxed">
              {isPositiveSavings ? (
                <>You're looking good! You've put away <strong className="text-on-surface">{formatCurrency(insights.savingsThisMonth)}</strong> so far this month. </>
              ) : (
                <>Take a breath. You've spent <strong className="text-on-surface">{formatCurrency(Math.abs(insights.savingsThisMonth))}</strong> more than you've earned this month. </>
              )}
              {insights.highestCategory && (
                <>Most of your spending went towards <strong className="text-on-surface">{insights.highestCategory.name}</strong>.</>
              )}
            </p>
          </div>
        </div>

        {/* right block */}
        <div className="col-span-8 max-lg:col-span-3 max-md:col-span-1 animate-slide-up stagger-2 bg-surface-lowest rounded-lg p-8 max-md:p-4">
          <div className="flex justify-between items-center mb-8 max-md:flex-col max-md:items-start max-md:gap-2 max-md:mb-4">
            <div>
              <h3 className="font-headline text-lg font-bold text-on-surface">Cash Flow Overview</h3>
              <p className="text-xs text-on-primary-container mt-0.5">Your income versus expenses over the last few months</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={monthlyData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#006c4a" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#006c4a" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fb3e38" stopOpacity={0.1} />
                  <stop offset="100%" stopColor="#fb3e38" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11, fontWeight: 600 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <ReTooltip content={<CustomTooltip />} cursor={{ fill: "transparent", stroke: "transparent" }} />
              <Area type="monotone" dataKey="income" stroke="#006c4a" strokeWidth={2} fill="url(#incomeGrad)" name="Money In" />
              <Area type="monotone" dataKey="expenses" stroke="#fb3e38" strokeWidth={2} fill="url(#expenseGrad)" name="Money Out" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* mid section */}
      <div className="grid grid-cols-12 gap-6 mb-8 max-md:grid-cols-1 max-lg:grid-cols-6">
        {/* show income */}
        <div className="col-span-4 max-lg:col-span-3 max-md:col-span-1 animate-slide-up stagger-3 p-6 rounded-lg bg-surface-lowest">
          <div className="w-10 h-10 rounded-md flex items-center justify-center bg-secondary/10 text-secondary mb-4">
            <span className="material-symbols-outlined">trending_up</span>
          </div>
          <p className="text-[0.6875rem] uppercase tracking-[0.15em] font-bold text-on-primary-container mb-3">Money In (This Month)</p>
          <h5 className="font-headline font-extrabold tracking-tight text-2xl text-on-surface tabular-nums">{formatCurrency(totals.income)}</h5>
        </div>

        {/* show expenses */}
        <div className="col-span-4 max-lg:col-span-3 max-md:col-span-1 animate-slide-up stagger-4 p-6 rounded-lg bg-surface-lowest">
          <div className="w-10 h-10 rounded-md flex items-center justify-center bg-on-tertiary-container/10 text-on-tertiary-container mb-4">
            <span className="material-symbols-outlined">payments</span>
          </div>
          <p className="text-[0.6875rem] uppercase tracking-[0.15em] font-bold text-on-primary-container mb-3">Money Out (This Month)</p>
          <h5 className="font-headline font-extrabold tracking-tight text-2xl text-on-surface tabular-nums">{formatCurrency(totals.expenses)}</h5>
        </div>

        {/* progress bars */}
        <div className="col-span-4 max-lg:col-span-6 max-md:col-span-1 animate-slide-up stagger-5 bg-surface-lowest rounded-lg p-6">
          <h4 className="font-headline text-sm font-bold mb-5">Where your money went</h4>
          {categoryData.slice(0, 5).map((cat, i) => (
            <div key={cat.name} className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold">{cat.name}</span>
                <span className="text-xs font-bold">{formatCurrency(cat.value)}</span>
              </div>
              <div className="h-2 w-full bg-surface-mid rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-[width] duration-800"
                  style={{
                    width: `${(cat.value / maxCategoryValue) * 100}%`,
                    background: DONUT_COLORS[i % DONUT_COLORS.length],
                    opacity: 1 - i * 0.15,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* latest tx */}
      <div className="animate-slide-up stagger-6 bg-surface-lowest rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-headline text-lg font-bold">Latest Activity</h3>
        </div>
        <div className="grid grid-cols-2 gap-x-12 gap-y-4 max-lg:grid-cols-1">
          {recentTxs.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between py-3 px-4 rounded-md hover:bg-surface-low transition-colors duration-150 cursor-default">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0 ${
                  tx.type === "income"
                    ? "bg-secondary/10 text-secondary"
                    : "bg-surface-mid text-on-surface"
                }`}>
                  <span className="material-symbols-outlined text-lg">
                    {CATEGORY_ICONS[tx.category] || "receipt_long"}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-bold text-on-surface">{tx.description}</p>
                  <p className="text-[0.625rem] uppercase tracking-[0.1em] font-medium text-on-primary-container mt-0.5">
                    {tx.category} · {new Date(tx.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                  </p>
                </div>
              </div>
              <span className={`text-sm font-bold tabular-nums ${
                tx.type === "income" ? "text-secondary" : "text-on-tertiary-container"
              }`}>
                {tx.type === "income" ? "+" : "-"}{formatCurrency(tx.amount)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}