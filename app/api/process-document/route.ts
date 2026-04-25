import { NextResponse } from "next/server";
import { parseDocumentWithBedrock } from "@/lib/aws/bedrock";
import { saveDocumentManifest } from "@/lib/aws/dynamodb";
import { uploadPdfToS3 } from "@/lib/aws/s3";
import { extractPdfTextWithTextract } from "@/lib/aws/textract";
import { demoManifest } from "@/lib/data/demoManifest";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "PDF file is required." }, { status: 400 });
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    const upload = await uploadPdfToS3({
      fileName: file.name,
      contentType: file.type || "application/pdf",
      body: bytes
    });

    const extraction = await extractPdfTextWithTextract({
      bucket: upload.bucket,
      key: upload.key
    });

    const manifest = await parseDocumentWithBedrock(extraction.text);
    const completedManifest = {
      ...manifest,
      fileName: file.name,
      source: extraction.status === "aws" ? ("aws" as const) : ("deterministic" as const),
      processedAt: new Date().toISOString()
    };

    await saveDocumentManifest(completedManifest);

    return NextResponse.json({
      mode: extraction.status,
      upload,
      manifest: completedManifest
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
