import { NextResponse } from "next/server";
import { getProgress } from "@/lib/aws/dynamodb";

export async function GET() {
  const progress = await getProgress();

  return NextResponse.json({ mode: "deterministic-demo", progress });
}

export async function POST() {
  const progress = await getProgress();

  return NextResponse.json({ mode: "deterministic-demo", progress });
}
