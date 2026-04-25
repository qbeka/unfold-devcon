"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Mic, RotateCcw, Square } from "lucide-react";
import { SceneCanvas } from "@/components/corrections/SceneCanvas";
import { useUnfoldStore } from "@/lib/store";
import { buttonPrimary, buttonSecondary } from "@/lib/ui";
import { cancelSpeech, speak } from "@/lib/speech";
import { demoCorrectionScene, demoPracticePrompt, factualReport } from "@/lib/data/demoScene";

type SpeechRecognitionLike = {
  start: () => void;
  stop: () => void;
  onresult: ((event: { results: ArrayLike<{ 0: { transcript: string } } & { isFinal: boolean }> }) => void) | null;
  onend: (() => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  continuous: boolean;
  interimResults: boolean;
  lang: string;
};

type Stage = "idle" | "listening" | "wrong" | "correct";

const wrongAdvice = "Try again. Your sentence used opinion or guesses. Stick to what you observed.";
const correctMessage = "Correct. Now reread Module Five and retake the exam.";

export function PracticeScene() {
  const completePractice = useUnfoldStore((state) => state.completePractice);
  const [stage, setStage] = useState<Stage>("idle");
  const [transcript, setTranscript] = useState("");
  const [attemptCount, setAttemptCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [listeningElapsed, setListeningElapsed] = useState(0);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const transcriptRef = useRef("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const Ctor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!Ctor) return;
    const rec: SpeechRecognitionLike = new Ctor();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-US";
    recognitionRef.current = rec;

    return () => {
      rec.onresult = null;
      rec.onend = null;
      rec.onerror = null;
      try {
        rec.stop();
      } catch {
        /* ignore */
      }
    };
  }, []);

  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);

  useEffect(() => {
    if (stage !== "listening") {
      setListeningElapsed(0);
      return;
    }
    const start = Date.now();
    const id = window.setInterval(() => setListeningElapsed(Date.now() - start), 200);
    return () => window.clearInterval(id);
  }, [stage]);

  // Narrate feedback
  useEffect(() => {
    if (stage === "wrong") {
      void speak({ text: wrongAdvice, rate: 0.88, pitch: 0.96 });
    } else if (stage === "correct") {
      void speak({ text: correctMessage, rate: 0.88, pitch: 0.96 });
    }
    return () => cancelSpeech();
  }, [stage]);

  function startListening() {
    setError(null);
    setTranscript("");
    cancelSpeech();

    const rec = recognitionRef.current;
    if (!rec) {
      setError("Voice input is not available in this browser. Use Chrome or Edge.");
      return;
    }

    rec.onresult = (event) => {
      let text = "";
      for (let i = 0; i < event.results.length; i += 1) {
        text += event.results[i][0].transcript;
      }
      setTranscript(text);
    };
    rec.onerror = (event) => {
      setError(`Microphone error: ${event.error}.`);
      setStage("idle");
    };
    rec.onend = () => {
      // We control end via Stop button, but if it ends naturally just settle current attempt.
      setStage((current) => {
        if (current === "listening") {
          completeAttempt();
        }
        return current;
      });
    };
    setStage("listening");
    try {
      rec.start();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start microphone.");
      setStage("idle");
    }
  }

  function stopListening() {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        /* ignore */
      }
    }
    completeAttempt();
  }

  function completeAttempt() {
    setAttemptCount((count) => {
      const next = count + 1;
      setStage(next === 1 ? "wrong" : "correct");
      if (!transcriptRef.current.trim()) setTranscript("(no speech detected)");
      return next;
    });
  }

  function tryAgain() {
    cancelSpeech();
    setStage("idle");
    setTranscript("");
  }

  function finish() {
    completePractice();
  }

  const seconds = (listeningElapsed / 1000).toFixed(1);
  const caption =
    stage === "listening"
      ? `Recording · ${seconds}s — speak the line you would put in your incident report.`
      : stage === "wrong"
      ? wrongAdvice
      : stage === "correct"
      ? correctMessage
      : "Press the microphone, then describe what you would write.";

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-black/10 bg-white p-5">
        <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-400">
          {demoPracticePrompt.title}
        </p>
        <p className="mt-2 text-[14.5px] leading-7 text-neutral-700">{demoPracticePrompt.prompt}</p>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2">
        {stage === "idle" && (
          <button className={buttonPrimary} onClick={startListening} type="button">
            <Mic className="h-3.5 w-3.5" />
            {attemptCount === 0 ? "Start recording" : "Record again"}
          </button>
        )}
        {stage === "listening" && (
          <button className={buttonSecondary} onClick={stopListening} type="button">
            <Square className="h-3.5 w-3.5" />
            Finish recording
          </button>
        )}
        {stage === "wrong" && (
          <button className={buttonPrimary} onClick={tryAgain} type="button">
            <RotateCcw className="h-3.5 w-3.5" />
            Try again
          </button>
        )}
        {stage === "correct" && (
          <button className={buttonPrimary} onClick={finish} type="button">
            <Check className="h-3.5 w-3.5" />
            Continue
          </button>
        )}
      </div>

      <SceneCanvas
        playing={stage === "listening" || stage === "correct"}
        scene={demoCorrectionScene}
        variant="practice"
        caption={caption}
        height={460}
      />

      <div className="rounded-xl border border-black/10 bg-white p-4">
        <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-400">
          What you said
        </p>
        <p className="mt-2 min-h-[1.5rem] text-[14px] leading-6 text-neutral-700">
          {transcript || "—"}
        </p>

        {stage === "wrong" && (
          <div className="mt-3 rounded-lg bg-amber-50 px-3 py-10 text-[13px] text-amber-900">
            <p className="font-medium">Try again — wrong.</p>
            <p>Don&apos;t use opinions. State only what you observed: time, location, description.</p>
          </div>
        )}

        {stage === "correct" && (
          <div className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-[13px] text-emerald-900">
            <p className="font-medium">Correct.</p>
            <p>Reread Module Five if anything still feels uncertain, then retake the exam.</p>
            <p className="mt-2 text-emerald-700">Suggested sentence: “{factualReport}”</p>
          </div>
        )}

        {error && (
          <div className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-[13px] text-red-900">{error}</div>
        )}
      </div>
    </div>
  );
}
