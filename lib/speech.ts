"use client";

let cachedVoice: SpeechSynthesisVoice | null = null;
let voicesLoadedPromise: Promise<void> | null = null;

const PREFERRED_VOICE_ORDER = [
  // Modern enhanced voices (Apple)
  "Samantha (Enhanced)",
  "Karen (Enhanced)",
  "Daniel (Enhanced)",
  "Allison (Enhanced)",
  "Ava (Enhanced)",
  "Tom (Enhanced)",
  "Samantha",
  "Allison",
  "Ava",
  "Karen",
  "Daniel",
  "Tom",
  // Microsoft natural voices
  "Microsoft Aria Online (Natural)",
  "Microsoft Jenny Online (Natural)",
  "Microsoft Aria",
  "Microsoft Jenny",
  // Google voices
  "Google US English",
  "Google UK English Female",
  "Google UK English Male"
];

function ensureVoicesLoaded(): Promise<void> {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return Promise.resolve();
  }
  const existing = window.speechSynthesis.getVoices();
  if (existing.length > 0) return Promise.resolve();
  if (voicesLoadedPromise) return voicesLoadedPromise;

  voicesLoadedPromise = new Promise<void>((resolve) => {
    const onChange = () => {
      window.speechSynthesis.removeEventListener("voiceschanged", onChange);
      resolve();
    };
    window.speechSynthesis.addEventListener("voiceschanged", onChange);
    // Fallback timeout in case voiceschanged never fires
    window.setTimeout(resolve, 1500);
  });
  return voicesLoadedPromise;
}

function pickBestVoice(): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
  if (cachedVoice) return cachedVoice;

  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;

  // Filter to English voices first
  const english = voices.filter((v) => v.lang?.toLowerCase().startsWith("en"));
  const pool = english.length > 0 ? english : voices;

  for (const name of PREFERRED_VOICE_ORDER) {
    const match = pool.find((v) => v.name === name);
    if (match) {
      cachedVoice = match;
      return cachedVoice;
    }
  }

  // Otherwise: prefer voices flagged as "default" or named with "Natural"
  const natural = pool.find((v) => v.name.toLowerCase().includes("natural"));
  if (natural) {
    cachedVoice = natural;
    return cachedVoice;
  }
  cachedVoice = pool.find((v) => v.default) ?? pool[0];
  return cachedVoice;
}

export type SpeakOptions = {
  text: string;
  rate?: number;
  pitch?: number;
  volume?: number;
  onEnd?: () => void;
  onError?: () => void;
};

export async function speak({
  text,
  rate = 0.95,
  pitch = 1.0,
  volume = 1.0,
  onEnd,
  onError
}: SpeakOptions): Promise<SpeechSynthesisUtterance | null> {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
  await ensureVoicesLoaded();
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  const voice = pickBestVoice();
  if (voice) {
    utterance.voice = voice;
    utterance.lang = voice.lang;
  } else {
    utterance.lang = "en-US";
  }
  utterance.rate = rate;
  utterance.pitch = pitch;
  utterance.volume = volume;
  utterance.onend = () => onEnd?.();
  utterance.onerror = () => onError?.();
  window.speechSynthesis.speak(utterance);
  return utterance;
}

export function cancelSpeech() {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
}
