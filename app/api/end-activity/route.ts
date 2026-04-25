import OpenAI from "openai";
import type { ChatMessage } from "@/lib/types";
import { moduleFiveContent } from "@/lib/data/moduleFiveContent";

// Build a section reference map so the model knows what sections exist
const SECTION_REF = moduleFiveContent.sections
  .map((s) => `- id: "${s.id}", title: "${s.heading}" (page ${s.page})`)
  .join("\n");

export async function POST(request: Request) {
  const body = await request.json();
  const {
    messages = [] as ChatMessage[],
    activityPrompt = "",
  } = body as {
    messages?: ChatMessage[];
    activityPrompt?: string;
  };

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "OPENAI_API_KEY not set" }), {
      status: 500,
    });
  }

  if (messages.length === 0) {
    return Response.json({
      summary: { covered: [], missed: [] },
    });
  }

  const openai = new OpenAI({ apiKey });

  const transcript = messages
    .map((m) => {
      if (m.role === "user") return `User: ${m.content}`;
      const label = (m.agent ?? "classmate").charAt(0).toUpperCase() + (m.agent ?? "classmate").slice(1);
      return `${label}: ${m.content}`;
    })
    .join("\n");

  const prompt =
    `You are reviewing a student group discussion from a security training course (Module Five: Documentation and Evidence).\n\n` +
    `ACTIVITY PROMPT:\n${activityPrompt}\n\n` +
    `CHAT TRANSCRIPT:\n${transcript}\n\n` +
    `AVAILABLE MODULE SECTIONS:\n${SECTION_REF}\n\n` +
    `Analyze what the group discussed and return a JSON object with this structure:\n` +
    `{\n` +
    `  "covered": [\n` +
    `    { "topic": "short topic name", "highlights": ["what the group said well about this topic"] }\n` +
    `  ],\n` +
    `  "missed": [\n` +
    `    { "topic": "short topic name", "detail": "what they should have discussed", "sectionId": "id from the list above", "sectionTitle": "title from the list above" }\n` +
    `  ]\n` +
    `}\n\n` +
    `Rules:\n` +
    `- "covered" = topics the group discussed well, with specific highlights from their conversation\n` +
    `- "missed" = important topics from the module they didn't touch on or got wrong, with a reference to the relevant section\n` +
    `- Use natural readable topic names (e.g. "Objective facts vs personal opinion", not "objective_facts")\n` +
    `- sectionId must be one of the ids from AVAILABLE MODULE SECTIONS\n` +
    `- Keep it concise: max 5 covered, max 5 missed\n\n` +
    `Return ONLY valid JSON, no markdown fences or explanation.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You return only valid JSON. No markdown fences or explanation." },
      { role: "user", content: prompt },
    ],
    max_tokens: 1024,
    temperature: 0.3,
  });

  let text = response.choices[0]?.message?.content?.trim() ?? "{}";

  if (text.startsWith("```")) {
    text = text.split("\n", 1)[1]?.split("```")[0]?.trim() ?? "{}";
  }

  try {
    const summary = JSON.parse(text);
    return Response.json({ summary });
  } catch {
    return Response.json({ summary: { covered: [], missed: [] } });
  }
}
