import {
  LayoutDashboard,
  Wallet,
  PieChart,
  Target,
  Receipt,
  Settings,
  type LucideIcon,
} from "lucide-react";

export type AppNavItem = {
  to: "/dashboard" | "/accounts" | "/insights" | "/goals" | "/transactions" | "/settings";
  icon: LucideIcon;
  label: string;
  shortLabel?: string;
};

export const APP_NAV_ITEMS: AppNavItem[] = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard", shortLabel: "Home" },
  { to: "/accounts", icon: Wallet, label: "Accounts" },
  { to: "/insights", icon: PieChart, label: "Insights" },
  { to: "/goals", icon: Target, label: "Goals" },
  { to: "/transactions", icon: Receipt, label: "Transactions", shortLabel: "Activity" },
  { to: "/settings", icon: Settings, label: "Settings" },
];
