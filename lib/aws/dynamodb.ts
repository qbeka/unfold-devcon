import { DynamoDBDocumentClient, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { getDynamoClient, hasAwsCredentials } from "@/lib/aws/config";
import { defaultProgress } from "@/lib/data/demoProgress";
import type { AnswerAttempt, DocumentManifest, ProgressState } from "@/lib/types";

const tableName = process.env.DYNAMODB_TABLE_NAME;

export async function saveDocumentManifest(document: DocumentManifest) {
  if (!tableName || !hasAwsCredentials()) {
    return { status: "deterministic", documentId: document.documentId };
  }

  const documentId = document.documentId;

  await docClient().send(
    new PutCommand({
      TableName: tableName,
      Item: {
        pk: `DOCUMENT#${documentId}`,
        sk: "MANIFEST",
        entityType: "DocumentManifest",
        document,
        updatedAt: new Date().toISOString()
      }
    })
  );

  return { status: "aws", documentId };
}

export async function saveExamAttempt(attempt: AnswerAttempt) {
  if (!tableName || !hasAwsCredentials()) {
    return { status: "deterministic", attempt };
  }

  await docClient().send(
    new PutCommand({
      TableName: tableName,
      Item: {
        pk: "STUDENT#demo-student",
        sk: `ATTEMPT#${Date.now()}#${attempt.questionId}`,
        entityType: "AnswerAttempt",
        ...attempt,
        createdAt: new Date().toISOString()
      }
    })
  );

  return { status: "aws", attempt };
}

export async function getProgress(_studentId = "demo-student"): Promise<ProgressState> {
  if (!tableName || !hasAwsCredentials()) {
    return defaultProgress;
  }

  const result = await docClient().send(
    new GetCommand({
      TableName: tableName,
      Key: {
        pk: `STUDENT#${_studentId}`,
        sk: "PROGRESS"
      }
    })
  );

  if (result.Item?.progress) {
    return result.Item.progress as ProgressState;
  }

  return defaultProgress;
}

export async function saveProgress(studentId: string, progress: ProgressState) {
  if (!tableName || !hasAwsCredentials()) {
    return { status: "deterministic", progress };
  }

  await docClient().send(
    new PutCommand({
      TableName: tableName,
      Item: {
        pk: `STUDENT#${studentId}`,
        sk: "PROGRESS",
        entityType: "ProgressState",
        progress,
        updatedAt: new Date().toISOString()
      }
    })
  );

  return { status: "aws", progress };
}

function docClient() {
  return DynamoDBDocumentClient.from(getDynamoClient());
}
