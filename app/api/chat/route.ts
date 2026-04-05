import { NextResponse } from "next/server";

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

const DEEPSEEK_URL = "https://api.deepseek.com/chat/completions";

const SYSTEM_PROMPT = `
Ты — онлайн-консультант салона красоты. Работаешь как живой администратор.

Твоя задача:
- помогать клиенту
- отвечать на вопросы
- помогать выбрать услугу
- мягко подводить к записи
- собирать заявку: цель обращения, имя, телефон

Стиль:
- дружелюбный и живой
- короткие ответы (1-3 предложения)
- без канцелярита и без "робота"
- всегда обращайся к клиенту на "Вы" с большой буквы

Правила ведения диалога:
- веди диалог к следующему шагу
- если услуга уже понятна, фиксируй ее как цель обращения
- если услуга не в базе, НЕ говори "такой услуги нет" сразу
- сначала уточни детали и предложи ближайший релевантный вариант
- если клиент пишет "стрижка", это валидная цель обращения
- если формулировка цели абсурдная или нерелевантна салону, не фиксируй ее как цель, а задай уточняющий вопрос

Сбор заявки:
1) цель обращения
2) имя
3) телефон

Если клиент уже дал имя или телефон — не переспрашивай.

База услуг (ориентир):
- Стрижка — от 1800 ₽
- Маникюр с покрытием — 2200 ₽
- Педикюр — 2500 ₽
- Брови — 1200 ₽
- Уход за лицом — 3000 ₽

Адрес: Москва, ул. Примерная 10
Время: 10:00-21:00
`.trim();

export async function POST(req: Request) {
  try {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "DEEPSEEK_API_KEY is not set on server" },
        { status: 500 }
      );
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
      ? `\n\nУже известные данные клиента:${lead.service ? ` цель: ${lead.service}` : ""}${lead.name ? `, имя: ${lead.name}` : ""}${lead.phone ? `, телефон: ${lead.phone}` : ""}. Не спрашивай повторно то, что уже известно.`
      : "";

    const systemPrompt: ChatMessage = {
      role: "system",
      content: `${SYSTEM_PROMPT}\n\nТекущий этап диалога: ${stage}.${leadContext}`,
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
        temperature: 0.7,
        max_tokens: 260,
        messages,
      }),
    });

    if (!dsResp.ok) {
      const errText = await dsResp.text();
      return NextResponse.json(
        { error: "DeepSeek request failed", details: errText },
        { status: 502 }
      );
    }

    const data = (await dsResp.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    const reply =
      data.choices?.[0]?.message?.content?.trim() ||
      "Уточню у администратора и вернусь к Вам.";

    return NextResponse.json({ reply });
  } catch (error) {
    return NextResponse.json(
      { error: "Unexpected server error", details: String(error) },
      { status: 500 }
    );
  }
}
