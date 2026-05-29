export type TourPlacement = "center" | "top" | "bottom" | "left" | "right";

export type TourPath =
  | "/dashboard"
  | "/accounts"
  | "/insights"
  | "/goals"
  | "/transactions"
  | "/settings";

export type TourStep = {
  id: string;
  target?: string;
  path?: TourPath;
  title: string;
  description: string;
  placement?: TourPlacement;
  advanceOnClick?: boolean;
};

export const TOUR_STEPS: TourStep[] = [
  {
    id: "welcome",
    path: "/dashboard",
    title: "Welcome to your calm money home",
    description:
      "This guided tour visits every page in FlowBudget. Move at your own pace — skip or replay anytime from Settings or the compass icon.",
    placement: "center",
  },
  {
    id: "sidebar",
    path: "/dashboard",
    target: "sidebar",
    title: "Your navigation hub",
    description:
      "Jump between Dashboard, Accounts, Insights, Goals, Transactions, and Settings. We'll visit each one next.",
    placement: "right",
  },
  {
    id: "get-started",
    path: "/dashboard",
    target: "get-started",
    title: "Your blank canvas",
    description:
      "Nothing is pre-filled. Set your daily budget and monthly numbers here to bring the dashboard to life.",
    placement: "bottom",
    advanceOnClick: true,
  },
  {
    id: "hero",
    path: "/dashboard",
    target: "hero",
    title: "Safe to spend today",
    description:
      "After you add a daily budget and payday date, this ring shows how much you can spend today without stress.",
    placement: "bottom",
  },
  {
    id: "monthly",
    path: "/dashboard",
    target: "monthly",
    title: "Monthly overview",
    description: "Income, bills, savings, and what's left — all in one row for the current month.",
    placement: "top",
  },
  {
    id: "forecast",
    path: "/dashboard",
    target: "forecast",
    title: "Smart forecast",
    description: "Projects how you're tracking before payday from the numbers you've entered.",
    placement: "top",
  },
  {
    id: "categories",
    path: "/dashboard",
    target: "categories",
    title: "Spending categories",
    description: "Create categories with limits and watch progress bars fill as you spend.",
    placement: "left",
    advanceOnClick: true,
  },
  {
    id: "accounts",
    path: "/accounts",
    target: "page-accounts",
    title: "Accounts",
    description: "Add checking, savings, or credit accounts and see your combined balance in one place.",
    placement: "bottom",
  },
  {
    id: "insights",
    path: "/insights",
    target: "page-insights",
    title: "Insights",
    description:
      "Summaries and patterns from your data — top categories, monthly totals, and recent spending.",
    placement: "bottom",
  },
  {
    id: "goals",
    path: "/goals",
    target: "page-goals",
    title: "Savings goals",
    description: "A dedicated view for goals. Use + to add an emergency fund, trip, or anything you're saving for.",
    placement: "bottom",
    advanceOnClick: true,
  },
  {
    id: "transactions",
    path: "/transactions",
    target: "page-transactions",
    title: "Transactions",
    description: "Your full activity log with search — add income and expenses to keep everything current.",
    placement: "top",
    advanceOnClick: true,
  },
  {
    id: "settings",
    path: "/settings",
    target: "page-settings",
    title: "Settings",
    description: "Toggle theme, replay this tour, review privacy, or sign out when you're done.",
    placement: "bottom",
  },
  {
    id: "topbar",
    path: "/dashboard",
    target: "topbar",
    title: "You're all set",
    description:
      "The compass replays this tour anytime. Build your budget at your pace — happy flowing!",
    placement: "bottom",
  },
];

export const TOUR_VERSION = "v2";
