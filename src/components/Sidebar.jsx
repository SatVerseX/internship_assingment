import { useApp } from "../context/AppContext";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "dashboard" },
  { id: "transactions", label: "Ledger", icon: "account_balance_wallet" },
  { id: "insights", label: "Analytics", icon: "show_chart" },
];

export default function Sidebar({
  mobileOpen,
  collapsed,
  onClose,
}) {
  const { activePage, setActivePage, role, setRole } = useApp();
  const isAdmin = role === "admin";

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`sidebar ${mobileOpen ? "mobile-open" : ""} ${
          collapsed ? "collapsed" : ""
        }`}
      >
        {/* user details */}
        <div className="sidebar-user mb-10 pl-1 mt-2">
          <img
            src="https://ui-avatars.com/api/?name=satish+pal&background=171f35&color=fff&rounded=true&bold=true"
            alt="User profile"
            className="user-avatar shadow-sm"
          />
          <div className="user-info sidebar-text flex flex-col gap-0.5">
            <h3 className="user-name text-sm font-bold tracking-tight text-on-surface">
              Satish Pal
            </h3>
            <p className="user-email text-xs font-medium text-on-surface-variant">
              satishpal@zohomail.in
            </p>
          </div>
        </div>

        {/* side links */}
        <nav className="sidebar-nav flex flex-col gap-2 flex-1">
          {NAV_ITEMS.map((item) => {
            const isActive = activePage === item.id;

            return (
              <button
                key={item.id}
                className={`nav-item outline-none focus:outline-none border-none ring-0 appearance-none ${
                  isActive
                    ? "bg-surface-mid/60 text-on-surface font-semibold"
                    : "text-on-surface-variant hover:bg-surface-low"
                }`}
                onClick={() => {
                  setActivePage(item.id);
                  if (mobileOpen) onClose();
                }}
                title={collapsed ? item.label : undefined}
                aria-current={isActive ? "page" : undefined}
              >
                <span
                  className="material-symbols-outlined shrink-0 transition-all duration-200"
                  style={{
                    fontVariationSettings: isActive
                      ? "'FILL' 1, 'wght' 500"
                      : "'FILL' 0, 'wght' 400",
                  }}
                >
                  {item.icon}
                </span>
                <span className="nav-label sidebar-text tracking-wide">
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* lowest panel */}
        <div className="sidebar-bottom pt-6 mt-auto border-t-[0.5px] border-surface-mid">
          {/* role toggle */}
          <div className="role-switcher-container">
            {/* expanded role switch */}
            <div className="role-switcher-full">
              <p className="text-[0.625rem] font-bold uppercase tracking-[0.15em] text-on-surface-variant mb-3 px-2">
                Access Level
              </p>
              <div className="flex p-1 bg-surface-low rounded-lg gap-1 w-full">
                <button
                  className={`flex-1 py-1.5 px-3 rounded-md text-xs font-semibold transition-all duration-200 outline-none focus:outline-none border-none ring-0 appearance-none ${
                    role === "admin"
                      ? "bg-surface-lowest text-on-surface shadow-card"
                      : "bg-transparent text-on-surface-variant hover:text-on-surface"
                  }`}
                  onClick={() => setRole("admin")}
                >
                  Admin
                </button>
                <button
                  className={`flex-1 py-1.5 px-3 rounded-md text-xs font-semibold transition-all duration-200 outline-none focus:outline-none border-none ring-0 appearance-none ${
                    role === "viewer"
                      ? "bg-surface-lowest text-on-surface shadow-card"
                      : "bg-transparent text-on-surface-variant hover:text-on-surface"
                  }`}
                  onClick={() => setRole("viewer")}
                >
                  Viewer
                </button>
              </div>
            </div>

            {/* collapsed role switch */}
            <div className="role-switcher-icon">
              <button
                className="nav-item outline-none focus:outline-none border-none ring-0 appearance-none justify-center p-3 text-on-surface-variant hover:bg-surface-low hover:text-on-surface rounded-lg transition-colors"
                onClick={() => setRole(role === "admin" ? "viewer" : "admin")}
                title={`Switch to ${role === "admin" ? "Viewer" : "Admin"}`}
              >
                <span className="material-symbols-outlined text-xl">
                  {role === "admin" ? "admin_panel_settings" : "visibility"}
                </span>
              </button>
            </div>
          </div>

          {/* show add button for admins */}
          {isAdmin && (
            <button
              className="btn-new-entry mt-6 outline-none focus:outline-none border-none ring-0 appearance-none transition-all duration-200 hover:-translate-y-0.5"
              onClick={() => {
                setActivePage("transactions");
                window.dispatchEvent(new CustomEvent("openTransactionModal"));
                if (mobileOpen) onClose();
              }}
              title={collapsed ? "New Entry" : undefined}
            >
              <span
                className="material-symbols-outlined shrink-0"
                style={{ fontSize: "1.125rem", fontVariationSettings: "'wght' 600" }}
              >
                add
              </span>
              <span className="btn-label sidebar-text tracking-wide">
                New Entry
              </span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
}