import { NextResponse } from "next/server";
import { generateCorrectionSceneWithBedrock } from "@/lib/aws/bedrock";
import { demoCorrectionScene } from "@/lib/data/demoScene";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const scene = await generateCorrectionSceneWithBedrock({
    wrongAnswer: body.wrongAnswer ?? demoCorrectionScene.wrongChoice.text,
    correctAnswer: body.correctAnswer ?? demoCorrectionScene.correctChoice.text,
    sourceReference: body.sourceReference ?? demoCorrectionScene.sourceReference,
    testedConcept: body.testedConcept ?? "Objective report writing"
  });

  return NextResponse.json({ mode: "deterministic-demo", scene });
}
