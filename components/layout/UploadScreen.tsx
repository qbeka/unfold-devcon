"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, FileUp, Languages, Loader2, ScanText, Sparkles, UploadCloud } from "lucide-react";
import { useUnfoldStore } from "@/lib/store";
import { buttonPrimary } from "@/lib/ui";
import { demoManifest } from "@/lib/data/demoManifest";
import { supportedLanguages } from "@/lib/data/moduleFiveContent";
import type { LanguageCode } from "@/lib/data/moduleFiveContent";
import type { DocumentManifest, DocumentProcessingStatus } from "@/lib/types";

const steps: { id: DocumentProcessingStatus; label: string; sub: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "uploading", label: "Upload", sub: "Stored to Amazon S3", icon: UploadCloud },
  { id: "extracting", label: "Extract", sub: "Textract reads pages and tables", icon: ScanText },
  { id: "parsing", label: "Parse", sub: "Bedrock identifies modules", icon: Sparkles },
  { id: "ready", label: "Ready", sub: "Choose your study language", icon: Check }
];

export function UploadScreen() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>();
  const documentStatus = useUnfoldStore((state) => state.documentStatus);
  const processingError = useUnfoldStore((state) => state.processingError);
  const setDocumentStatus = useUnfoldStore((state) => state.setDocumentStatus);
  const setDocumentReady = useUnfoldStore((state) => state.setDocumentReady);
  const setProcessingError = useUnfoldStore((state) => state.setProcessingError);
  const needsLanguageChoice = useUnfoldStore((state) => state.needsLanguageChoice);
  const language = useUnfoldStore((state) => state.language);
  const setLanguage = useUnfoldStore((state) => state.setLanguage);
  const confirmLanguage = useUnfoldStore((state) => state.confirmLanguage);

  async function processFile(file: File) {
    setFileName(file.name);
    setDocumentStatus("uploading");
    const extractionTimer = window.setTimeout(() => setDocumentStatus("extracting"), 700);
    const parsingTimer = window.setTimeout(() => setDocumentStatus("parsing"), 2000);
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
      window.clearTimeout(extractionTimer);
      window.clearTimeout(parsingTimer);
      setDocumentStatus("ready");
      // Immediately move to the language picker — no flash to the main app.
      setDocumentReady(data.manifest ?? demoManifest);
    } catch (error) {
      window.clearTimeout(extractionTimer);
      window.clearTimeout(parsingTimer);
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
        <div className="flex items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/unfold-logo.png" alt="Unfold" className="h-8 w-8" />
          <span className="text-[15px] font-semibold tracking-tight text-neutral-950">Unfold</span>
        </div>
        <p className="hidden text-[12px] font-medium text-neutral-500 sm:block">
          Source-grounded multilingual exam coach
        </p>
      </header>

      <section className="relative z-10 mx-auto grid w-full max-w-6xl grid-cols-1 gap-12 px-8 pb-16 pt-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:items-center">
        <div>
          <p className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-neutral-600">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Hackathon build · Module Five demo
          </p>
          <h1 className="mt-6 text-[44px] font-semibold leading-[1.04] tracking-tighter2 text-neutral-950 md:text-[56px]">
            Upload the manual.
            <br />
            Learn in your language.
            <br />
            Pass the exam.
          </h1>
          <p className="mt-6 max-w-lg text-[16px] leading-7 text-neutral-500">
            Unfold turns any certification PDF into a translated, exam-focused study coach. Drop the
            Alberta Basic Security Training manual on the right and we’ll process it end-to-end on
            AWS.
          </p>

          <ul className="mt-8 grid max-w-lg gap-4 text-[14px] leading-6 text-neutral-700 sm:grid-cols-2">
            <Bullet
              icon={ScanText}
              title="Source-grounded"
              body="Every exam question, scene, and discussion cites the manual."
            />
            <Bullet
              icon={Languages}
              title="Translated"
              body="Read the source in your native language, side by side."
            />
            <Bullet
              icon={Sparkles}
              title="3D corrections"
              body="See and practice the right answer in an animated scene."
            />
            <Bullet
              icon={Check}
              title="Tracked"
              body="Weak areas, readiness, and next-best-action — all live."
            />
          </ul>
        </div>

        <div className="relative">
          <div className="rounded-[20px] border border-black/10 bg-white p-6 shadow-[0_18px_60px_-30px_rgba(15,23,42,0.18)]">
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
              className="group relative mt-3 flex w-full flex-col items-center gap-3 rounded-xl border border-dashed border-black/15 bg-neutral-50 px-6 py-9 text-center transition hover:border-black/30 hover:bg-white disabled:cursor-not-allowed"
              disabled={isProcessing}
              onClick={() => inputRef.current?.click()}
              type="button"
            >
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-neutral-950 text-white transition group-hover:scale-105">
                {isProcessing ? <Loader2 className="h-5 w-5 animate-spin" /> : <FileUp className="h-5 w-5" />}
              </div>
              <div>
                <p className="text-[13px] font-medium text-neutral-950">
                  {fileName ?? "Choose a PDF"}
                </p>
                <p className="mt-0.5 text-[11px] text-neutral-500">PDF only · processed on AWS</p>
              </div>
            </button>

            <ol className="mt-5 space-y-2.5">
              {steps.map((step) => {
                const currentIndex = steps.findIndex((item) => item.id === documentStatus);
                const stepIndex = steps.findIndex((item) => item.id === step.id);
                const isActive = documentStatus !== "empty" && stepIndex <= currentIndex;
                const isComplete = documentStatus !== "empty" && stepIndex < currentIndex;
                const Icon = step.icon;
                return (
                  <li key={step.id} className="flex items-start gap-3">
                    <span
                      className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full transition ${
                        isComplete
                          ? "bg-neutral-950 text-white"
                          : isActive
                          ? "border border-black/15 bg-white text-neutral-700 shadow-[0_0_0_4px_rgba(0,0,0,0.04)]"
                          : "border border-black/10 bg-white text-neutral-300"
                      }`}
                    >
                      {isComplete ? <Check className="h-3 w-3" /> : <Icon className="h-3 w-3" />}
                    </span>
                    <div className="flex-1">
                      <p
                        className={`text-[12.5px] font-medium ${
                          isActive ? "text-neutral-950" : "text-neutral-500"
                        }`}
                      >
                        {step.label}
                      </p>
                      <p className="text-[11px] text-neutral-400">{step.sub}</p>
                    </div>
                  </li>
                );
              })}
            </ol>

            {processingError && (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[12px] font-medium text-red-900">
                {processingError}
              </div>
            )}
          </div>

          <p className="mt-4 text-center text-[11px] text-neutral-400">
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
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.035] [background-image:linear-gradient(to_right,rgba(0,0,0,0.6)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.6)_1px,transparent_1px)] [background-size:48px_48px]"
      />
    </>
  );
}

function Bullet({
  icon: Icon,
  title,
  body
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
}) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-black/10 bg-white text-neutral-700">
        <Icon className="h-3.5 w-3.5" />
      </span>
      <div>
        <p className="text-[13px] font-semibold text-neutral-950">{title}</p>
        <p className="text-[12.5px] leading-5 text-neutral-500">{body}</p>
      </div>
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
  const [highlight, setHighlight] = useState(false);
  useEffect(() => {
    setHighlight(true);
    const t = window.setTimeout(() => setHighlight(false), 600);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden text-neutral-950">
      <BackgroundDecor />

      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-8 py-6">
        <div className="flex items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/unfold-logo.png" alt="Unfold" className="h-8 w-8" />
          <span className="text-[15px] font-semibold tracking-tight text-neutral-950">Unfold</span>
        </div>
        <p
          className={`inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-2.5 py-1 text-[11px] font-medium text-neutral-600 transition ${
            highlight ? "shadow-[0_0_0_6px_rgba(16,185,129,0.15)]" : ""
          }`}
        >
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Document ready
        </p>
      </header>

      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-6rem)] w-full max-w-3xl flex-col justify-center px-8 pb-16">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-400">
            Step 2 of 2
          </p>
          <h1 className="mt-3 text-[36px] font-semibold leading-[1.06] tracking-tighter2 text-neutral-950 md:text-[44px]">
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
