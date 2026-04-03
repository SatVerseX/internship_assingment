import { createContext, useContext, useState, useMemo, useEffect, useCallback } from "react";
import initialTransactions from "../data/mockTransactions";

const AppContext = createContext(null);

// storage utils
const loadState = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
};

const saveState = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch { /* silently fail */ }
};

// allowed paths
const VALID_PAGES = ["dashboard", "transactions", "insights"];

// read page on load
const getInitialPage = () => {
  const path = window.location.pathname.replace("/", "");
  return VALID_PAGES.includes(path) ? path : "dashboard";
};

export function AppProvider({ children }) {
  const [transactions, setTransactions] = useState(() =>
    loadState("fd_transactions", initialTransactions)
  );
  const [role, setRole] = useState(() => loadState("fd_role", "admin"));
  const [darkMode, setDarkMode] = useState(() => loadState("fd_darkMode", false));
  const [filters, setFilters] = useState({ type: "all", category: "all", search: "" });
  const [sortConfig, setSortConfig] = useState({ key: "date", direction: "desc" });
  const [isLoading, setIsLoading] = useState(true);
  
  // Native routing state
  const [activePage, setActivePage] = useState(getInitialPage);

  // brief artificial delay
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // save state changes
  useEffect(() => saveState("fd_transactions", transactions), [transactions]);
  useEffect(() => saveState("fd_role", role), [role]);
  useEffect(() => saveState("fd_darkMode", darkMode), [darkMode]);

  // update html theme
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // push url updates
  useEffect(() => {
    const currentPath = window.location.pathname.replace("/", "");
    if (currentPath !== activePage) {
      window.history.pushState(null, "", `/${activePage}`);
    }
  }, [activePage]);

  // handle browser back
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.replace("/", "");
      setActivePage(VALID_PAGES.includes(path) ? path : "dashboard");
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // methods
  const addTransaction = useCallback((tx) => {
    const newTx = { ...tx, id: crypto.randomUUID() };
    setTransactions((prev) => [newTx, ...prev]);
  }, []);

  const editTransaction = useCallback((id, updates) => {
    setTransactions((prev) =>
      prev.map((tx) => (tx.id === id ? { ...tx, ...updates } : tx))
    );
  }, []);

  const deleteTransaction = useCallback((id) => {
    setTransactions((prev) => prev.filter((tx) => tx.id !== id));
  }, []);

  // compute filtered view
  const filteredTransactions = useMemo(() => {
    let result = [...transactions];

    // type check
    if (filters.type !== "all") {
      result = result.filter((tx) => tx.type === filters.type);
    }

    // category check
    if (filters.category !== "all") {
      result = result.filter((tx) => tx.category === filters.category);
    }

    // filter by text
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(
        (tx) =>
          tx.description.toLowerCase().includes(q) ||
          tx.category.toLowerCase().includes(q) ||
          String(tx.amount).includes(q)
      );
    }

    // sort results
    result.sort((a, b) => {
      let cmp = 0;
      if (sortConfig.key === "date") {
        cmp = new Date(a.date) - new Date(b.date);
      } else if (sortConfig.key === "amount") {
        cmp = a.amount - b.amount;
      }
      return sortConfig.direction === "desc" ? -cmp : cmp;
    });

    return result;
  }, [transactions, filters, sortConfig]);

  // sum up balances
  const totals = useMemo(() => {
    const income = transactions
      .filter((tx) => tx.type === "income")
      .reduce((sum, tx) => sum + tx.amount, 0);
    const expenses = transactions
      .filter((tx) => tx.type === "expense")
      .reduce((sum, tx) => sum + tx.amount, 0);
    return { income, expenses, balance: income - expenses };
  }, [transactions]);

  // group by month
  const monthlyData = useMemo(() => {
    const months = {};
    transactions.forEach((tx) => {
      const key = tx.date.substring(0, 7); // YYYY-MM
      if (!months[key]) months[key] = { month: key, income: 0, expenses: 0 };
      if (tx.type === "income") months[key].income += tx.amount;
      else months[key].expenses += tx.amount;
    });
    return Object.values(months)
      .sort((a, b) => a.month.localeCompare(b.month))
      .map((m) => ({
        ...m,
        balance: m.income - m.expenses,
        label: new Date(m.month + "-01").toLocaleString("default", { month: "short" }),
      }));
  }, [transactions]);

  // group by expenses
  const categoryData = useMemo(() => {
    const cats = {};
    transactions
      .filter((tx) => tx.type === "expense")
      .forEach((tx) => {
        cats[tx.category] = (cats[tx.category] || 0) + tx.amount;
      });
    const total = Object.values(cats).reduce((s, v) => s + v, 0);
    return Object.entries(cats)
      .map(([name, value]) => ({
        name,
        value,
        percentage: total > 0 ? ((value / total) * 100).toFixed(1) : 0,
      }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  // calculate insights
  const insights = useMemo(() => {
    const now = new Date("2025-03-15"); // Reference date within our data range
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const prevMonth = `${now.getFullYear()}-${String(now.getMonth()).padStart(2, "0")}`;

    const currentMonthTx = transactions.filter((tx) => tx.date.startsWith(currentMonth));
    const prevMonthTx = transactions.filter((tx) => tx.date.startsWith(prevMonth));

    const currentExpenses = currentMonthTx
      .filter((tx) => tx.type === "expense")
      .reduce((s, tx) => s + tx.amount, 0);
    const prevExpenses = prevMonthTx
      .filter((tx) => tx.type === "expense")
      .reduce((s, tx) => s + tx.amount, 0);
    const currentIncome = currentMonthTx
      .filter((tx) => tx.type === "income")
      .reduce((s, tx) => s + tx.amount, 0);

    // find highest
    const catTotals = {};
    transactions
      .filter((tx) => tx.type === "expense")
      .forEach((tx) => {
        catTotals[tx.category] = (catTotals[tx.category] || 0) + tx.amount;
      });
    const highestCat = Object.entries(catTotals).sort((a, b) => b[1] - a[1])[0];

    // track trends
    const monthlyChange =
      prevExpenses > 0
        ? (((currentExpenses - prevExpenses) / prevExpenses) * 100).toFixed(1)
        : 0;

    // net diff
    const savingsThisMonth = currentIncome - currentExpenses;

    // largest purchase
    const expenseTxs = transactions.filter((tx) => tx.type === "expense");
    const highestExpense = expenseTxs.length
      ? expenseTxs.reduce((max, tx) => (tx.amount > max.amount ? tx : max), expenseTxs[0])
      : null;

    // popular category
    const catCounts = {};
    expenseTxs.forEach((tx) => {
      catCounts[tx.category] = (catCounts[tx.category] || 0) + 1;
    });
    const mostFrequentCat = Object.entries(catCounts).sort((a, b) => b[1] - a[1])[0];

    // daily spend avg
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const last30Expenses = expenseTxs
      .filter((tx) => new Date(tx.date) >= thirtyDaysAgo && new Date(tx.date) <= now)
      .reduce((s, tx) => s + tx.amount, 0);
    const avgDaily = (last30Expenses / 30).toFixed(0);

    return {
      highestCategory: highestCat ? { name: highestCat[0], amount: highestCat[1] } : null,
      monthlyChange: Number(monthlyChange),
      currentExpenses,
      prevExpenses,
      savingsThisMonth,
      currentIncome,
      highestExpense,
      mostFrequentCategory: mostFrequentCat
        ? { name: mostFrequentCat[0], count: mostFrequentCat[1] }
        : null,
      avgDailySpending: Number(avgDaily),
    };
  }, [transactions]);

  const value = {
    transactions,
    filteredTransactions,
    totals,
    monthlyData,
    categoryData,
    insights,
    role,
    setRole,
    darkMode,
    setDarkMode: () => setDarkMode((prev) => !prev),
    activePage,
    setActivePage,
    filters,
    setFilters,
    sortConfig,
    setSortConfig,
    addTransaction,
    editTransaction,
    deleteTransaction,
    isLoading,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}