import { NextResponse } from "next/server";

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type LeadUpdate = {
  service?: string;
  name?: string;
  phone?: string;
};

type AssistantEnvelope = {
  reply: string;
  lead_update?: LeadUpdate;
  needs_clarification?: boolean;
  confidence?: number;
};

const DEEPSEEK_URL = "https://api.deepseek.com/chat/completions";

const SYSTEM_PROMPT = `You are a beauty salon assistant.

Return ONLY valid JSON with this shape:
{
  "reply": "string (Russian, natural, concise)",
  "lead_update": { "service"?: "string", "name"?: "string", "phone"?: "string" },
  "needs_clarification": boolean,
  "confidence": number
}

Rules:
- Be natural, not robotic.
- Do not start every message with "Понял".
- If request is absurd/ambiguous (e.g. "стрижка пятки"), do NOT set service. Ask clarification instead.
- Do not invent services, prices or facts.
- If user did not provide a field, do not fabricate it.
- confidence is 0..1.
- JSON only, no markdown, no extra text.`;

function pickFirstJsonObject(text: string): string | null {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;
  return text.slice(start, end + 1);
}

function sanitizeEnvelope(raw: unknown): AssistantEnvelope {
  const base: AssistantEnvelope = {
    reply: "Уточню запрос и помогу подобрать подходящую услугу.",
    lead_update: {},
    needs_clarification: true,
    confidence: 0.3,
  };

  if (!raw || typeof raw !== "object") return base;
  const obj = raw as Record<string, unknown>;

  const reply = typeof obj.reply === "string" ? obj.reply.trim() : "";
  const needsClarification = typeof obj.needs_clarification === "boolean" ? obj.needs_clarification : true;
  const confidence = typeof obj.confidence === "number" ? Math.max(0, Math.min(1, obj.confidence)) : 0.3;

  const leadUpdate: LeadUpdate = {};
  if (obj.lead_update && typeof obj.lead_update === "object") {
    const lu = obj.lead_update as Record<string, unknown>;
    if (typeof lu.service === "string" && lu.service.trim()) leadUpdate.service = lu.service.trim();
    if (typeof lu.name === "string" && lu.name.trim()) leadUpdate.name = lu.name.trim();
    if (typeof lu.phone === "string" && lu.phone.trim()) leadUpdate.phone = lu.phone.trim();
  }

  return {
    reply: reply || base.reply,
    lead_update: leadUpdate,
    needs_clarification: needsClarification,
    confidence,
  };
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "DEEPSEEK_API_KEY is not set on server" }, { status: 500 });
    }

    const body = (await req.json()) as {
      messages?: ChatMessage[];
      stage?: string;
      lead?: Record<string, string>;
    };

    const incomingMessages = Array.isArray(body.messages) ? body.messages : [];
    const stage = body.stage ?? "unknown";
    const lead = body.lead ?? {};

    const leadContext = Object.keys(lead).length
      ? `Known lead data: ${lead.service ? `service=${lead.service}; ` : ""}${lead.name ? `name=${lead.name}; ` : ""}${lead.phone ? `phone=${lead.phone}; ` : ""}`
      : "Known lead data: none.";

    const systemPrompt: ChatMessage = {
      role: "system",
      content: `${SYSTEM_PROMPT}\n\nCurrent stage: ${stage}.\n${leadContext}`,
    };

    const messages: ChatMessage[] = [systemPrompt, ...incomingMessages].slice(-20);

    const dsResp = await fetch(DEEPSEEK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        temperature: 0.35,
        max_tokens: 300,
        messages,
      }),
    });

    if (!dsResp.ok) {
      const errText = await dsResp.text();
      return NextResponse.json({ error: "DeepSeek request failed", details: errText }, { status: 502 });
    }

    const data = (await dsResp.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    const content = data.choices?.[0]?.message?.content?.trim() || "";
    const jsonCandidate = pickFirstJsonObject(content);

    let envelope = sanitizeEnvelope(undefined);
    if (jsonCandidate) {
      try {
        envelope = sanitizeEnvelope(JSON.parse(jsonCandidate));
      } catch {
        envelope = sanitizeEnvelope(undefined);
      }
    }

    return NextResponse.json(envelope);
  } catch (error) {
    return NextResponse.json({ error: "Unexpected server error", details: String(error) }, { status: 500 });
  }
}
