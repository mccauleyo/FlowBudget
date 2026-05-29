export type SoundId =
  | "tap"
  | "navigate"
  | "tourStep"
  | "tourStart"
  | "tourEnd"
  | "success"
  | "whoosh"
  | "toggle";

let audioCtx: AudioContext | null = null;

function getAudioContext() {
  if (typeof window === "undefined") {
    return null;
  }
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === "suspended") {
    void audioCtx.resume();
  }
  return audioCtx;
}

function tone(
  ctx: AudioContext,
  frequency: number,
  start: number,
  duration: number,
  volume: number,
  type: OscillatorType = "sine",
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(frequency, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(start);
  osc.stop(start + duration + 0.02);
}

function chord(ctx: AudioContext, frequencies: number[], start: number, duration: number, volume: number) {
  frequencies.forEach((f) => tone(ctx, f, start, duration, volume * 0.55));
}

export function playSound(id: SoundId, masterVolume = 0.35) {
  const ctx = getAudioContext();
  if (!ctx) {
    return;
  }

  const now = ctx.currentTime;
  const v = Math.min(1, Math.max(0, masterVolume));

  switch (id) {
    case "tap":
      tone(ctx, 620, now, 0.06, v * 0.35, "triangle");
      break;
    case "toggle":
      tone(ctx, 480, now, 0.05, v * 0.3, "square");
      tone(ctx, 720, now + 0.04, 0.05, v * 0.22, "sine");
      break;
    case "navigate":
      tone(ctx, 320, now, 0.08, v * 0.2, "sine");
      tone(ctx, 520, now + 0.06, 0.1, v * 0.28, "sine");
      break;
    case "whoosh": {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(640, now + 0.14);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(v * 0.22, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.18);
      break;
    }
    case "tourStep":
      tone(ctx, 523.25, now, 0.12, v * 0.32);
      tone(ctx, 659.25, now + 0.1, 0.14, v * 0.28);
      break;
    case "tourStart":
      chord(ctx, [392, 493.88, 587.33], now, 0.22, v * 0.3);
      break;
    case "tourEnd":
      chord(ctx, [523.25, 659.25, 783.99], now, 0.35, v * 0.34);
      tone(ctx, 1046.5, now + 0.2, 0.25, v * 0.2);
      break;
    case "success":
      tone(ctx, 880, now, 0.08, v * 0.3);
      tone(ctx, 1174.66, now + 0.07, 0.12, v * 0.26);
      break;
  }
}

export function unlockAudio() {
  getAudioContext();
}
