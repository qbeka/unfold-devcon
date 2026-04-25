import { NextResponse } from "next/server";
import { generateFeedbackWithBedrock } from "@/lib/aws/bedrock";
import { saveExamAttempt } from "@/lib/aws/dynamodb";
import { demoQuestions } from "@/lib/data/demoQuestions";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const question = demoQuestions.find((item) => item.id === body.questionId);

  if (!question || typeof body.selectedAnswer !== "string") {
    return NextResponse.json({ error: "Invalid questionId or selectedAnswer." }, { status: 400 });
  }

  const correct = body.selectedAnswer === question.correctAnswer;
  const feedback = await generateFeedbackWithBedrock({
    question,
    selectedAnswer: body.selectedAnswer
  });

  await saveExamAttempt({
    questionId: question.id,
    selectedAnswer: body.selectedAnswer,
    correct,
    weakConcept: correct ? undefined : question.testedConcept
  });

  return NextResponse.json({
    mode: "deterministic-demo",
    correct,
    correctAnswer: question.correctAnswer,
    sceneCandidate: question.sceneCandidate,
    ...feedback
  });
}
