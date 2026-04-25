"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, RotateCcw, Sparkles } from "lucide-react";
import { SceneCanvas } from "@/components/corrections/SceneCanvas";
import { useUnfoldStore } from "@/lib/store";
import { buttonPrimary, buttonSecondary } from "@/lib/ui";
import { cancelSpeech, speak } from "@/lib/speech";
import { demoCorrectionScene, demoPracticePrompt, factualReport, opinionReport } from "@/lib/data/demoScene";

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

const wrongAdvice = "Try again: reports cannot include guesses. State only what you observed.";

export function PracticeScene() {
  const completePractice = useUnfoldStore((state) => state.completePractice);
  const [stage, setStage] = useState<Stage>("idle");
  const [transcript, setTranscript] = useState("");
  const [attemptCount, setAttemptCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [listeningElapsed, setListeningElapsed] = useState(0);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const supportsSpeech = useRef<boolean>(false);
  const transcriptRef = useRef("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const Ctor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
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

  // Narrate the prompt and feedback at the right moments.
  useEffect(() => {
    if (stage === "wrong") {
      void speak({ text: wrongAdvice, rate: 0.95 });
    } else if (stage === "correct") {
      void speak({ text: `Excellent. ${demoPracticePrompt.feedback}`, rate: 0.95 });
    }
    return () => cancelSpeech();
  }, [stage]);

  function runSimulated() {
    setStage("listening");
    setTranscript("Simulating voice input…");
    window.setTimeout(() => {
      const sample = attemptCount === 0 ? opinionReport : factualReport;
      setTranscript(sample);
      completeAttempt(sample);
    }, 1700);
  }

  function startListening() {
    setError(null);
    setTranscript("");
    cancelSpeech();

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
      setStage(next === 1 ? "wrong" : "correct");
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

  const seconds = (listeningElapsed / 1000).toFixed(1);
  const caption =
    stage === "listening"
      ? `Listening · ${seconds}s — speak the line you would put in your incident report.`
      : stage === "wrong"
      ? wrongAdvice
      : stage === "correct"
      ? "Excellent. Objective, time-stamped, and factual."
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
        {stage !== "listening" && stage !== "correct" && (
          <button className={buttonPrimary} onClick={startListening} type="button">
            <Mic className="h-3.5 w-3.5" />
            {attemptCount === 0 ? "Speak your sentence" : "Try again"}
          </button>
        )}
        {stage === "listening" && (
          <button className={buttonSecondary} onClick={stopListening} type="button">
            <MicOff className="h-3.5 w-3.5" />
            Stop
          </button>
        )}
        {stage === "correct" && (
          <button className={buttonPrimary} onClick={finish} type="button">
            <Sparkles className="h-3.5 w-3.5" />
            Complete practice
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
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-amber-50 px-3 py-2 text-[13px] text-amber-900">
            <span>{wrongAdvice}</span>
            <button className={buttonSecondary} onClick={tryAgain} type="button">
              <RotateCcw className="h-3.5 w-3.5" />
              Try again
            </button>
          </div>
        )}

        {stage === "correct" && (
          <div className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-[13px] text-emerald-900">
            Suggested sentence: “{factualReport}”
          </div>
        )}

        {error && (
          <div className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-[13px] text-red-900">{error}</div>
        )}

        {!supportsSpeech.current && (
          <p className="mt-3 text-[11px] text-neutral-400">
            This browser does not support speech recognition. Voice input falls back to a simulated
            transcript for the demo.
          </p>
        )}
      </div>
    </div>
  );
}
