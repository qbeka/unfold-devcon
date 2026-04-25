"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { useUnfoldStore } from "@/lib/store";
import { buttonPrimary } from "@/lib/ui";
import { demoManifest } from "@/lib/data/demoManifest";
import { supportedLanguages } from "@/lib/data/moduleFiveContent";
import type { LanguageCode } from "@/lib/data/moduleFiveContent";
import type { DocumentManifest, DocumentProcessingStatus } from "@/lib/types";

const STATUS_LABEL: Record<DocumentProcessingStatus, string> = {
  empty: "",
  uploading: "Uploading the document",
  extracting: "Reading the pages",
  parsing: "Identifying the modules",
  ready: "Ready",
  error: "Something went wrong"
};

export function UploadScreen() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>();
  const [pseudoProgress, setPseudoProgress] = useState(0);
  const documentStatus = useUnfoldStore((state) => state.documentStatus);
  const processingError = useUnfoldStore((state) => state.processingError);
  const setDocumentStatus = useUnfoldStore((state) => state.setDocumentStatus);
  const setDocumentReady = useUnfoldStore((state) => state.setDocumentReady);
  const setProcessingError = useUnfoldStore((state) => state.setProcessingError);
  const needsLanguageChoice = useUnfoldStore((state) => state.needsLanguageChoice);
  const language = useUnfoldStore((state) => state.language);
  const setLanguage = useUnfoldStore((state) => state.setLanguage);
  const confirmLanguage = useUnfoldStore((state) => state.confirmLanguage);

  // Smooth percentage that climbs slowly while processing.
  useEffect(() => {
    if (documentStatus === "empty" || documentStatus === "ready" || documentStatus === "error") {
      setPseudoProgress(documentStatus === "ready" ? 100 : 0);
      return;
    }
    setPseudoProgress(6);
    const id = window.setInterval(() => {
      setPseudoProgress((p) => {
        if (p >= 92) return p;
        const inc = p < 30 ? 2.6 : p < 65 ? 1.4 : 0.6;
        return Math.min(p + inc, 92);
      });
    }, 280);
    return () => window.clearInterval(id);
  }, [documentStatus]);

  async function processFile(file: File) {
    setFileName(file.name);
    setDocumentStatus("uploading");
    // Drawn-out timers so the demo "feels" real, even if Textract returns instantly.
    const t1 = window.setTimeout(() => setDocumentStatus("extracting"), 2200);
    const t2 = window.setTimeout(() => setDocumentStatus("parsing"), 5400);
    const minimumDelay = new Promise<void>((resolve) => window.setTimeout(resolve, 8200));
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/process-document", {
        method: "POST",
        body: formData
      });
      const data = (await response.json()) as {
        manifest?: DocumentManifest;
        warning?: string;
        error?: string;
      };
      if (!response.ok || !data.manifest) {
        throw new Error(data.error ?? "Document processing failed.");
      }
      // Wait for the minimum delay so the staged progress reads correctly.
      await minimumDelay;
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      setPseudoProgress(100);
      setDocumentStatus("ready");
      setDocumentReady(data.manifest ?? demoManifest);
    } catch (error) {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      setProcessingError(error instanceof Error ? error.message : "Document processing failed.");
    }
  }

  if (needsLanguageChoice) {
    return <LanguagePicker language={language} setLanguage={setLanguage} confirmLanguage={confirmLanguage} />;
  }

  const isProcessing = ["uploading", "extracting", "parsing", "ready"].includes(documentStatus);

  return (
    <main className="relative min-h-screen overflow-hidden text-neutral-950">
      <BackgroundDecor />

      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-8 py-6">
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/unfold-logo.png" alt="Unfold" className="h-9 w-9" />
          <span className="text-[16px] font-semibold tracking-tight text-neutral-950">Unfold</span>
        </div>
        <p className="hidden text-[12px] font-medium text-neutral-500 sm:block">
          Source-grounded multilingual exam coach
        </p>
      </header>

      <section className="relative z-10 mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 px-8 pb-20 pt-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)]">
        <div>
          <p className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-600">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
            For certification students
          </p>
          <h1 className="mt-6 text-[44px] font-semibold leading-[1.04] tracking-tighter2 text-neutral-950 md:text-[60px]">
            Upload the manual.
            <br />
            Pass the exam.
          </h1>
          <p className="mt-6 max-w-lg text-[16px] leading-7 text-neutral-500">
            Unfold turns any certification PDF into a translated, exam-focused study coach. It's built
            for students who think in a language other than English.
          </p>

          <ul className="mt-10 grid max-w-lg gap-5 text-[14.5px] leading-6 text-neutral-700 sm:grid-cols-2">
            <Bullet
              title="Unfold documents into a 3D world"
              body="Turn source material into visual scenes that make mistakes easier to understand."
            />
            <Bullet
              title="Engage in live discussion with Agentic Classmates"
              body="Study source activities with AI classmates who ask, challenge, and summarize."
            />
            <Bullet
              title="Create informational movies"
              body="Generate short source-grounded lessons from the manual."
            />
            <Bullet
              title="Write personalized quizzes and track how you improve"
              body="Practice targeted exam questions and see weak areas improve over time."
            />
          </ul>
        </div>

        <div className="relative">
          <div className="rounded-[20px] border border-black/10 bg-white p-7 shadow-[0_18px_60px_-30px_rgba(15,23,42,0.18)]">
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-400">
              Upload manual
            </p>

            <input
              ref={inputRef}
              accept="application/pdf"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void processFile(file);
              }}
              type="file"
            />

            <button
              className="mt-3 flex w-full flex-col items-center gap-2.5 rounded-xl border border-dashed border-black/15 bg-neutral-50 px-6 py-10 text-center transition hover:border-black/30 hover:bg-white disabled:cursor-not-allowed"
              disabled={isProcessing}
              onClick={() => inputRef.current?.click()}
              type="button"
            >
              <p className="text-[14px] font-semibold text-neutral-950">
                {fileName ?? "Choose a PDF"}
              </p>
              <p className="text-[12px] text-neutral-500">PDF only · processed for you</p>
            </button>

            {documentStatus !== "empty" && (
              <div className="mt-6 space-y-2">
                <div className="flex items-center justify-between text-[12px]">
                  <span className="flex items-center gap-2 font-medium text-neutral-700">
                    {documentStatus === "ready" ? (
                      <Check className="h-3.5 w-3.5" />
                    ) : (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    )}
                    {STATUS_LABEL[documentStatus]}
                  </span>
                  <span className="font-mono text-[11px] text-neutral-400">
                    {Math.round(pseudoProgress)}%
                  </span>
                </div>
                <div className="h-1 overflow-hidden rounded-full bg-black/5">
                  <div
                    className="h-full rounded-full bg-neutral-950 transition-[width] duration-500"
                    style={{ width: `${pseudoProgress}%` }}
                  />
                </div>
              </div>
            )}

            {processingError && (
              <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[13px] font-medium text-red-900">
                {processingError}
              </div>
            )}
          </div>

          <p className="mt-3 text-center text-[11px] text-neutral-400">
            Your PDF stays in your AWS account. We never share it.
          </p>
        </div>
      </section>
    </main>
  );
}

function BackgroundDecor() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_-10%,rgba(15,23,42,0.05),transparent_55%),radial-gradient(circle_at_90%_120%,rgba(15,23,42,0.04),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.035] [background-image:linear-gradient(to_right,rgba(0,0,0,0.6)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.6)_1px,transparent_1px)] [background-size:48px_48px]" />
    </>
  );
}

function Bullet({ title, body }: { title: string; body: string }) {
  return (
    <li>
      <p className="text-[13px] font-semibold text-neutral-950">{title}</p>
      <p className="mt-1 text-[13px] leading-6 text-neutral-500">{body}</p>
    </li>
  );
}

function LanguagePicker({
  language,
  setLanguage,
  confirmLanguage
}: {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  confirmLanguage: () => void;
}) {
  return (
    <main className="relative min-h-screen overflow-hidden text-neutral-950">
      <BackgroundDecor />

      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-8 py-6">
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/unfold-logo.png" alt="Unfold" className="h-9 w-9" />
          <span className="text-[16px] font-semibold tracking-tight text-neutral-950">Unfold</span>
        </div>
        <p className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-2.5 py-1 text-[11px] font-medium text-neutral-600">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Document ready
        </p>
      </header>

      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-7rem)] w-full max-w-3xl flex-col justify-center px-8 pb-20">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-400">
            Step 2 of 2
          </p>
          <h1 className="mt-3 text-[40px] font-semibold leading-[1.04] tracking-tighter2 text-neutral-950 md:text-[52px]">
            What is your native language?
          </h1>
          <p className="mt-4 max-w-lg text-[15px] leading-7 text-neutral-500">
            Unfold will translate Module Five side-by-side with the original English so you can study
            in the language you think in. You can switch any time.
          </p>
        </div>

        <div className="mt-10 grid gap-2 sm:grid-cols-2">
          {supportedLanguages.map((option) => {
            const isActive = option.code === language;
            return (
              <button
                key={option.code}
                className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left transition ${
                  isActive
                    ? "border-neutral-950 bg-neutral-950 text-white"
                    : "border-black/10 bg-white text-neutral-700 hover:border-black/30"
                }`}
                onClick={() => setLanguage(option.code)}
                type="button"
              >
                <div>
                  <p className="text-[13px] font-medium">{option.label}</p>
                  <p className={`mt-0.5 text-[11px] ${isActive ? "text-white/70" : "text-neutral-500"}`}>
                    {option.nativeLabel}
                  </p>
                </div>
                {isActive && <Check className="h-4 w-4" />}
              </button>
            );
          })}
        </div>

        <div className="mt-8">
          <button className={buttonPrimary} onClick={confirmLanguage} type="button">
            Open my study workspace
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </section>
    </main>
  );
}
