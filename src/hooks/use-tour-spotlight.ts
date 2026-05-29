import { useEffect, useLayoutEffect, useRef, useState } from "react";

export type SpotlightRect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

const PAD = 12;
const LERP = 0.14;
const SETTLE_THRESHOLD = 0.5;

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function rectsClose(a: SpotlightRect, b: SpotlightRect) {
  return (
    Math.abs(a.top - b.top) < SETTLE_THRESHOLD &&
    Math.abs(a.left - b.left) < SETTLE_THRESHOLD &&
    Math.abs(a.width - b.width) < SETTLE_THRESHOLD &&
    Math.abs(a.height - b.height) < SETTLE_THRESHOLD
  );
}

function measureTarget(target: string | undefined): SpotlightRect | null {
  if (!target || typeof window === "undefined") {
    return null;
  }
  const el = document.querySelector(`[data-tour="${target}"]`);
  if (!el) {
    return null;
  }
  const box = el.getBoundingClientRect();
  return {
    top: box.top - PAD,
    left: box.left - PAD,
    width: box.width + PAD * 2,
    height: box.height + PAD * 2,
  };
}

export function useTourSpotlight(
  target: string | undefined,
  active: boolean,
  stepKey: string,
  ready: boolean,
) {
  const [rect, setRect] = useState<SpotlightRect | null>(null);
  const animatedRef = useRef<SpotlightRect | null>(null);
  const frameRef = useRef<number>(0);
  const goalRef = useRef<SpotlightRect | null>(null);

  useLayoutEffect(() => {
    if (!active || !ready) {
      goalRef.current = null;
      return;
    }

    if (!target) {
      goalRef.current = null;
      setRect(null);
      animatedRef.current = null;
      return;
    }

    const el = document.querySelector(`[data-tour="${target}"]`);
    el?.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });

    const applyGoal = () => {
      goalRef.current = measureTarget(target);
    };

    applyGoal();
    const t1 = window.setTimeout(applyGoal, 120);
    const t2 = window.setTimeout(applyGoal, 380);
    const t3 = window.setTimeout(applyGoal, 720);

    const onResize = () => applyGoal();
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onResize, true);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onResize, true);
    };
  }, [active, ready, target, stepKey]);

  useEffect(() => {
    if (!active || !ready || !target) {
      cancelAnimationFrame(frameRef.current);
      return;
    }

    const tick = () => {
      const goal = goalRef.current;
      if (!goal) {
        frameRef.current = requestAnimationFrame(tick);
        return;
      }

      if (!animatedRef.current) {
        animatedRef.current = { ...goal };
        setRect({ ...goal });
        frameRef.current = requestAnimationFrame(tick);
        return;
      }

      const current = animatedRef.current;
      const next: SpotlightRect = {
        top: lerp(current.top, goal.top, LERP),
        left: lerp(current.left, goal.left, LERP),
        width: lerp(current.width, goal.width, LERP),
        height: lerp(current.height, goal.height, LERP),
      };

      animatedRef.current = next;
      setRect({ ...next });

      if (!rectsClose(next, goal)) {
        frameRef.current = requestAnimationFrame(tick);
      }
    };

    frameRef.current = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frameRef.current);
  }, [active, ready, target, stepKey]);

  useEffect(() => {
    if (!active) {
      animatedRef.current = null;
      setRect(null);
    }
  }, [active]);

  return rect;
}
