import { InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { demoQuestions } from "@/lib/data/demoQuestions";
import { demoCorrectionScene } from "@/lib/data/demoScene";
import { demoSection } from "@/lib/data/demoDocument";
import { demoManifest } from "@/lib/data/demoManifest";
import { getBedrockClient, hasAwsCredentials } from "@/lib/aws/config";
import type { CorrectionSceneData, DocumentManifest, ExamMode, ExamQuestion } from "@/lib/types";

export async function parseDocumentWithBedrock(text: string): Promise<DocumentManifest> {
  if (!canUseBedrock() || text.length < 200) {
    return demoManifest;
  }

  const response = await invokeClaudeJson<DocumentManifest>(
    `You are parsing the Alberta Basic Security Training Participant Manual.
Return only strict JSON matching this TypeScript shape:
{
  "documentId": string,
  "title": string,
  "fileName": string,
  "source": "aws",
  "summary": string,
  "processedAt": string,
  "modules": [{
    "id": string,
    "title": string,
    "description": string,
    "sourceRange": string,
    "activities": string[],
    "concepts": string[]
  }]
}
Identify the manual modules and learning activities. Keep module IDs lowercase kebab-case.
Manual text:
${text.slice(0, 90000)}`
  );

  return {
    ...response,
    documentId: response.documentId || "alberta-basic-security-training",
    fileName: response.fileName || "uploaded-manual.pdf",
    source: "aws",
    processedAt: new Date().toISOString()
  };
}

export async function generateExamWithBedrock(_input: {
  documentId: string;
  moduleId: string;
  examMode: ExamMode;
  language: string;
  questionCount: number;
}): Promise<ExamQuestion[]> {
  if (canUseBedrock() && process.env.NEXT_PUBLIC_DEMO_MODE !== "true") {
    return invokeClaudeJson<ExamQuestion[]>(
      `Generate ${_input.questionCount} source-grounded exam questions for Alberta Basic Security Training ${_input.moduleId}.
Return only JSON array. Use the ExamQuestion shape with options, correctAnswer, explanation, sourceReference, testedConcept, commonMistake, and sceneCandidate.
Keep content focused on certification exam preparation.`
    );
  }

  return demoQuestions.slice(0, _input.questionCount);
}

export async function generateFeedbackWithBedrock(_input: {
  question: ExamQuestion;
  selectedAnswer: string;
}) {
  if (canUseBedrock() && process.env.NEXT_PUBLIC_DEMO_MODE !== "true") {
    return invokeClaudeJson<{
      explanation: string;
      sourceReference: string;
      testedConcept: string;
      commonMistake: string;
    }>(
      `Explain this exam answer for a certification student.
Question: ${_input.question.question}
Selected answer: ${_input.selectedAnswer}
Correct answer: ${_input.question.correctAnswer}
Source: ${_input.question.sourceReference}
Return only JSON with explanation, sourceReference, testedConcept, commonMistake.`
    );
  }

  return {
    explanation: _input.question.explanation,
    sourceReference: _input.question.sourceReference,
    testedConcept: _input.question.testedConcept,
    commonMistake: _input.question.commonMistake
  };
}

export async function generateCorrectionSceneWithBedrock(_input: {
  wrongAnswer: string;
  correctAnswer: string;
  sourceReference: string;
  testedConcept: string;
}): Promise<CorrectionSceneData> {
  if (canUseBedrock() && process.env.NEXT_PUBLIC_DEMO_MODE !== "true") {
    return invokeClaudeJson<CorrectionSceneData>(
      `Generate correction scene JSON for this wrong exam answer.
Template must be report_comparison.
Wrong answer: ${_input.wrongAnswer}
Correct answer: ${_input.correctAnswer}
Source: ${_input.sourceReference}
Concept: ${_input.testedConcept}
Return only JSON matching CorrectionSceneData.`
    );
  }

  return demoCorrectionScene;
}

export async function simplifyAndTranslateWithBedrock(_input: {
  sectionId: string;
  targetLanguage: string;
}) {
  if (canUseBedrock() && process.env.NEXT_PUBLIC_DEMO_MODE !== "true") {
    return invokeClaudeJson<{
      originalText: string;
      simplifiedText: string;
      translatedText: string;
    }>(
      `Simplify and translate this source section for a certification student.
Target language: ${_input.targetLanguage}
Original source: ${demoSection.originalText}
Return only JSON with originalText, simplifiedText, translatedText.`
    );
  }

  return {
    originalText: demoSection.originalText,
    simplifiedText: demoSection.simplifiedText,
    translatedText: demoSection.translatedText
  };
}

function canUseBedrock() {
  return hasAwsCredentials() && Boolean(process.env.BEDROCK_MODEL_ID);
}

async function invokeClaudeJson<T>(prompt: string): Promise<T> {
  const modelId = process.env.BEDROCK_MODEL_ID;

  if (!modelId) {
    throw new Error("BEDROCK_MODEL_ID is required.");
  }

  const command = new InvokeModelCommand({
    modelId,
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify({
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: 4096,
      temperature: 0.1,
      messages: [
        {
          role: "user",
          content: [{ type: "text", text: prompt }]
        }
      ]
    })
  });

  const response = await getBedrockClient().send(command);
  const decoded = new TextDecoder().decode(response.body);
  const parsed = JSON.parse(decoded) as { content?: { text?: string }[] };
  const text = parsed.content?.[0]?.text ?? decoded;
  const json = extractJson(text);

  return JSON.parse(json) as T;
}

function extractJson(value: string) {
  const trimmed = value.trim();

  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    return trimmed;
  }

  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced?.[1]) {
    return fenced[1].trim();
  }

  const objectStart = trimmed.indexOf("{");
  const arrayStart = trimmed.indexOf("[");
  const start =
    objectStart === -1 ? arrayStart : arrayStart === -1 ? objectStart : Math.min(objectStart, arrayStart);
  const end = Math.max(trimmed.lastIndexOf("}"), trimmed.lastIndexOf("]"));

  if (start === -1 || end === -1) {
    throw new Error("Bedrock response did not contain JSON.");
  }

  return trimmed.slice(start, end + 1);
}
