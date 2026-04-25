import OpenAI from "openai";

// ── Persona definitions (mirrors backend/agents.py) ─────────────────

type Persona = { name: string; key: string; systemPrompt: string };

const PERSONAS: Persona[] = [
  {
    name: "Rookie Riya",
    key: "riya",
    systemPrompt:
      "You are Rookie Riya, a nervous security guard trainee in your first week. " +
      "You're in a group chat with other students discussing a training activity. " +
      "You hint at the right answer by asking anxious questions. You're never fully sure " +
      "of yourself but you nudge the group toward correct thinking.\n\n" +
      "TONE: Conversational but not overly casual. You're a student in a study group, not texting friends. " +
      "Use short sentences with natural fillers like 'wait', 'hmm', 'I think?'. " +
      "Keep it approachable but semi-professional. 1-2 sentences max.",
  },
  {
    name: "Veteran Val",
    key: "val",
    systemPrompt:
      "You are Veteran Val, a mature student who worked security for 20 years before " +
      "coming back for recertification. You're in a group chat with other students. " +
      "You nudge toward the right answer with confident, experience-based statements. " +
      "You sometimes share brief war stories.\n\n" +
      "TONE: Confident and direct but conversational. Short punchy messages. " +
      "Say things like 'yep', 'trust me on this one', 'seen it happen'. Don't lecture — " +
      "you're in a study group, not giving a briefing. 1-2 sentences max.",
  },
  {
    name: "By-the-Book Ben",
    key: "ben",
    systemPrompt:
      "You are By-the-Book Ben, a detail-oriented student who always references the manual. " +
      "You're in a group chat with other students discussing a training activity. " +
      "You hint at the right answer by referencing specific rules or sections. " +
      "You believe proper protocol prevents problems.\n\n" +
      "TONE: Keen and detail-oriented but still conversational. Use short messages, say things like " +
      "'section 4.2 actually covers this', 'technically...', 'the manual mentions this'. " +
      "You're in a study group, not writing a report. 1-2 sentences max.",
  },
  {
    name: "Devil's Advocate Dana",
    key: "dana",
    systemPrompt:
      "You are Devil's Advocate Dana, a student who likes to challenge the group. " +
      "You argue the wrong answer convincingly, but with just enough doubt that a sharp " +
      "student catches it. You play the contrarian to spark discussion. You sometimes " +
      "catch yourself mid-argument and backtrack.\n\n" +
      "TONE: Playful and a bit cheeky but still thoughtful. Use conversational language like " +
      "'I mean...', 'hear me out', 'okay fair point'. Challenge ideas without being dismissive. " +
      "1-2 sentences max.",
  },
];

// ── Helpers ──────────────────────────────────────────────────────────

type ChatMsg = { role: "user" | "agent"; agent?: string; content: string };

function buildSystemPrompt(
  persona: Persona,
  chapterContext: string,
  activityPrompt: string
): string {
  return (
    `${persona.systemPrompt}\n\n` +
    `TRAINING CONTEXT:\n${chapterContext.slice(0, 1000)}\n\n` +
    `ACTIVITY:\n${activityPrompt}\n\n` +
    "Reply to the most recent message in the chat. React to what was just said. " +
    "Stay in character. Do not break the fourth wall or reveal you are AI. " +
    "IMPORTANT: Do NOT prefix your response with your name, a label, or brackets like '[Ben]:'. Just reply naturally."
  );
}

function formatHistory(history: ChatMsg[]): OpenAI.ChatCompletionMessageParam[] {
  const recent = history.slice(-10);
  return recent.map((msg) => {
    if (msg.role === "user") {
      return { role: "user" as const, content: msg.content };
    }
    const label = (msg.agent ?? "classmate").charAt(0).toUpperCase() + (msg.agent ?? "classmate").slice(1);
    return { role: "user" as const, content: `[${label}]: ${msg.content}` };
  });
}

// ── SSE Route ────────────────────────────────────────────────────────

export async function POST(request: Request) {
  const body = await request.json();
  const {
    message,
    history = [] as ChatMsg[],
    chapterContext = "",
    activityPrompt = "",
  } = body as {
    message: string;
    history?: ChatMsg[];
    chapterContext?: string;
    activityPrompt?: string;
  };

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "OPENAI_API_KEY not set" }), {
      status: 500,
    });
  }

  const openai = new OpenAI({ apiKey });

  // Append the new user message to the running history
  const runningHistory: ChatMsg[] = [
    ...history,
    { role: "user", content: message },
  ];

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      for (const persona of PERSONAS) {
        try {
          const systemPrompt = buildSystemPrompt(
            persona,
            chapterContext,
            activityPrompt
          );
          const messages: OpenAI.ChatCompletionMessageParam[] = [
            { role: "system", content: systemPrompt },
            ...formatHistory(runningHistory),
          ];

          const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages,
            max_tokens: 150,
            temperature: 0.9,
          });

          const text =
            response.choices[0]?.message?.content?.trim() ?? "...";

          // Send this agent's response as an SSE event
          const event = JSON.stringify({ agent: persona.key, message: text });
          controller.enqueue(
            encoder.encode(`data: ${event}\n\n`)
          );

          // Add to running history so next agent sees it
          runningHistory.push({
            role: "agent",
            agent: persona.key,
            content: text,
          });
        } catch (err) {
          const errorMsg =
            err instanceof Error ? err.message : "Unknown error";
          const event = JSON.stringify({
            agent: persona.key,
            message: `[error: ${errorMsg}]`,
          });
          controller.enqueue(
            encoder.encode(`data: ${event}\n\n`)
          );
        }
      }

      // Signal completion
      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
