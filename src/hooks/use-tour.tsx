import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useNavigate } from "@tanstack/react-router";

import { TOUR_STEPS, TOUR_VERSION, type TourStep } from "@/lib/tour-steps";
import { useAuth } from "@/hooks/use-auth";
import { useSound } from "@/hooks/use-sound";

type TourContextValue = {
  isActive: boolean;
  stepIndex: number;
  step: TourStep;
  stepKey: string;
  totalSteps: number;
  stepReady: boolean;
  startTour: () => void;
  skipTour: () => void;
  nextStep: () => void;
  prevStep: () => void;
  hasCompletedTour: boolean;
};

const TourContext = createContext<TourContextValue | null>(null);

const STEP_SETTLE_MS = 480;

function tourStorageKey(userId: string) {
  return `flowbudget:tour:${TOUR_VERSION}:${userId}`;
}

function readTourCompleted(userId: string) {
  if (typeof window === "undefined") {
    return false;
  }
  return localStorage.getItem(tourStorageKey(userId)) === "done";
}

function writeTourCompleted(userId: string) {
  localStorage.setItem(tourStorageKey(userId), "done");
}

export function TourProvider({
  children,
  autoStart = false,
}: {
  children: ReactNode;
  autoStart?: boolean;
}) {
  const { user } = useAuth();
  const { play } = useSound();
  const navigate = useNavigate();
  const userId = user?.id ?? "guest";
  const [isActive, setIsActive] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [stepReady, setStepReady] = useState(false);
  const [hasCompletedTour, setHasCompletedTour] = useState(() => readTourCompleted(userId));

  const step = TOUR_STEPS[stepIndex]!;

  useEffect(() => {
    setHasCompletedTour(readTourCompleted(userId));
  }, [userId]);

  useEffect(() => {
    if (autoStart && !hasCompletedTour) {
      const timer = window.setTimeout(() => {
        play("tourStart");
        setIsActive(true);
      }, 700);
      return () => window.clearTimeout(timer);
    }
  }, [autoStart, hasCompletedTour, play]);

  useEffect(() => {
    if (!isActive) {
      setStepReady(false);
      return;
    }

    setStepReady(false);

    if (step.path) {
      navigate({ to: step.path });
    }

    const timer = window.setTimeout(() => {
      setStepReady(true);
      play("tourStep");
    }, STEP_SETTLE_MS);
    return () => window.clearTimeout(timer);
  }, [isActive, stepIndex, step.path, navigate, play]);

  const finishTour = useCallback(() => {
    play("tourEnd");
    setIsActive(false);
    setStepIndex(0);
    setStepReady(false);
    setHasCompletedTour(true);
    writeTourCompleted(userId);
    navigate({ to: "/dashboard" });
  }, [userId, navigate, play]);

  const startTour = useCallback(() => {
    play("tourStart");
    setStepIndex(0);
    setIsActive(true);
  }, [play]);

  const skipTour = useCallback(() => {
    finishTour();
  }, [finishTour]);

  const nextStep = useCallback(() => {
    setStepIndex((i) => {
      if (i >= TOUR_STEPS.length - 1) {
        finishTour();
        return 0;
      }
      return i + 1;
    });
  }, [finishTour]);

  const prevStep = useCallback(() => {
    setStepIndex((i) => Math.max(0, i - 1));
  }, []);

  const value = useMemo<TourContextValue>(
    () => ({
      isActive,
      stepIndex,
      step,
      stepKey: `${stepIndex}-${step.id}`,
      totalSteps: TOUR_STEPS.length,
      stepReady,
      startTour,
      skipTour,
      nextStep,
      prevStep,
      hasCompletedTour,
    }),
    [
      isActive,
      stepIndex,
      step,
      stepReady,
      startTour,
      skipTour,
      nextStep,
      prevStep,
      hasCompletedTour,
    ],
  );

  return <TourContext.Provider value={value}>{children}</TourContext.Provider>;
}

export function useTour() {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error("useTour must be used within TourProvider");
  }
  return context;
}
