import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { unlockAudio, playSound, type SoundId } from "@/lib/sounds";

type SoundContextValue = {
  enabled: boolean;
  volume: number;
  setEnabled: (value: boolean) => void;
  setEnabledQuiet: (value: boolean) => void;
  setVolume: (value: number) => void;
  play: (id: SoundId) => void;
};

const SoundContext = createContext<SoundContextValue | null>(null);

const STORAGE_KEY = "flowbudget:sound-enabled";

function readEnabled() {
  if (typeof window === "undefined") {
    return true;
  }
  return localStorage.getItem(STORAGE_KEY) !== "off";
}

export function SoundProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabledState] = useState(readEnabled);
  const [volume] = useState(0.38);

  useEffect(() => {
    const unlock = () => unlockAudio();
    document.addEventListener("pointerdown", unlock, { once: true });
    document.addEventListener("keydown", unlock, { once: true });
    return () => {
      document.removeEventListener("pointerdown", unlock);
      document.removeEventListener("keydown", unlock);
    };
  }, []);

  const setEnabled = useCallback((value: boolean) => {
    setEnabledState(value);
    localStorage.setItem(STORAGE_KEY, value ? "on" : "off");
    if (value) {
      unlockAudio();
      playSound("toggle", volume);
    }
  }, [volume]);

  const setEnabledQuiet = useCallback((value: boolean) => {
    setEnabledState(value);
    localStorage.setItem(STORAGE_KEY, value ? "on" : "off");
    if (value) {
      unlockAudio();
    }
  }, []);

  const play = useCallback(
    (id: SoundId) => {
      if (!enabled) {
        return;
      }
      playSound(id, volume);
    },
    [enabled, volume],
  );

  const value = useMemo(
    () => ({
      enabled,
      volume,
      setEnabled,
      setEnabledQuiet,
      setVolume: () => {},
      play,
    }),
    [enabled, volume, setEnabled, setEnabledQuiet, play],
  );

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}

export function useSound() {
  const context = useContext(SoundContext);
  if (!context) {
    return {
      enabled: false,
      volume: 0,
      setEnabled: () => {},
      setEnabledQuiet: () => {},
      setVolume: () => {},
      play: (_id: SoundId) => {},
    };
  }
  return context;
}
