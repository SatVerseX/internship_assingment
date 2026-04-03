import { useState } from "react";
import { useApp } from "./context/AppContext";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import LoadingSkeleton from "./components/LoadingSkeleton";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Insights from "./pages/Insights";

function AppContent() {
  const { activePage, isLoading } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // keep sidebar collapsed initially
  const [sidebarCollapsed] = useState(true);

  const renderPage = () => {
    if (isLoading) return <LoadingSkeleton />;
    switch (activePage) {
      case "dashboard":
        return <Dashboard />;
      case "transactions":
        return <Transactions />;
      case "insights":
        return <Insights />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar
        mobileOpen={mobileMenuOpen}
        collapsed={sidebarCollapsed}
        onClose={() => setMobileMenuOpen(false)}
      />
      <Header
        onMenuToggle={() => setMobileMenuOpen((prev) => !prev)}
        sidebarCollapsed={sidebarCollapsed}
      />
      <main
        className={`min-h-screen transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] pt-20 pb-8 px-8 max-md:!ml-0 max-md:!w-full max-md:px-4 max-md:pt-[4.5rem] ${
          sidebarCollapsed
            ? "ml-[4.5rem] w-[calc(100%-4.5rem)]"
            : "ml-64 w-[calc(100%-16rem)]"
        }`}
      >
        {renderPage()}
      </main>
    </div>
  );
}

export default function App() {
  return <AppContent />;
}