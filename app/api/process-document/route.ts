import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { uploadPdfToS3 } from "@/lib/aws/s3";
import { demoManifest } from "@/lib/data/demoManifest";
import type { DocumentManifest } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 30;

const DEFAULT_DETERMINISTIC_HASH =
  "3cc730708278558b93aa77ad0a161a66ef280ea44ea15cd2db7e199e23e9c12b";
const DEFAULT_DETERMINISTIC_ID = "alberta-basic-security-training";

function sha256(bytes: Buffer) {
  return createHash("sha256").update(bytes).digest("hex");
}

function recognizedManifest(fileName: string): DocumentManifest {
  return {
    ...demoManifest,
    documentId: process.env.DETERMINISTIC_DOCUMENT_ID ?? DEFAULT_DETERMINISTIC_ID,
    fileName,
    source: "deterministic",
    processedAt: new Date().toISOString()
  };
}

function uploadedPlaceholderManifest(fileName: string, documentHash: string): DocumentManifest {
  return {
    ...demoManifest,
    documentId: `s3-upload-${documentHash.slice(0, 12)}`,
    title: fileName.replace(/\.pdf$/i, "") || "Uploaded PDF",
    fileName,
    source: "aws",
    summary:
      "Uploaded to S3 successfully. The polished learning path is currently enabled for the recognized Alberta Basic Security Training manual.",
    processedAt: new Date().toISOString()
  };
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "PDF file is required." }, { status: 400 });
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    const documentHash = sha256(bytes);
    const upload = await uploadPdfToS3({
      fileName: file.name,
      contentType: file.type || "application/pdf",
      body: bytes,
      documentHash
    });

    const deterministicHash = process.env.DETERMINISTIC_DOCUMENT_HASH ?? DEFAULT_DETERMINISTIC_HASH;
    const isRecognizedDemoPdf = documentHash === deterministicHash;
    const manifest = isRecognizedDemoPdf
      ? recognizedManifest(file.name)
      : uploadedPlaceholderManifest(file.name, documentHash);

    return NextResponse.json({
      mode: isRecognizedDemoPdf ? "s3-recognized-deterministic" : upload.mode,
      documentHash,
      recognized: isRecognizedDemoPdf,
      upload,
      manifest
    });
  } catch (error) {
    return NextResponse.json({
      mode: "deterministic",
      warning: error instanceof Error ? error.message : "Document processing failed.",
      manifest: {
        ...demoManifest,
        processedAt: new Date().toISOString()
      }
    });
  }
}
