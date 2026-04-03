# Finance Dashboard

## Overview

A premium, single-page Finance Dashboard application built for tracking, visualizing, and understanding personal financial activity. Built with the **"Equity Slate / Architectural Ledger"** design system — featuring tonal layering, glassmorphism, modern typography, and a refined editorial aesthetic.

**Live Demo:** Run locally with `npm run dev`

## Tech Stack

| Concern | Technology |
|---|---|
| **Framework** | React 18 |
| **Build Tool** | Vite 5 |
| **Styling** | Tailwind CSS v4 |
| **Charts** | Recharts |
| **State** | React (`useState` + `useContext`) |
| **Icons** | Material Symbols Outlined |
| **Typography** | Manrope (headlines) + Inter (body) |
| **Persistence** | localStorage |

## Setup Instructions

```bash
# Clone the repo
git clone <repo-url>
cd finance-dashboard

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173/`

## Features & Functionality

### Core
- **Summary Cards**: Total Balance, Monthly Income, Monthly Expenses — computed dynamically from transaction data.
- **Interactive Charts**: Monthly income vs. expenses trend with gradient fills using `recharts`.
- **Transaction Flow**: Full table view with grouping by category, real-time search, sorting, and type/category filters.
- **Role-Based Access Control (RBAC)**: Simulated toggle. Admin can add, edit, and delete transactions; Viewer is read-only.
- **Insights Engine**: Auto-computed financial observations based on current data.

### Enhancements
- ✅ **Dark Mode**: Fully implemented `dark` theme toggling with aesthetic deep-navy palettes.
- ✅ **localStorage Persistence**: Transactions, role, and theme preference survive page refresh.
- ✅ **CSV / JSON Export**: Complete robust data-export capabilities straight from the browser.
- ✅ **Responsive Design**: Polished layout reflowing across Mobile, Tablet, and Desktop.

## State Management Approach

- **Centralized Context**: A single `AppContext` manages global state: transactions, current user role (Admin/Viewer), active filters (search, type, category, sorting), and visual theme preference.
- **Derived State**: All filtered lists, aggregated categories, and insights are computed deterministically via `useMemo`. This avoids redundant state variables and keeps the UI perfectly synced with the source of truth.
- **Persistence**: The state seamlessly synchronizes with `localStorage` upon changes, ensuring a persistent user experience across sessions without an active backend.

## UI/UX & Design Decisions

- **Tailwind CSS v4 Strategy**: Transitioned strictly to a utility-first Tailwind CSS approach layered with robust custom CSS properties (`@theme`) for a unified design language encompassing specialized features like staggering animations and layered glassmorphism.
- **Tonal Layering**: Instead of relying heavily on borders and drop shadows, depth is achieved by contrast differences between surfaces.
- **Responsive Navigation**: A resizable side-navigation paradigm that degrades gracefully into a mobile-drawer overlay on smaller viewports.
- **Micro-interactions**: Incorporates entrance transitions, staggered item lists, and skeleton shimmering when loading to portray a high-quality frontend experience.

## Code Structure & Modularity

The application adheres to a clean, modular architecture:
```text
src/
├── components/          # Reusable UI building blocks (Header, Sidebar, Modal, Loaders)
├── context/             # Global state definitions (AppContext.jsx)
├── pages/               # Primary views (Dashboard, Insights, Transactions)
├── data/                # Initial mock dataset
└── index.css            # Tailwind directives and customized token variables
```

## Attention to Detail & Edge Cases
- Contains robust empty states (e.g., when search yields zero results, or categories are empty).
- Ensures tabular data is perfectly right-aligned for financial numerals.
- Integrates artificial data loading wrapped in `LoadingSkeleton` interfaces to vividly demonstrate real-world behavior and transitions.

## Assumptions
- Uses INR (₹) as the default currency context. Dates mapped from Jan-Mar 2025.
- Authentication is simulated through an active toggle directly within the Sidebar.
