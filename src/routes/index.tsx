import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

import { AuthLanding } from "@/components/auth/AuthLanding";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FlowBudget — Calm personal budgeting" },
      {
        name: "description",
        content: "Sign up or log in to FlowBudget. A premium, glass-style dashboard for daily spending clarity.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { session, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && session) {
      navigate({ to: "/dashboard", replace: true });
    }
  }, [loading, session, navigate]);

  if (loading || session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-muted-foreground animate-pulse">Loading…</p>
      </div>
    );
  }

  return <AuthLanding mode="signup" />;
}
