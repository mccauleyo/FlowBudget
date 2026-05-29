import { createFileRoute, useNavigate } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Compass, Moon, Sun, User, Shield, LogOut, Volume2, VolumeX } from "lucide-react";

import { TopBar } from "@/components/flow/TopBar";
import { Button } from "@/components/ui/button";
import { FlowCard } from "@/components/ui/flow-card";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";
import { useTour } from "@/hooks/use-tour";
import { useSound } from "@/hooks/use-sound";

export const Route = createFileRoute("/_app/settings")({
  head: () => ({
    meta: [{ title: "Settings — FlowBudget" }],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { user, signOut } = useAuth();
  const { theme, toggle } = useTheme();
  const { startTour, hasCompletedTour } = useTour();
  const { enabled: soundEnabled, setEnabled: setSoundEnabled, setEnabledQuiet, play } = useSound();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate({ to: "/" });
  }

  return (
    <>
      <TopBar greeting="Settings" subtitle="Preferences and account" />
      <FlowCard data-tour="page-settings" className="rounded-[24px] p-2 max-w-xl" delay={0} interactive={false}>
        <div className="space-y-2">
          <SettingsRow
            icon={User}
            title="Signed in as"
            description={user?.email ?? "Google account"}
          />
          <SettingsRow
            icon={soundEnabled ? Volume2 : VolumeX}
            title="Sound effects"
            description="Gentle audio for buttons, navigation, and the guided tour"
            action={
              <Switch
                checked={soundEnabled}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSoundEnabled(true);
                  } else {
                    play("toggle");
                    setEnabledQuiet(false);
                  }
                }}
              />
            }
          />
          <SettingsRow
            icon={theme === "dark" ? Moon : Sun}
            title="Appearance"
            description={theme === "dark" ? "Dark mode" : "Light mode"}
            action={
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded-full"
                onClick={() => {
                  play("toggle");
                  toggle();
                }}
              >
                Toggle theme
              </Button>
            }
          />
          <SettingsRow
            icon={Compass}
            title="Product tour"
            description={
              hasCompletedTour ? "Replay the guided walkthrough" : "Take the guided walkthrough"
            }
            action={
              <Button type="button" size="sm" className="rounded-full" onClick={startTour}>
                Start tour
              </Button>
            }
          />
          <SettingsRow
            icon={Shield}
            title="Privacy"
            description="Your budget data is stored locally in this browser for now."
          />
          <div className="pt-2 px-3 pb-3">
            <Button
              type="button"
              variant="outline"
              className="w-full rounded-full text-destructive hover:text-destructive"
              onClick={() => void handleSignOut()}
            >
              <LogOut className="size-4" />
              Sign out
            </Button>
          </div>
        </div>
      </FlowCard>
    </>
  );
}

function SettingsRow({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: typeof User;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-2xl p-4 flex items-center gap-4 hover:bg-[oklch(1_0_0_/_0.04)] transition-colors duration-200">
      <div className="size-10 rounded-xl glass flex items-center justify-center text-primary shrink-0">
        <Icon className="size-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground mt-0.5 truncate">{description}</p>
      </div>
      {action}
    </div>
  );
}
