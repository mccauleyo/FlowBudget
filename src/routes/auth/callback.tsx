import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/auth/callback")({
  component: AuthCallbackPage,
});

function AuthCallbackPage() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("Finishing sign in…");

  useEffect(() => {
    let cancelled = false;

    async function completeSignIn() {
      const params = new URLSearchParams(window.location.search);
      const errorDescription = params.get("error_description");

      if (errorDescription) {
        if (!cancelled) {
          setMessage(errorDescription);
        }
        return;
      }

      const code = params.get("code");
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          if (!cancelled) {
            setMessage(error.message);
          }
          return;
        }
      } else {
        const { data, error } = await supabase.auth.getSession();
        if (error || !data.session) {
          if (!cancelled) {
            setMessage("Could not complete sign in. Please try again.");
          }
          return;
        }
      }

      if (!cancelled) {
        window.history.replaceState({}, document.title, "/auth/callback");
        navigate({ to: "/dashboard", replace: true });
      }
    }

    void completeSignIn();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center px-5">
      <p className="text-sm text-muted-foreground text-center max-w-sm">{message}</p>
    </div>
  );
}
