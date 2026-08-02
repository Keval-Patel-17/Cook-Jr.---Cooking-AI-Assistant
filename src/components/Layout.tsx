import React from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChefHat, Home, UtensilsCrossed, Dumbbell, CalendarDays, ShieldCheck, Gamepad2, LogOut, Sun, Moon } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { useTheme } from "@/lib/ThemeContext";
import FloatingChef from "@/components/cookjr/FloatingChef";

const NAV = [
  { to: "/dashboard", label: "Home", Icon: Home },
  { to: "/recipes", label: "Recipes", Icon: UtensilsCrossed },
  { to: "/gym", label: "Gym", Icon: Dumbbell },
  { to: "/scheduler", label: "Scheduler", Icon: CalendarDays },
  { to: "/kitchen", label: "Kitchen", Icon: ShieldCheck },
  { to: "/games", label: "Games", Icon: Gamepad2 },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const nav = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground grain relative">
      <header className="sticky top-0 z-30 glass border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex items-center gap-4">
          <button onClick={() => nav("/dashboard")} className="flex items-center gap-2 cursor-pointer" data-testid="header-logo">
            <div className="p-2 rounded-xl bg-orange-500 text-white shadow-[0_6px_18px_-6px_rgba(249,115,22,0.7)]"><ChefHat size={18} /></div>
            <span className="font-bold text-xl">Cook Jr.</span>
          </button>
          <nav className="hidden md:flex items-center gap-1 ml-6">
            {NAV.map(({ to, label, Icon }) => (
              <NavLink key={to} to={to} data-testid={`nav-${label.toLowerCase()}`}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-colors ${isActive ? "bg-orange-500 text-white shadow-md" : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`}>
                <Icon size={16} />{label}
              </NavLink>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <span className="hidden sm:block text-sm text-muted-foreground">Hi, {user?.name || "Chef"}</span>
            <button onClick={toggle} data-testid="theme-toggle" className="p-2 rounded-full hover:bg-secondary cursor-pointer text-foreground">
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button onClick={() => { logout(); nav("/"); }} data-testid="logout-btn" className="p-2 rounded-full hover:bg-secondary text-muted-foreground hover:text-red-500 cursor-pointer">
              <LogOut size={18} />
            </button>
          </div>
        </div>
        <div className="md:hidden flex overflow-x-auto gap-1 px-4 pb-2 no-scrollbar">
          {NAV.map(({ to, label, Icon }) => (
            <NavLink key={to} to={to} className={({ isActive }) => `flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${isActive ? "bg-orange-500 text-white" : "bg-secondary text-muted-foreground"}`}>
              <Icon size={14} />{label}
            </NavLink>
          ))}
        </div>
      </header>

      <motion.main
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-7xl mx-auto px-4 md:px-8 py-8"
      >
        <Outlet />
      </motion.main>

      <FloatingChef />
    </div>
  );
}
