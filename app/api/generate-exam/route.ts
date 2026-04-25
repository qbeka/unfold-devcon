import { NextResponse } from "next/server";
import { generateExamWithBedrock } from "@/lib/aws/bedrock";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const questionCount = Number(body.questionCount ?? 5);

  const questions = await generateExamWithBedrock({
    documentId: body.documentId ?? "alberta-basic-security-training",
    moduleId: body.moduleId ?? "module-five",
    examMode: body.examMode ?? "focused",
    language: body.language ?? "en",
    questionCount
  });

  return NextResponse.json({ mode: "deterministic-demo", questions });
}
