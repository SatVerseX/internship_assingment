import { useState, useRef, useEffect } from "react";
import { useApp } from "../context/AppContext";

export default function Header({ onMenuToggle, sidebarCollapsed }) {
  const { darkMode, setDarkMode, filters, setFilters, filteredTransactions, activePage } = useApp();
  const [exportOpen, setExportOpen] = useState(false);
  const exportRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (exportRef.current && !exportRef.current.contains(e.target)) {
        setExportOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const exportCSV = () => {
    const headers = ["Date", "Description", "Category", "Type", "Amount"];
    const rows = filteredTransactions.map((tx) => [tx.date, tx.description, tx.category, tx.type, tx.amount]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.csv";
    a.click();
    URL.revokeObjectURL(url);
    setExportOpen(false);
  };

  const exportJSON = () => {
    const json = JSON.stringify(filteredTransactions, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.json";
    a.click();
    URL.revokeObjectURL(url);
    setExportOpen(false);
  };

  return (
    <header
      className={`fixed top-0 right-0 h-16 z-40 flex items-center justify-between px-8 bg-white/80 backdrop-blur-xl border-b border-surface-mid transition-[width] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] [[data-theme='dark']_&]:bg-[#0d1117]/80 max-md:!w-full max-md:!px-4 ${
        sidebarCollapsed
          ? "w-[calc(100%-4.5rem)]"
          : "w-[calc(100%-16rem)]"
      }`}
    >
      <div className="flex items-center gap-4 flex-1">
        {/* handle mobile screens */}
        <button
          className="hidden max-md:flex bg-transparent border-none cursor-pointer text-on-surface p-1 items-center"
          onClick={onMenuToggle}
          aria-label="Toggle Menu"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>

        {/* quick search bar */}
        <div className="relative flex-1 max-w-96 max-md:max-w-40">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-lg text-on-primary-container">
            search
          </span>
          <input
            type="text"
            className="w-full py-2 pl-10 pr-4 border-none rounded-lg bg-surface-low text-on-surface text-sm font-sans outline-none transition-all duration-200 focus:ring-1 focus:ring-primary/10 placeholder:text-on-primary-container/60"
            placeholder={
              activePage === "transactions"
                ? "Search transactions..."
                : activePage === "insights"
                ? "Search analytics..."
                : "Search architecture..."
            }
            value={filters.search}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, search: e.target.value }))
            }
          />
        </div>
      </div>

      <div className="flex items-center gap-4 shrink-0">
        {/* theme toggle */}
        <div className="flex items-center gap-4">
          <button
            className="bg-transparent border-none text-sidebar-muted cursor-pointer p-1 flex items-center transition-colors duration-200 hover:text-on-surface"
            onClick={setDarkMode}
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            <span className="material-symbols-outlined">
              {darkMode ? "light_mode" : "dark_mode"}
            </span>
          </button>
        </div>

        <div className="w-px h-6 bg-surface-high max-md:hidden" />

        {/* download options */}
        <div className="relative" ref={exportRef}>
          <button
            className="py-2 px-5 border-none rounded-md bg-surface-highest text-on-surface text-sm font-semibold cursor-pointer transition-all duration-200 hover:bg-surface-high"
            onClick={() => setExportOpen(!exportOpen)}
          >
            Export
          </button>
          {exportOpen && (
            <div className="absolute right-0 top-full mt-2 bg-surface-lowest rounded-md shadow-elevated p-2 min-w-40 z-50 animate-slide-up">
              <button
                className="w-full py-2 px-4 border-none bg-transparent text-left text-sm text-on-surface cursor-pointer rounded-sm transition-colors duration-150 hover:bg-surface-low"
                onClick={exportCSV}
              >
                <span className="material-symbols-outlined text-base mr-2 align-middle">description</span>
                Export as CSV
              </button>
              <button
                className="w-full py-2 px-4 border-none bg-transparent text-left text-sm text-on-surface cursor-pointer rounded-sm transition-colors duration-150 hover:bg-surface-low"
                onClick={exportJSON}
              >
                <span className="material-symbols-outlined text-base mr-2 align-middle">data_object</span>
                Export as JSON
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}