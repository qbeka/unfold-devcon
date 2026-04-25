import {
  GetDocumentTextDetectionCommand,
  StartDocumentTextDetectionCommand
} from "@aws-sdk/client-textract";
import { getTextractClient, hasAwsCredentials } from "@/lib/aws/config";

const pollIntervalMs = Number(process.env.TEXTRACT_POLL_INTERVAL_MS ?? 2500);
const maxPollAttempts = Number(process.env.TEXTRACT_MAX_POLL_ATTEMPTS ?? 24);

export async function extractPdfTextWithTextract(input: { bucket: string; key: string }) {
  if (!hasAwsCredentials()) {
    return {
      status: "deterministic" as const,
      text: "Deterministic fallback text is active because AWS credentials are not configured."
    };
  }

  const client = getTextractClient();
  const start = await client.send(
    new StartDocumentTextDetectionCommand({
      DocumentLocation: {
        S3Object: {
          Bucket: input.bucket,
          Name: input.key
        }
      }
    })
  );

  if (!start.JobId) {
    throw new Error("Textract did not return a JobId.");
  }

  let nextToken: string | undefined;
  const lines: string[] = [];

  for (let attempt = 0; attempt < maxPollAttempts; attempt += 1) {
    await wait(pollIntervalMs);

    const page = await client.send(
      new GetDocumentTextDetectionCommand({
        JobId: start.JobId,
        NextToken: nextToken
      })
    );

    if (page.JobStatus === "FAILED" || page.JobStatus === "PARTIAL_SUCCESS") {
      throw new Error(`Textract job ended with status ${page.JobStatus}.`);
    }

    if (page.JobStatus !== "SUCCEEDED") {
      continue;
    }

    for (const block of page.Blocks ?? []) {
      if (block.BlockType === "LINE" && block.Text) {
        lines.push(block.Text);
      }
    }

    nextToken = page.NextToken;
    if (!nextToken) {
      return {
        status: "aws" as const,
        text: lines.join("\n")
      };
    }
  }

  throw new Error("Textract processing timed out before completion.");
}

function wait(ms: number) {
  return new Promise((resolve) => windowlessSetTimeout(resolve, ms));
}

const windowlessSetTimeout: typeof setTimeout = setTimeout;
