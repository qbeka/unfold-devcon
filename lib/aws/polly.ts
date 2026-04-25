import { OutputFormat, SynthesizeSpeechCommand, VoiceId } from "@aws-sdk/client-polly";
import { getPollyClient, hasAwsCredentials } from "@/lib/aws/config";

export async function generateNarrationWithPolly(input: { script: string; voiceId?: string }) {
  if (!hasAwsCredentials()) {
    return {
      status: "deterministic",
      voiceId: input.voiceId ?? process.env.POLLY_VOICE_ID ?? "Joanna",
      audio: undefined
    };
  }

  const response = await getPollyClient().send(
    new SynthesizeSpeechCommand({
      Text: input.script,
      VoiceId: (input.voiceId ?? process.env.POLLY_VOICE_ID ?? "Joanna") as VoiceId,
      OutputFormat: OutputFormat.MP3
    })
  );

  const bytes = response.AudioStream
    ? Buffer.from(await response.AudioStream.transformToByteArray())
    : undefined;

  return {
    status: "aws",
    voiceId: input.voiceId ?? process.env.POLLY_VOICE_ID ?? "Joanna",
    audio: bytes
  };
}
