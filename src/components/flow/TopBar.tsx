import { Bell, Search, Moon, Sun, LogOut, Compass } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

import { useTheme } from "@/hooks/use-theme";
import { useAuth } from "@/hooks/use-auth";
import { useTour } from "@/hooks/use-tour";
import { useSound } from "@/hooks/use-sound";

function displayName(email?: string | null, metadata?: Record<string, unknown>) {
  const fullName = metadata?.full_name;
  if (typeof fullName === "string" && fullName.trim()) {
    return fullName.split(" ")[0];
  }
  if (email) {
    return email.split("@")[0];
  }
  return "there";
}

type TopBarProps = {
  greeting?: string;
  subtitle?: string;
};

export function TopBar({ greeting = "Your daily flow", subtitle }: TopBarProps) {
  const { theme, toggle } = useTheme();
  const { user, signOut } = useAuth();
  const { startTour, isActive } = useTour();
  const { play } = useSound();
  const navigate = useNavigate();
  const firstName = displayName(user?.email, user?.user_metadata);
  const isDashboard = greeting === "Your daily flow";

  async function handleSignOut() {
    await signOut();
    navigate({ to: "/" });
  }

  return (
    <div
      data-tour="topbar"
      className="flex items-center justify-between mb-8 animate-[fade-in_0.5s_ease-out]"
    >
      <div>
        {isDashboard ? (
          <p className="text-sm text-muted-foreground">Good afternoon, {firstName}</p>
        ) : (
          subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight mt-1">{greeting}</h1>
      </div>
      <div className="flex items-center gap-2">
        <div className="hidden md:flex items-center gap-2 glass rounded-full px-4 py-2.5 w-64">
          <Search className="size-4 text-muted-foreground" />
          <input
            placeholder="Search transactions"
            className="bg-transparent outline-none text-sm w-full placeholder:text-muted-foreground"
          />
        </div>
        <button
          type="button"
          onClick={() => {
            play("tap");
            startTour();
          }}
          disabled={isActive}
          className="size-11 rounded-full glass flex items-center justify-center hover:scale-105 transition-all duration-200 text-primary disabled:opacity-50 hover:shadow-[0_0_20px_oklch(0.72_0.16_240_/_0.35)]"
          aria-label="Take a product tour"
          title="Take a tour"
        >
          <Compass className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => {
            play("toggle");
            toggle();
          }}
          className="size-11 rounded-full glass flex items-center justify-center hover:scale-105 transition-all duration-200"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </button>
        <button
          type="button"
          className="size-11 rounded-full glass flex items-center justify-center hover:scale-105 transition-transform relative"
        >
          <Bell className="size-4" />
          <span className="absolute top-2.5 right-2.5 size-2 rounded-full bg-[var(--color-danger)]" />
        </button>
        <button
          type="button"
          onClick={() => void handleSignOut()}
          className="size-11 rounded-full glass flex items-center justify-center hover:scale-105 transition-transform"
          aria-label="Sign out"
        >
          <LogOut className="size-4" />
        </button>
      </div>
    </div>
  );
}
