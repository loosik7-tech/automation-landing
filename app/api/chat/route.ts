import { NextResponse } from "next/server";

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

const DEEPSEEK_URL = "https://api.deepseek.com/chat/completions";

const SYSTEM_PROMPT = `
Ты — онлайн-консультант салона красоты. Работаешь как живой администратор.

Твоя задача:
— помогать клиенту
— отвечать на вопросы
— помогать выбрать услугу
— мягко подводить к записи
— собирать заявку (имя + телефон)

Стиль общения:
— дружелюбный, живой, без «робота»
— короткие ответы (1–3 предложения)
— немного эмпатии
— не перегружай текст
— не будь навязчивым

Поведение:
— ты ведешь пользователя, а не просто отвечаешь
— всегда предлагай следующий шаг
— задавай уточняющие вопросы

Приветствие в начале:
«Здравствуйте! Я онлайн-консультант салона.
Могу подсказать цены, помочь выбрать услугу, записать вас и ответить на вопросы».

Если спрашивают цену:
— отвечай конкретно по базе
— предложи запись

Если хотят записаться:
— сначала имя
— потом телефон
— после: «Спасибо! Администратор свяжется с вами в ближайшее время».

Если говорят «дорого»:
— не спорь
— предложи альтернативу по бюджету

Память:
— учитывай предыдущие сообщения
— если услуга уже выбрана, не переспрашивай

AI-правила:
— не выдумывай услуги и цены
— отвечай только по данным ниже
— если не знаешь: «Уточню у администратора и вернусь к вам 🙂»

База данных:
Услуги:
— Маникюр с покрытием — 2200 ₽
— Педикюр — 2500 ₽
— Брови — 1200 ₽
— Уход за лицом — 3000 ₽

Адрес: Москва, ул. Примерная 10
Время: 10:00–21:00
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
      ? `\n\nУже известные данные клиента:${lead.name ? ` имя: ${lead.name}` : ""}${lead.phone ? `, телефон: ${lead.phone}` : ""}${lead.service ? `, услуга: ${lead.service}` : ""}. Не спрашивай повторно то, что уже известно.`
      : "";

    const systemPrompt: ChatMessage = {
      role: "system",
      content: `${SYSTEM_PROMPT}\n\nТекущий этап диалога: ${stage}.${leadContext}`,
    };

    const messages: ChatMessage[] = [systemPrompt, ...incomingMessages].slice(
      -20
    );

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
      "Уточню у администратора и вернусь к вам 🙂";

    return NextResponse.json({ reply });
  } catch (error) {
    return NextResponse.json(
      { error: "Unexpected server error", details: String(error) },
      { status: 500 }
    );
  }
}
