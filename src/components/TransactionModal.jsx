import { useState, useEffect } from "react";
import { CATEGORIES } from "../data/mockTransactions";

export default function TransactionModal({ isOpen, onClose, onSave, editData }) {
  const [form, setForm] = useState({
    date: "",
    description: "",
    category: "Food",
    type: "expense",
    amount: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editData) {
      setForm({
        date: editData.date,
        description: editData.description,
        category: editData.category,
        type: editData.type,
        amount: String(editData.amount),
      });
    } else {
      setForm({
        date: new Date().toISOString().split("T")[0],
        description: "",
        category: "Food",
        type: "expense",
        amount: "",
      });
    }
    setErrors({});
  }, [editData, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!form.date) errs.date = "Date is required";
    if (!form.description.trim()) errs.description = "Description is required";
    if (!form.category) errs.category = "Category is required";
    if (!form.amount || Number(form.amount) <= 0) errs.amount = "Amount must be a positive number";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave({
      ...form,
      amount: Number(form.amount),
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center animate-fade-in p-4"
      onClick={onClose}
    >
      <div
        className="animate-slide-up bg-surface-lowest rounded-xl p-8 w-full max-w-md max-h-[90vh] overflow-y-auto max-md:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-headline text-xl font-bold mb-6 text-on-surface">
          {editData ? "Edit Transaction" : "Add Transaction"}
        </h2>
        <form onSubmit={handleSubmit}>
          {/* date picker */}
          <div className="mb-5">
            <label htmlFor="tx-date" className="block text-xs font-semibold uppercase tracking-[0.1em] text-on-primary-container mb-2">
              Date
            </label>
            <input
              id="tx-date"
              type="date"
              className="w-full py-3 px-4 border-none rounded-md bg-surface-low text-on-surface text-sm font-sans outline-none focus:ring-2 focus:ring-primary"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
            {errors.date && <div className="text-error text-xs mt-1">{errors.date}</div>}
          </div>

          {/* text description */}
          <div className="mb-5">
            <label htmlFor="tx-description" className="block text-xs font-semibold uppercase tracking-[0.1em] text-on-primary-container mb-2">
              Description
            </label>
            <input
              id="tx-description"
              type="text"
              placeholder="e.g., Zomato Order"
              className="w-full py-3 px-4 border-none rounded-md bg-surface-low text-on-surface text-sm font-sans outline-none focus:ring-2 focus:ring-primary"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            {errors.description && <div className="text-error text-xs mt-1">{errors.description}</div>}
          </div>

          {/* categories */}
          <div className="mb-5">
            <label htmlFor="tx-category" className="block text-xs font-semibold uppercase tracking-[0.1em] text-on-primary-container mb-2">
              Category
            </label>
            <select
              id="tx-category"
              className="w-full py-3 px-4 border-none rounded-md bg-surface-low text-on-surface text-sm font-sans outline-none focus:ring-2 focus:ring-primary"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.category && <div className="text-error text-xs mt-1">{errors.category}</div>}
          </div>

          {/* transaction type */}
          <div className="mb-5">
            <label className="block text-xs font-semibold uppercase tracking-[0.1em] text-on-primary-container mb-2">
              Type
            </label>
            <div className="flex bg-surface-low rounded-full p-0.5">
              <button
                type="button"
                className={`flex-1 py-2.5 rounded-full border-none text-sm font-semibold cursor-pointer transition-all duration-200 ${
                  form.type === "income"
                    ? "bg-secondary text-on-secondary"
                    : "bg-transparent text-on-primary-container"
                }`}
                onClick={() => setForm({ ...form, type: "income" })}
              >
                Income
              </button>
              <button
                type="button"
                className={`flex-1 py-2.5 rounded-full border-none text-sm font-semibold cursor-pointer transition-all duration-200 ${
                  form.type === "expense"
                    ? "bg-on-tertiary-container text-white"
                    : "bg-transparent text-on-primary-container"
                }`}
                onClick={() => setForm({ ...form, type: "expense" })}
              >
                Expense
              </button>
            </div>
          </div>

          {/* money spent/earned */}
          <div className="mb-5">
            <label htmlFor="tx-amount" className="block text-xs font-semibold uppercase tracking-[0.1em] text-on-primary-container mb-2">
              Amount (₹)
            </label>
            <input
              id="tx-amount"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              className="w-full py-3 px-4 border-none rounded-md bg-surface-low text-on-surface text-sm font-sans outline-none focus:ring-2 focus:ring-primary"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
            />
            {errors.amount && <div className="text-error text-xs mt-1">{errors.amount}</div>}
          </div>

          {/* actions */}
          <div className="flex justify-end gap-3 mt-8">
            <button
              type="button"
              className="py-3 px-6 border-none rounded-md bg-surface-mid text-on-surface font-semibold cursor-pointer transition-all duration-200 hover:bg-surface-high"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-3 px-6 border-none rounded-md bg-linear-to-br from-[#01071c] to-[#171f35] text-white font-bold cursor-pointer transition-all duration-200 hover:opacity-92 disabled:opacity-50 disabled:cursor-not-allowed [[data-theme='dark']_&]:from-[#bec6e3] [[data-theme='dark']_&]:to-[#8e96b0] [[data-theme='dark']_&]:text-[#01071c]"
            >
              {editData ? "Save Changes" : "Add Transaction"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
