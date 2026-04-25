import { NextResponse } from "next/server";
import { simplifyAndTranslateWithBedrock } from "@/lib/aws/bedrock";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const translation = await simplifyAndTranslateWithBedrock({
    sectionId: body.sectionId ?? "report-writing-guidelines",
    targetLanguage: body.targetLanguage ?? "spanish"
  });

  return NextResponse.json({ mode: "deterministic-demo", translation });
}
