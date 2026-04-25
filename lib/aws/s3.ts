import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getS3Client, hasAwsCredentials } from "@/lib/aws/config";

export async function uploadPdfToS3(input: {
  fileName: string;
  contentType: string;
  body: Buffer;
}) {
  const bucket = process.env.S3_BUCKET_NAME;
  const key = `uploads/${Date.now()}-${input.fileName.replace(/[^a-zA-Z0-9._-]/g, "-")}`;

  if (!bucket || !hasAwsCredentials()) {
    return {
      bucket: bucket ?? "demo-unfold-bucket",
      key,
      mode: "deterministic" as const
    };
  }

  await getS3Client().send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: input.body,
      ContentType: input.contentType
    })
  );

  return {
    bucket,
    key,
    mode: "aws" as const
  };
}

export async function getAssetUrlFromS3(key: string) {
  const bucket = process.env.S3_BUCKET_NAME;

  if (!bucket || !hasAwsCredentials()) {
    return process.env.NEXT_PUBLIC_DEMO_VIDEO_PATH ?? "/videos/demo-report-writing.mp4";
  }

  return getSignedUrl(
    getS3Client(),
    new GetObjectCommand({
      Bucket: bucket,
      Key: key
    }),
    { expiresIn: 3600 }
  );
}

export async function uploadGeneratedAssetToS3(input: {
  key: string;
  body: Buffer;
  contentType: string;
}) {
  const bucket = process.env.S3_BUCKET_NAME;

  if (!bucket || !hasAwsCredentials()) {
    return {
      url: process.env.NEXT_PUBLIC_DEMO_VIDEO_PATH ?? "/videos/demo-report-writing.mp4",
      mode: "deterministic" as const
    };
  }

  await getS3Client().send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: input.key,
      Body: input.body,
      ContentType: input.contentType
    })
  );

  return process.env.NEXT_PUBLIC_DEMO_VIDEO_PATH ?? "/videos/demo-report-writing.mp4";
}
