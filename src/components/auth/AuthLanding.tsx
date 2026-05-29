import { Link } from "@tanstack/react-router";
import {
  Sparkles,
  Wallet,
  LineChart,
  Target,
  Shield,
  ArrowRight,
} from "lucide-react";

import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { cn } from "@/lib/utils";

export type AuthMode = "signup" | "login";

type AuthLandingProps = {
  mode: AuthMode;
  onModeChange?: (mode: AuthMode) => void;
};

const features = [
  {
    icon: Wallet,
    title: "Safe-to-spend, daily",
    text: "Know exactly what you can spend today before payday.",
  },
  {
    icon: LineChart,
    title: "Calm forecasts",
    text: "See where your balance is heading — no spreadsheet required.",
  },
  {
    icon: Target,
    title: "Your numbers only",
    text: "Start blank and build a budget that reflects your real life.",
  },
];

export function AuthLanding({ mode, onModeChange }: AuthLandingProps) {
  const isSignup = mode === "signup";

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-32 size-[520px] rounded-full bg-[oklch(0.55_0.2_250_/_0.35)] blur-[100px] animate-[float_8s_ease-in-out_infinite]" />
        <div className="absolute top-1/3 -right-24 size-[480px] rounded-full bg-[oklch(0.6_0.22_290_/_0.28)] blur-[90px] animate-[float_10s_ease-in-out_infinite_1s]" />
        <div className="absolute -bottom-32 left-1/3 size-[400px] rounded-full bg-[oklch(0.5_0.15_200_/_0.25)] blur-[80px] animate-[float_9s_ease-in-out_infinite_0.5s]" />
      </div>

      <div className="relative z-10 min-h-screen grid lg:grid-cols-2 gap-10 lg:gap-0 px-5 md:px-10 py-10 lg:py-0">
        <div className="flex flex-col justify-center lg:pr-12 lg:py-16 max-w-xl mx-auto lg:mx-0 lg:ml-auto w-full">
          <div className="flex items-center gap-2 mb-8">
            <div className="size-10 rounded-2xl bg-gradient-to-br from-[oklch(0.72_0.16_240)] to-[oklch(0.6_0.2_290)] flex items-center justify-center shadow-lg">
              <Sparkles className="size-5 text-white" />
            </div>
            <span className="text-lg font-semibold tracking-tight">FlowBudget</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-[3.25rem] font-semibold tracking-tight leading-[1.08]">
            Money clarity,
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[oklch(0.78_0.16_200)] to-[oklch(0.72_0.2_290)]">
              without the noise
            </span>
          </h1>
          <p className="text-muted-foreground mt-5 text-base md:text-lg leading-relaxed max-w-md">
            A liquid-glass budgeting dashboard that stays calm. Sign in once, start fresh, and shape
            every number yourself.
          </p>

          <ul className="mt-10 space-y-4">
            {features.map((f) => (
              <li key={f.title} className="flex gap-4 items-start">
                <div className="size-10 rounded-xl glass flex items-center justify-center shrink-0 text-primary">
                  <f.icon className="size-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">{f.title}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">{f.text}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="hidden lg:block mt-12 glass rounded-3xl p-5 max-w-sm">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
              <Shield className="size-3.5" />
              Secure sign-in with Google
            </div>
            <div className="h-2 rounded-full bg-[oklch(1_0_0_/_0.08)] overflow-hidden">
              <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-[oklch(0.78_0.16_200)] to-[oklch(0.7_0.2_290)]" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Your data stays yours — we never sell it.</p>
          </div>
        </div>

        <div className="flex flex-col justify-center lg:pl-12 lg:py-16 max-w-md mx-auto lg:mr-auto lg:ml-0 w-full">
          <div className="glass-strong rounded-[28px] p-8 md:p-10 shadow-[0_40px_100px_-20px_oklch(0_0_0_/_0.5)] animate-[scale-in_0.45s_cubic-bezier(0.22,1,0.36,1)]">
            <div className="flex p-1 rounded-full glass mb-8">
              <TabButton
                active={isSignup}
                onClick={() => onModeChange?.("signup")}
                href="/signup"
                label="Sign up"
              />
              <TabButton
                active={!isSignup}
                onClick={() => onModeChange?.("login")}
                href="/login"
                label="Log in"
              />
            </div>

            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold tracking-tight">
                {isSignup ? "Create your account" : "Welcome back"}
              </h2>
              <p className="text-sm text-muted-foreground mt-2">
                {isSignup
                  ? "Join FlowBudget in one tap — then take a quick tour of your dashboard."
                  : "Pick up where you left off. Your budget is waiting."}
              </p>
            </div>

            <GoogleSignInButton
              label={isSignup ? "Sign up with Google" : "Log in with Google"}
              className="h-12"
            />

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/60" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-transparent px-3 text-muted-foreground">Free · No card required</span>
              </div>
            </div>

            <p className="text-xs text-center text-muted-foreground leading-relaxed">
              {isSignup ? (
                <>
                  Already have an account?{" "}
                  <Link to="/login" className="text-primary font-medium hover:underline inline-flex items-center gap-0.5">
                    Log in <ArrowRight className="size-3" />
                  </Link>
                </>
              ) : (
                <>
                  New here?{" "}
                  <Link to="/signup" className="text-primary font-medium hover:underline inline-flex items-center gap-0.5">
                    Create an account <ArrowRight className="size-3" />
                  </Link>
                </>
              )}
            </p>
          </div>

          <p className="text-[11px] text-center text-muted-foreground mt-6 leading-relaxed px-4">
            By continuing, you agree to use FlowBudget for personal budgeting. Google is used only to
            verify your identity.
          </p>
        </div>
      </div>
    </div>
  );
}

function TabButton({
  active,
  label,
  href,
  onClick,
}: {
  active: boolean;
  label: string;
  href: string;
  onClick?: () => void;
}) {
  return (
    <Link
      to={href}
      onClick={onClick}
      className={cn(
        "flex-1 py-2.5 text-sm font-medium rounded-full text-center transition-all duration-300",
        active
          ? "bg-primary text-primary-foreground shadow-md"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      {label}
    </Link>
  );
}
