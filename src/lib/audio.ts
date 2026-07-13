/**
 * Self-contained Web Audio API synthesizer for premium high-tech sonic feedback.
 * Uses native oscillators to synthesize digital hums, sweeps, and clicks.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  return audioCtx;
}

export function playSynthTone(
  freq = 440,
  type: OscillatorType = "sine",
  duration = 0.3,
  volume = 0.08,
  freqEnd?: number
) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    // Resume context if suspended (browser security policy)
    if (ctx.state === "suspended") {
      ctx.resume();
    }

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    if (freqEnd !== undefined) {
      osc.frequency.exponentialRampToValueAtTime(freqEnd, ctx.currentTime + duration);
    }

    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (err) {
    console.warn("Synth tone could not be played:", err);
  }
}

// Preset sound effects
export const soundFx = {
  click: () => playSynthTone(600, "sine", 0.08, 0.04),
  hover: () => playSynthTone(350, "sine", 0.12, 0.02, 500),
  select: () => playSynthTone(400, "triangle", 0.18, 0.06, 800),
  success: () => {
    playSynthTone(523.25, "sine", 0.15, 0.06); // C5
    setTimeout(() => playSynthTone(659.25, "sine", 0.15, 0.06), 100); // E5
    setTimeout(() => playSynthTone(783.99, "sine", 0.25, 0.06), 200); // G5
  },
  handshake: () => {
    // Cyber sweep sound
    playSynthTone(100, "sine", 0.4, 0.08, 1200);
  },
  payment: () => {
    playSynthTone(880, "sine", 0.1, 0.05);
    setTimeout(() => playSynthTone(1760, "sine", 0.2, 0.05), 80);
  }
};
