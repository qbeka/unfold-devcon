"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, RotateCcw, Sparkles } from "lucide-react";
import { SceneCanvas } from "@/components/corrections/SceneCanvas";
import { useUnfoldStore } from "@/lib/store";
import { demoCorrectionScene, demoPracticePrompt } from "@/lib/data/demoScene";
import { buttonPrimary, buttonSecondary } from "@/lib/ui";

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

const wrongAdvice = "Try again: Reports cannot include guesses. State only what was observed.";

export function PracticeScene() {
  const completePractice = useUnfoldStore((state) => state.completePractice);
  const [stage, setStage] = useState<Stage>("idle");
  const [transcript, setTranscript] = useState("");
  const [attemptCount, setAttemptCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const supportsSpeech = useRef<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const Ctor =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!Ctor) {
      supportsSpeech.current = false;
      return;
    }
    supportsSpeech.current = true;
    const rec: SpeechRecognitionLike = new Ctor();
    rec.continuous = false;
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

  function runSimulated() {
    setStage("listening");
    setTranscript("Simulating voice input…");
    window.setTimeout(() => {
      const sample =
        attemptCount === 0
          ? "I think the woman looked upset and probably wanted attention."
          : "Mrs. Meredith reported her purse was stolen at 1116.";
      setTranscript(sample);
      completeAttempt(sample);
    }, 1500);
  }

  function startListening() {
    setError(null);
    setTranscript("");

    if (!supportsSpeech.current || !recognitionRef.current) {
      runSimulated();
      return;
    }

    const rec = recognitionRef.current;
    rec.onresult = (event) => {
      let text = "";
      for (let i = 0; i < event.results.length; i += 1) {
        text += event.results[i][0].transcript;
      }
      setTranscript(text);
    };
    rec.onerror = (event) => {
      setError(`Mic unavailable (${event.error}). Using simulated voice input.`);
      runSimulated();
    };
    rec.onend = () => {
      setStage((current) => {
        if (current === "listening") {
          completeAttempt(transcriptRef.current || "(no speech detected)");
        }
        return current;
      });
    };
    setStage("listening");
    try {
      rec.start();
    } catch {
      runSimulated();
    }
  }

  // Keep latest transcript visible to onend without stale closure.
  const transcriptRef = useRef("");
  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);

  function stopListening() {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        /* ignore */
      }
    }
    completeAttempt(transcript);
  }

  function completeAttempt(spoken: string) {
    setAttemptCount((count) => {
      const next = count + 1;
      if (next === 1) {
        setStage("wrong");
      } else {
        setStage("correct");
      }
      if (!spoken) setTranscript("(no speech detected)");
      return next;
    });
  }

  function tryAgain() {
    setStage("idle");
    setTranscript("");
  }

  function finish() {
    completePractice(demoPracticePrompt.testedConcept);
  }

  const caption =
    stage === "listening"
      ? "Listening… speak the line you would put in your incident report."
      : stage === "wrong"
      ? wrongAdvice
      : stage === "correct"
      ? "Excellent. That sentence is objective and source-grounded."
      : "Press the microphone, then describe what you would write.";

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="max-w-md">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-slate-400">
            Interactive practice · voice
          </p>
          <h2 className="mt-2 text-lg font-semibold text-slate-950">{demoPracticePrompt.title}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">{demoPracticePrompt.prompt}</p>
        </div>
        <div className="flex items-center gap-1.5">
          {stage !== "listening" && stage !== "correct" && (
            <button className={buttonPrimary} onClick={startListening} type="button">
              <Mic className="mr-1.5 h-3.5 w-3.5" />
              {attemptCount === 0 ? "Speak your sentence" : "Try again"}
            </button>
          )}
          {stage === "listening" && (
            <button className={buttonSecondary} onClick={stopListening} type="button">
              <MicOff className="mr-1.5 h-3.5 w-3.5" />
              Stop
            </button>
          )}
          {stage === "correct" && (
            <button className={buttonPrimary} onClick={finish} type="button">
              <Sparkles className="mr-1.5 h-3.5 w-3.5" />
              Complete practice
            </button>
          )}
        </div>
      </div>

      <SceneCanvas
        playing={stage === "listening" || stage === "correct"}
        scene={demoCorrectionScene}
        caption={caption}
        height={420}
      />

      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-slate-400">
          What you said
        </p>
        <p className="mt-2 min-h-[1.5rem] text-sm text-slate-700">{transcript || "—"}</p>

        {stage === "wrong" && (
          <div className="mt-3 flex items-center justify-between rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-900">
            <span>{wrongAdvice}</span>
            <button className={buttonSecondary} onClick={tryAgain} type="button">
              <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
              Try again
            </button>
          </div>
        )}

        {stage === "correct" && (
          <div className="mt-3 rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
            {demoPracticePrompt.feedback}
          </div>
        )}

        {error && (
          <div className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-900">{error}</div>
        )}

        {!supportsSpeech.current && (
          <p className="mt-3 text-xs text-slate-400">
            Voice mode falls back to a simulated input on browsers without speech recognition.
          </p>
        )}
      </div>
    </div>
  );
}
