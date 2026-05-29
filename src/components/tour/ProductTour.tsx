import { useEffect, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { ArrowLeft, ArrowRight, Compass, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useTour } from "@/hooks/use-tour";
import { useTourSpotlight } from "@/hooks/use-tour-spotlight";
import { cn } from "@/lib/utils";

export function ProductTour() {
  const { isActive, step, stepIndex, stepKey, totalSteps, stepReady, nextStep, prevStep, skipTour } =
    useTour();
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [contentPhase, setContentPhase] = useState<"in" | "out">("in");

  const isCenter = !step.target || step.placement === "center";
  const rect = useTourSpotlight(step.target, isActive && !isCenter, stepKey, stepReady);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isActive) {
      const t = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(t);
    }
    setVisible(false);
  }, [isActive]);

  useEffect(() => {
    setContentPhase("out");
    const t = window.setTimeout(() => setContentPhase("in"), 140);
    return () => window.clearTimeout(t);
  }, [stepKey]);

  useEffect(() => {
    if (!isActive || !step.advanceOnClick || !step.target || !stepReady) {
      return;
    }
    const el = document.querySelector(`[data-tour="${step.target}"]`);
    if (!el) {
      return;
    }
    const onClick = () => {
      window.setTimeout(nextStep, 400);
    };
    el.addEventListener("click", onClick, { once: true });
    return () => el.removeEventListener("click", onClick);
  }, [isActive, step, stepReady, nextStep]);

  useEffect(() => {
    if (!isActive) {
      return;
    }
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isActive]);

  if (!mounted || !isActive) {
    return null;
  }

  const tooltipStyle = getTooltipStyle(rect, step.placement ?? "bottom", isCenter);

  return createPortal(
    <div
      className={cn(
        "fixed inset-0 z-[200] transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
        visible ? "opacity-100" : "opacity-0",
      )}
      role="dialog"
      aria-modal="true"
      aria-label="Product tour"
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-[4px] transition-all duration-700 ease-out"
        onClick={skipTour}
      />

      {rect && !isCenter && (
        <>
          <div
            className="absolute pointer-events-none tour-spotlight-glow"
            style={{
              top: rect.top,
              left: rect.left,
              width: rect.width,
              height: rect.height,
              borderRadius: RADIUS,
              boxShadow: "0 0 0 9999px rgba(0,0,0,0.52), 0 0 40px oklch(0.72 0.16 240 / 0.35)",
              transition: "box-shadow 0.4s ease",
            }}
          />
          <div
            className="absolute pointer-events-none tour-spotlight-ring"
            style={{
              top: rect.top,
              left: rect.left,
              width: rect.width,
              height: rect.height,
              borderRadius: RADIUS,
            }}
          />
        </>
      )}

      <div
        className={cn(
          "absolute z-[201] w-[min(100vw-2rem,400px)] glass-strong rounded-2xl p-5 shadow-2xl",
          "transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
          contentPhase === "in" ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-2 scale-[0.98]",
          isCenter && "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
          !isCenter && stepReady && "opacity-100",
          !isCenter && !stepReady && "opacity-0 pointer-events-none",
        )}
        style={isCenter ? undefined : tooltipStyle}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 text-primary">
            <Compass className="size-4 tour-compass-spin" />
            <span className="text-xs font-medium uppercase tracking-wider">
              Step {stepIndex + 1} of {totalSteps}
            </span>
          </div>
          <button
            type="button"
            onClick={skipTour}
            className="size-8 rounded-full hover:bg-[oklch(1_0_0_/_0.08)] flex items-center justify-center text-muted-foreground transition-colors"
            aria-label="Skip tour"
          >
            <X className="size-4" />
          </button>
        </div>

        <h3 className="text-lg font-semibold tracking-tight">{step.title}</h3>
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{step.description}</p>

        {step.advanceOnClick && step.target && (
          <p className="text-xs text-primary mt-3 font-medium animate-pulse">
            Tap the highlighted area to continue →
          </p>
        )}

        <div className="flex items-center gap-1.5 mt-4 mb-4">{tourStepDots(stepIndex, totalSteps)}</div>

        <div className="flex items-center justify-between gap-2">
          <Button type="button" variant="ghost" size="sm" className="rounded-full" onClick={skipTour}>
            Skip tour
          </Button>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={prevStep}
              disabled={stepIndex === 0}
            >
              <ArrowLeft className="size-3.5" />
              Back
            </Button>
            <Button type="button" size="sm" className="rounded-full" onClick={nextStep}>
              {stepIndex === totalSteps - 1 ? "Finish" : "Next"}
              {stepIndex < totalSteps - 1 && <ArrowRight className="size-3.5" />}
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

const RADIUS = 18;

function tourStepDots(active: number, total: number) {
  return Array.from({ length: total }, (_, i) => (
    <span
      key={i}
      className={cn(
        "h-1.5 rounded-full transition-all duration-500 ease-out",
        i === active ? "w-6 bg-primary" : "w-1.5 bg-[oklch(1_0_0_/_0.2)]",
      )}
    />
  ));
}

function getTooltipStyle(
  rect: { top: number; left: number; width: number; height: number } | null,
  placement: string,
  isCenter: boolean,
): CSSProperties {
  if (isCenter || !rect) {
    return {};
  }

  const gap = 18;
  const cardWidth = 400;
  const maxLeft = Math.max(16, Math.min(rect.left, window.innerWidth - cardWidth - 16));

  switch (placement) {
    case "top":
      return {
        left: maxLeft,
        top: rect.top - gap,
        transform: "translateY(-100%)",
        transition: "top 0.45s cubic-bezier(0.22,1,0.36,1), left 0.45s cubic-bezier(0.22,1,0.36,1), transform 0.45s cubic-bezier(0.22,1,0.36,1)",
      };
    case "left":
      return {
        left: rect.left - gap,
        top: rect.top,
        transform: "translateX(-100%)",
        transition: "top 0.45s cubic-bezier(0.22,1,0.36,1), left 0.45s cubic-bezier(0.22,1,0.36,1), transform 0.45s cubic-bezier(0.22,1,0.36,1)",
      };
    case "right":
      return {
        left: rect.left + rect.width + gap,
        top: rect.top,
        transition: "top 0.45s cubic-bezier(0.22,1,0.36,1), left 0.45s cubic-bezier(0.22,1,0.36,1)",
      };
    case "bottom":
    default:
      return {
        left: maxLeft,
        top: rect.top + rect.height + gap,
        transition: "top 0.45s cubic-bezier(0.22,1,0.36,1), left 0.45s cubic-bezier(0.22,1,0.36,1)",
      };
  }
}
