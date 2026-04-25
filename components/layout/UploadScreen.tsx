"use client";

import { useRef, useState } from "react";
import { FileUp, Loader2 } from "lucide-react";
import { useUnfoldStore } from "@/lib/store";
import { buttonPrimary, buttonSecondary } from "@/lib/ui";
import { demoManifest } from "@/lib/data/demoManifest";
import type { DocumentManifest, DocumentProcessingStatus } from "@/lib/types";

const steps: { id: DocumentProcessingStatus; label: string }[] = [
  { id: "uploading", label: "Uploading PDF to S3" },
  { id: "extracting", label: "Extracting text with Textract" },
  { id: "parsing", label: "Parsing modules with Bedrock" },
  { id: "ready", label: "Document ready" }
];

export function UploadScreen() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>();
  const documentStatus = useUnfoldStore((state) => state.documentStatus);
  const processingError = useUnfoldStore((state) => state.processingError);
  const setDocumentStatus = useUnfoldStore((state) => state.setDocumentStatus);
  const setDocumentReady = useUnfoldStore((state) => state.setDocumentReady);
  const setProcessingError = useUnfoldStore((state) => state.setProcessingError);

  async function processFile(file: File) {
    setFileName(file.name);
    setDocumentStatus("uploading");

    const extractionTimer = window.setTimeout(() => setDocumentStatus("extracting"), 500);
    const parsingTimer = window.setTimeout(() => setDocumentStatus("parsing"), 1700);

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
      window.setTimeout(() => setDocumentReady(data.manifest ?? demoManifest), 500);
    } catch (error) {
      window.clearTimeout(extractionTimer);
      window.clearTimeout(parsingTimer);
      setProcessingError(error instanceof Error ? error.message : "Document processing failed.");
    }
  }

  const isProcessing = ["uploading", "extracting", "parsing", "ready"].includes(documentStatus);

  return (
    <main className="min-h-screen bg-[#f7f8fb] px-5 py-8 text-slate-950">
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-4xl flex-col justify-center">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.06)] md:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Unfold
          </p>
          <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-[-0.04em] text-slate-950 md:text-5xl">
            Upload the manual. Learn in your language. Pass the exam.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
            Start by uploading the Alberta Basic Security Training manual. Unfold extracts
            the text, recognizes modules and activities, and prepares source-grounded exam
            coaching.
          </p>

          <div className="mt-8 rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 p-6">
            <input
              ref={inputRef}
              accept="application/pdf"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  void processFile(file);
                }
              }}
              type="file"
            />

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-slate-900 shadow-sm">
                  <FileUp className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-950">
                    {fileName ?? "Alberta Basic Security Training PDF"}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">PDF upload and AWS processing</p>
                </div>
              </div>

              <button
                className={isProcessing ? buttonSecondary : buttonPrimary}
                disabled={isProcessing}
                onClick={() => inputRef.current?.click()}
                type="button"
              >
                {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isProcessing ? "Processing" : "Upload PDF"}
              </button>
            </div>
          </div>

          {documentStatus !== "empty" && (
            <div className="mt-7 grid gap-3 md:grid-cols-4">
              {steps.map((step) => {
                const currentIndex = steps.findIndex((item) => item.id === documentStatus);
                const stepIndex = steps.findIndex((item) => item.id === step.id);
                const isActive = stepIndex <= currentIndex;

                return (
                  <div
                    key={step.id}
                    className={`rounded-2xl border px-4 py-3 text-sm font-medium ${
                      isActive
                        ? "border-slate-900 bg-slate-950 text-white"
                        : "border-slate-200 bg-white text-slate-500"
                    }`}
                  >
                    {step.label}
                  </div>
                );
              })}
            </div>
          )}

          {processingError && (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-950">
              {processingError}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
