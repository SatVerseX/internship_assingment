import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { CATEGORIES, CATEGORY_ICONS } from "../data/mockTransactions";
import TransactionModal from "../components/TransactionModal";

const formatCurrency = (val) => "₹" + Number(val).toLocaleString("en-IN");

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

export default function Transactions() {
  const {
    filteredTransactions, totals, role, filters, setFilters,
    sortConfig, setSortConfig, addTransaction, editTransaction, deleteTransaction,
  } = useApp();

  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const isAdmin = role === "admin";

  useEffect(() => {
    const handler = () => {
      setEditData(null);
      setModalOpen(true);
    };
    window.addEventListener("openTransactionModal", handler);
    return () => window.removeEventListener("openTransactionModal", handler);
  }, []);

  const handleSave = (formData) => {
    if (editData) {
      editTransaction(editData.id, formData);
    } else {
      addTransaction(formData);
    }
    setEditData(null);
  };

  const handleEdit = (tx) => {
    setEditData(tx);
    setModalOpen(true);
  };

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "desc" ? "asc" : "desc",
    }));
  };

  const sortArrow = (key) => {
    if (sortConfig.key !== key) return "";
    return sortConfig.direction === "desc" ? "arrow_downward" : "arrow_upward";
  };

  const netMargin = totals.income > 0
    ? (((totals.income - totals.expenses) / totals.income) * 100).toFixed(1)
    : 0;

  return (
    <div className="animate-fade-in">
      {/* page title area */}
      <div className="flex justify-between items-end mb-10 max-md:flex-col max-md:items-stretch max-md:gap-4">
        <div>
          <h2 className="font-headline text-3xl font-extrabold tracking-tight text-on-surface max-md:text-xl">
            Equity Slate Ledger
          </h2>
        </div>
        {isAdmin && (
          <button
            className="py-3 px-6 border-none rounded-lg text-sm font-bold cursor-pointer flex items-center gap-2 bg-linear-to-br from-[#01071c] to-[#171f35] text-white transition-all duration-200 hover:opacity-92 hover:-translate-y-0.5 [[data-theme='dark']_&]:from-[#bec6e3] [[data-theme='dark']_&]:to-[#8e96b0] [[data-theme='dark']_&]:text-[#01071c]"
            onClick={() => { setEditData(null); setModalOpen(true); }}
          >
            <span className="material-symbols-outlined text-xl">add_circle</span>
            Add Transaction
          </button>
        )}
      </div>

      {/* filter inputs */}
      <div className="flex justify-between items-center mb-6 gap-4 flex-wrap max-md:flex-col max-md:items-stretch">
        <div className="flex bg-surface-low rounded-full p-0.5 max-md:w-full max-md:justify-center">
          {["all", "income", "expense"].map((t) => (
            <button
              key={t}
              className={`py-2 px-5 rounded-full text-sm font-medium border-none cursor-pointer transition-all duration-200 ${
                filters.type === t
                  ? "bg-surface-lowest text-on-surface font-semibold"
                  : "bg-transparent text-on-primary-container hover:text-on-surface"
              }`}
              onClick={() => setFilters((prev) => ({ ...prev, type: t }))}
            >
              {t === "all" ? "All" : t === "income" ? "Income" : "Expense"}
            </button>
          ))}
        </div>
        <div className="flex gap-3 items-center max-md:justify-center">
          <div className="flex items-center gap-2 py-2 px-4 rounded-lg bg-surface-lowest text-sm font-medium cursor-pointer">
            <span className="material-symbols-outlined text-lg">sort</span>
            <select
              className="border-none bg-transparent text-sm font-medium text-on-surface cursor-pointer outline-none appearance-none font-sans"
              value={`${sortConfig.key}-${sortConfig.direction}`}
              onChange={(e) => {
                const [key, direction] = e.target.value.split("-");
                setSortConfig({ key, direction });
              }}
            >
              <option value="date-desc">Newest</option>
              <option value="date-asc">Oldest</option>
              <option value="amount-desc">Highest</option>
              <option value="amount-asc">Lowest</option>
            </select>
          </div>
          <div className="flex items-center gap-2 py-2 px-4 rounded-lg bg-surface-lowest text-sm font-medium cursor-pointer">
            <span className="material-symbols-outlined text-lg">filter_list</span>
            <select
              className="border-none bg-transparent text-sm font-medium text-on-surface cursor-pointer outline-none appearance-none font-sans"
              value={filters.category}
              onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value }))}
            >
              <option value="all">Category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* data table */}
      <div className="bg-surface-lowest rounded-lg p-2 max-md:p-0 max-md:rounded-md">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-16 px-8 text-on-primary-container">
            <span className="material-symbols-outlined text-5xl opacity-30 mb-4 block">search_off</span>
            <h3 className="font-headline font-bold text-on-surface mb-2">No results found</h3>
            <p className="text-sm">Try adjusting your filters or search query.</p>
          </div>
        ) : (
          <div className="overflow-x-auto max-md:-webkit-overflow-scrolling-touch">
            <table className="w-full border-collapse text-left max-md:min-w-[36rem] max-md:text-[0.8125rem]">
              <thead>
                <tr className="border-b border-surface-mid">
                  <th
                    className="py-4 px-5 text-[0.6875rem] uppercase tracking-[0.1em] font-semibold text-on-primary-container cursor-pointer select-none hover:text-on-surface max-md:py-3 max-md:px-4 max-md:text-[0.625rem] max-md:whitespace-nowrap"
                    onClick={() => handleSort("date")}
                  >
                    Date
                    {sortArrow("date") && (
                      <span className="material-symbols-outlined text-sm align-middle ml-1">{sortArrow("date")}</span>
                    )}
                  </th>
                  <th className="py-4 px-5 text-[0.6875rem] uppercase tracking-[0.1em] font-semibold text-on-primary-container">Description</th>
                  <th className="py-4 px-5 text-[0.6875rem] uppercase tracking-[0.1em] font-semibold text-on-primary-container">Category</th>
                  <th className="py-4 px-5 text-[0.6875rem] uppercase tracking-[0.1em] font-semibold text-on-primary-container">Type</th>
                  <th
                    className="py-4 px-5 text-[0.6875rem] uppercase tracking-[0.1em] font-semibold text-on-primary-container text-right cursor-pointer select-none hover:text-on-surface"
                    onClick={() => handleSort("amount")}
                  >
                    Amount
                    {sortArrow("amount") && (
                      <span className="material-symbols-outlined text-sm align-middle ml-1">{sortArrow("amount")}</span>
                    )}
                  </th>
                  {isAdmin && <th className="py-4 px-5"></th>}
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="transition-colors duration-150 hover:bg-surface-low max-md:whitespace-nowrap">
                    <td className="py-4 px-5 text-sm text-on-primary-container tabular-nums max-md:py-3 max-md:px-4">{formatDate(tx.date)}</td>
                    <td className="py-4 px-5 text-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-surface-low flex items-center justify-center text-lg shrink-0 max-md:hidden">
                          <span className="material-symbols-outlined text-lg">
                            {CATEGORY_ICONS[tx.category] || "receipt_long"}
                          </span>
                        </div>
                        <span className="font-semibold text-on-surface">{tx.description}</span>
                      </div>
                    </td>
                    <td className="py-4 px-5 text-sm">
                      <span className={`inline-block py-1 px-3 rounded-full text-xs font-bold ${
                        tx.type === "income"
                          ? "bg-secondary/12 text-on-secondary-container"
                          : "bg-surface-high text-on-surface-variant"
                      }`}>
                        {tx.category}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-sm font-medium text-on-primary-container">
                      {tx.type === "income" ? "Income" : "Expense"}
                    </td>
                    <td className={`py-4 px-5 text-sm font-bold tabular-nums text-right ${
                      tx.type === "income" ? "text-secondary" : "text-on-tertiary-container"
                    }`}>
                      {tx.type === "income" ? "+" : "-"}{formatCurrency(tx.amount)}
                    </td>
                    {isAdmin && (
                      <td className="py-4 px-5">
                        <div className="flex gap-1 opacity-0 hover:opacity-100 justify-end transition-opacity duration-150 group-hover:opacity-100">
                          <button
                            className="bg-transparent border-none text-outline cursor-pointer p-1 rounded-sm flex items-center hover:text-on-surface hover:bg-surface-mid transition-all duration-150"
                            title="Edit"
                            onClick={() => handleEdit(tx)}
                          >
                            <span className="material-symbols-outlined text-lg">edit</span>
                          </button>
                          <button
                            className="bg-transparent border-none text-outline cursor-pointer p-1 rounded-sm flex items-center hover:text-on-tertiary-container hover:bg-on-tertiary-container/8 transition-all duration-150"
                            title="Delete"
                            onClick={() => deleteTransaction(tx.id)}
                          >
                            <span className="material-symbols-outlined text-lg">delete</span>
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* bottom totals */}
      <div className="grid grid-cols-[2fr_1fr] gap-6 mt-20 max-lg:grid-cols-1 max-md:mt-10">
        <div className="bg-surface-low rounded-lg p-8 relative overflow-hidden max-md:p-5">
          <h3 className="font-headline text-lg font-bold mb-6 max-md:text-base max-md:mb-4">Monthly Allocation</h3>
          <div className="flex items-end gap-12 max-md:flex-col max-md:items-start max-md:gap-4">
            <div>
              <p className="text-[0.6875rem] uppercase tracking-[0.15em] font-bold text-on-primary-container mb-1">Total Revenue</p>
              <p className="font-headline text-3xl font-extrabold tracking-tight tabular-nums">{formatCurrency(totals.income)}</p>
            </div>
            <div className="h-12 w-px bg-outline-variant/30 max-md:hidden" />
            <div>
              <p className="text-[0.6875rem] uppercase tracking-[0.15em] font-bold text-on-primary-container mb-1">Total Burn</p>
              <p className="font-headline text-3xl font-extrabold tracking-tight tabular-nums text-on-tertiary-container">{formatCurrency(totals.expenses)}</p>
            </div>
          </div>
        </div>
        <div className="bg-linear-to-br from-[#01071c] to-[#171f35] rounded-lg p-8 text-white flex flex-col justify-center [[data-theme='dark']_&]:from-surface-low [[data-theme='dark']_&]:to-surface-mid max-md:p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-xl text-primary-fixed">insights</span>
            <p className="text-[0.625rem] uppercase tracking-[0.15em] text-on-primary-container font-bold">Net Margin</p>
          </div>
          <p className="font-headline text-4xl font-extrabold tabular-nums mb-1 max-md:text-2xl">+{netMargin}%</p>
          <p className="text-xs text-on-primary-container">
            Savings of {formatCurrency(totals.balance)} this period
          </p>
        </div>
      </div>

      {/* show modal if open */}
      <TransactionModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditData(null); }}
        onSave={handleSave}
        editData={editData}
      />
    </div>
  );
}
