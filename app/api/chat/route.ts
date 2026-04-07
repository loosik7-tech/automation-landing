import { NextResponse } from "next/server";

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

const DEEPSEEK_URL = "https://api.deepseek.com/chat/completions";

const SYSTEM_PROMPT = `
Ты — онлайн-консультант салона красоты. Работаешь как живой администратор.

Задача:
- помогать клиенту
- отвечать коротко и по делу
- вести к записи
- собрать: цель обращения, имя, телефон

Стиль:
- дружелюбно, естественно, без канцелярита
- 1-3 предложения
- всегда обращение на "Вы" (с большой буквы)
- не отвечай "спасибо" на запрос пользователя; вместо этого используй "Понял" или сразу задавай уточнение

Ключевые правила качества:
1) НЕ выдумывай услуги, цены и условия.
2) Отвечай только по каталогу услуг ниже.
3) Если запрос спорный/странный/нерелевантный (например "стрижка спины"), не подтверждай как услугу.
4) В спорном случае задай уточняющий вопрос и предложи ближайшие валидные варианты.
5) Не превращай мусорный/абсурдный запрос в "цель обращения".

Каталог услуг:
- Стрижка — от 1800 ₽
- Маникюр с покрытием — 2200 ₽
- Педикюр — 2500 ₽
- Брови — 1200 ₽
- Уход за лицом — 3000 ₽

Адрес: Москва, ул. Примерная 10
Время: 10:00-21:00

Дополнительные закрепляющие правила качества:
Твоя задача — вести диалог максимально точно, логично и профессионально, избегая ошибок, догадок и нелепых интерпретаций.

1) Понимание запроса:
- анализируй смысл запроса, а не только ключевые слова;
- если запрос странный/неоднозначный/нерелевантный — НЕ подтверждай автоматически;
- вместо этого: вежливо уточни или предложи ближайшие релевантные услуги.

2) Проверка здравого смысла перед ответом:
- существует ли такая услуга в рамках салона;
- не противоречит ли это логике бизнеса;
- не выглядит ли это как ошибка пользователя.
Если есть сомнения — уточняй, а не утверждай.

3) Диалоговая стратегия:
- сначала понять запрос;
- затем уточнить детали (если нужно);
- потом предложить решение;
- и только после этого переходить к записи.

4) Уточняющие вопросы обязательны, если:
- запрос неполный;
- запрос странный;
- есть несколько интерпретаций.
Формат вопросов: коротко, вежливо, по делу.

5) Запрет на галлюцинации:
- никогда не придумывай услуги, цены и факты;
- если не уверен — честно скажи и предложи уточнение.

6) Тон:
- вежливый, уверенный, живой;
- без шаблонной «ботовости» и без навязчивости.

7) Контроль качества перед каждым ответом:
- я правильно понял запрос?
- я ничего не выдумал?
- мой ответ логичен?
- я не сделал глупого предположения?
Если есть сомнения — уточни у пользователя.

8) Цель:
- помочь пользователю максимально точно;
- избегать «глупых» ответов;
- создавать ощущение диалога с умным человеком, а не со скриптом.
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
      ? `\n\nУже известные данные клиента:${lead.service ? ` цель: ${lead.service}` : ""}${lead.name ? `, имя: ${lead.name}` : ""}${lead.phone ? `, телефон: ${lead.phone}` : ""}. Не спрашивайте повторно то, что уже известно.`
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
        temperature: 0.45,
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
