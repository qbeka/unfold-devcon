import { BedrockRuntimeClient } from "@aws-sdk/client-bedrock-runtime";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PollyClient } from "@aws-sdk/client-polly";
import { S3Client } from "@aws-sdk/client-s3";
import { TextractClient } from "@aws-sdk/client-textract";

export function getAwsRegion() {
  return process.env.AWS_REGION || process.env.NEXT_PUBLIC_AWS_REGION || "us-west-2";
}

export function hasAwsCredentials() {
  return Boolean(
    process.env.AWS_ACCESS_KEY_ID &&
      process.env.AWS_SECRET_ACCESS_KEY &&
      process.env.S3_BUCKET_NAME
  );
}

export function getS3Client() {
  return new S3Client({ region: getAwsRegion() });
}

export function getTextractClient() {
  return new TextractClient({ region: getAwsRegion() });
}

export function getBedrockClient() {
  return new BedrockRuntimeClient({ region: getAwsRegion() });
}

export function getDynamoClient() {
  return new DynamoDBClient({ region: getAwsRegion() });
}

export function getPollyClient() {
  return new PollyClient({ region: getAwsRegion() });
}
