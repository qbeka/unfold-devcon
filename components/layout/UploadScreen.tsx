"use client";

import { useRef, useState } from "react";
import { ArrowRight, Check, FileUp, Loader2 } from "lucide-react";
import { useUnfoldStore } from "@/lib/store";
import { buttonPrimary, buttonSecondary } from "@/lib/ui";
import { demoManifest } from "@/lib/data/demoManifest";
import { supportedLanguages } from "@/lib/data/moduleFiveContent";
import type { LanguageCode } from "@/lib/data/moduleFiveContent";
import type { DocumentManifest, DocumentProcessingStatus } from "@/lib/types";

const steps: { id: DocumentProcessingStatus; label: string }[] = [
  { id: "uploading", label: "Uploading to S3" },
  { id: "extracting", label: "Extracting with Textract" },
  { id: "parsing", label: "Parsing with Bedrock" },
  { id: "ready", label: "Ready" }
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
    const extractionTimer = window.setTimeout(() => setDocumentStatus("extracting"), 600);
    const parsingTimer = window.setTimeout(() => setDocumentStatus("parsing"), 1900);

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
      window.setTimeout(() => setDocumentReady(data.manifest ?? demoManifest), 700);
    } catch (error) {
      window.clearTimeout(extractionTimer);
      window.clearTimeout(parsingTimer);
      setProcessingError(error instanceof Error ? error.message : "Document processing failed.");
    }
  }

  const isProcessing = ["uploading", "extracting", "parsing", "ready"].includes(documentStatus);

  if (needsLanguageChoice) {
    return <LanguagePicker language={language} setLanguage={setLanguage} confirmLanguage={confirmLanguage} />;
  }

  return (
    <main className="min-h-screen bg-[#fafbfc] px-6 py-10 text-slate-950">
      <section className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-3xl flex-col justify-center">
        <div className="text-center">
          <p className="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-slate-400">Unfold</p>
          <h1 className="mt-6 text-[2.4rem] font-semibold leading-tight tracking-[-0.035em] text-slate-950 md:text-[2.8rem]">
            Upload the manual.
            <br />
            Learn in your language.
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-[0.95rem] leading-7 text-slate-500">
            Drop in the Alberta Basic Security Training PDF. Unfold uploads it to S3, extracts the
            text with Textract, and parses modules with Bedrock.
          </p>
        </div>

        <div className="mt-10">
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
            className="group relative flex w-full flex-col items-center gap-4 rounded-[1.75rem] border border-dashed border-slate-300 bg-white px-8 py-10 text-center transition hover:border-slate-400"
            disabled={isProcessing}
            onClick={() => inputRef.current?.click()}
            type="button"
          >
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-slate-950 text-white">
              {isProcessing ? <Loader2 className="h-6 w-6 animate-spin" /> : <FileUp className="h-6 w-6" />}
            </div>
            <div>
              <p className="text-base font-semibold text-slate-950">
                {fileName ?? "Choose a PDF to upload"}
              </p>
              <p className="mt-1 text-sm text-slate-500">PDF only · processed end-to-end on AWS</p>
            </div>
          </button>
        </div>

        <div className="mt-8 grid gap-2 md:grid-cols-4">
          {steps.map((step) => {
            const currentIndex = steps.findIndex((item) => item.id === documentStatus);
            const stepIndex = steps.findIndex((item) => item.id === step.id);
            const isActive = documentStatus !== "empty" && stepIndex <= currentIndex;
            const isComplete = documentStatus !== "empty" && stepIndex < currentIndex;
            return (
              <div
                key={step.id}
                className={`flex items-center gap-2 rounded-2xl border px-3 py-2.5 text-xs font-medium transition ${
                  isActive
                    ? "border-slate-200 bg-white text-slate-900 shadow-[0_2px_12px_rgba(15,23,42,0.06)]"
                    : "border-slate-200/70 bg-white/50 text-slate-400"
                }`}
              >
                <span
                  className={`grid h-5 w-5 place-items-center rounded-full text-[0.6rem] ${
                    isComplete
                      ? "bg-slate-950 text-white"
                      : isActive
                      ? "border border-slate-300 bg-white text-slate-500"
                      : "border border-slate-200 text-slate-300"
                  }`}
                >
                  {isComplete ? <Check className="h-3 w-3" /> : stepIndex + 1}
                </span>
                {step.label}
              </div>
            );
          })}
        </div>

        {processingError && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-950">
            {processingError}
          </div>
        )}
      </section>
    </main>
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
    <main className="min-h-screen bg-[#fafbfc] px-6 py-10 text-slate-950">
      <section className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-3xl flex-col justify-center">
        <div className="text-center">
          <p className="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-slate-400">
            Document ready
          </p>
          <h1 className="mt-6 text-[2.2rem] font-semibold leading-tight tracking-[-0.035em] text-slate-950 md:text-[2.6rem]">
            What is your native language?
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-[0.95rem] leading-7 text-slate-500">
            Unfold will translate the manual side-by-side with the original English so you can
            study in the language you think in.
          </p>
        </div>

        <div className="mt-10 grid gap-2 sm:grid-cols-2">
          {supportedLanguages.map((option) => {
            const isActive = option.code === language;
            return (
              <button
                key={option.code}
                className={`flex items-center justify-between rounded-2xl border px-5 py-4 text-left transition ${
                  isActive
                    ? "border-slate-950 bg-slate-950 text-white"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"
                }`}
                onClick={() => setLanguage(option.code)}
                type="button"
              >
                <div>
                  <p className="text-sm font-semibold">{option.label}</p>
                  <p className={`mt-0.5 text-xs ${isActive ? "text-white/70" : "text-slate-500"}`}>
                    {option.nativeLabel}
                  </p>
                </div>
                {isActive && <Check className="h-4 w-4" />}
              </button>
            );
          })}
        </div>

        <div className="mt-8 flex justify-center">
          <button className={buttonPrimary} onClick={confirmLanguage} type="button">
            Continue
            <ArrowRight className="ml-2 h-4 w-4" />
          </button>
        </div>
      </section>
    </main>
  );
}
