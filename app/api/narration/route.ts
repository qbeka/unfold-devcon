import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 30;

const DEFAULT_MODEL_ID = "eleven_multilingual_v2";
const MAX_NARRATION_CHARS = 1200;

export async function POST(request: Request) {
  try {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    const voiceId = process.env.ELEVENLABS_VOICE_ID;
    const modelId = process.env.ELEVENLABS_MODEL_ID ?? DEFAULT_MODEL_ID;

    if (!apiKey || !voiceId) {
      return NextResponse.json(
        { error: "ElevenLabs is not configured." },
        { status: 503 }
      );
    }

    const body = (await request.json()) as { text?: unknown };
    const text = typeof body.text === "string" ? body.text.trim() : "";

    if (!text) {
      return NextResponse.json({ error: "Narration text is required." }, { status: 400 });
    }

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "audio/mpeg",
          "xi-api-key": apiKey
        },
        body: JSON.stringify({
          text: text.slice(0, MAX_NARRATION_CHARS),
          model_id: modelId,
          voice_settings: {
            stability: 0.55,
            similarity_boost: 0.82,
            style: 0.18,
            use_speaker_boost: true
          }
        })
      }
    );

    if (!response.ok) {
      const message = await response.text();
      console.error("[narration] ElevenLabs error", {
        status: response.status,
        voiceId,
        modelId,
        body: message
      });
      return NextResponse.json(
        { error: message || "ElevenLabs narration failed." },
        { status: response.status }
      );
    }

    const audio = await response.arrayBuffer();
    return new Response(audio, {
      headers: {
        "Cache-Control": "no-store",
        "Content-Type": response.headers.get("content-type") ?? "audio/mpeg"
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Narration failed." },
      { status: 500 }
    );
  }
}
