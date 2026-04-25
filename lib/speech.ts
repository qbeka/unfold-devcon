"use client";

let cachedVoice: SpeechSynthesisVoice | null = null;
let voicesLoadedPromise: Promise<void> | null = null;

const PREFERRED_VOICE_ORDER = [
  "Microsoft Ava Online (Natural)",
  "Microsoft Andrew Online (Natural)",
  "Microsoft Emma Online (Natural)",
  "Microsoft Brian Online (Natural)",
  "Microsoft Aria Online (Natural)",
  "Microsoft Jenny Online (Natural)",
  "Google US English",
  "Google UK English Female",
  "Google UK English Male",
  "Ava (Premium)",
  "Samantha (Premium)",
  "Allison (Premium)",
  "Serena (Premium)",
  "Samantha (Enhanced)",
  "Ava (Enhanced)",
  "Karen (Enhanced)",
  "Daniel (Enhanced)",
  "Allison (Enhanced)",
  "Tom (Enhanced)",
  "Samantha",
  "Ava",
  "Allison",
  "Karen",
  "Daniel",
  "Tom"
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

  const english = voices.filter((v) => v.lang?.toLowerCase().startsWith("en"));
  const pool = english.length > 0 ? english : voices;

  for (const name of PREFERRED_VOICE_ORDER) {
    const match = pool.find((v) => v.name === name);
    if (match) {
      cachedVoice = match;
      return cachedVoice;
    }
  }

  const scored = [...pool].sort((a, b) => voiceScore(b) - voiceScore(a));
  cachedVoice = scored[0] ?? pool.find((v) => v.default) ?? pool[0];
  return cachedVoice;
}

function voiceScore(voice: SpeechSynthesisVoice) {
  const name = voice.name.toLowerCase();
  let score = 0;
  if (voice.lang === "en-US") score += 8;
  if (voice.lang === "en-CA") score += 7;
  if (voice.lang === "en-GB") score += 6;
  if (name.includes("online")) score += 18;
  if (name.includes("natural")) score += 18;
  if (name.includes("premium")) score += 16;
  if (name.includes("enhanced")) score += 12;
  if (name.includes("neural")) score += 12;
  if (name.includes("google")) score += 8;
  if (name.includes("microsoft")) score += 10;
  if (name.includes("compact")) score -= 20;
  if (name.includes("novelty")) score -= 20;
  if (voice.default) score += 2;
  return score;
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
  rate = 0.9,
  pitch = 0.98,
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
