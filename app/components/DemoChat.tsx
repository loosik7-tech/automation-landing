"use client";

import { useEffect, useRef, useState } from "react";
import { useScrollReveal } from "../hooks/useScrollReveal";

type Message = { id: number; type: "bot" | "user"; text: string };

const QUICK_OPTIONS = [
  "Консультация",
  "Запись на прием",
  "Услуги",
  "Вопрос",
  "Другое",
];

const ABSURD_REQUEST_RE =
  /(яиц|яйц|пенис|член|интим|пах|жоп|задниц|секс|эрот|анус|генитал|пизд|хуй|дичь)/i;

const FALLBACK_GREETING =
  "Здравствуйте! Я онлайн-консультант салона. Подскажу по услугам, ценам и записи.";
const ASK_AI_FALLBACK =
  "Понял вас. Уточните, пожалуйста, запрос, и я помогу с выбором или записью.";

const SERVICE_NEEDS_CALLBACK = "Нужен звонок для уточнения услуги";

async function askDeepSeek(
  messages: Array<{ role: "user" | "assistant"; content: string }>,
  stage: string,
  lead?: Record<string, string>
) {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, stage, lead }),
  });

  if (!response.ok) throw new Error("API_ERROR");
  const data = (await response.json()) as { reply?: string };
  return data.reply?.trim() || ASK_AI_FALLBACK;
}

function buildFallbackReply(params: {
  userText: string;
  lead: Record<string, string>;
  detectedService?: string;
  bookingIntent: boolean;
  isAbsurd: boolean;
}) {
  const { userText, lead, detectedService, bookingIntent, isAbsurd } = params;
  if (isAbsurd) {
    return "Похоже, запрос не совсем про услуги салона. Уточните, пожалуйста, что именно Вы хотите, и я подскажу подходящий вариант.";
  }

  const priceMap: Record<string, string> = {
    "Стрижка": "от 1800 ₽",
    "Маникюр": "2200 ₽",
    "Педикюр": "2500 ₽",
    "Брови/ресницы": "1200 ₽",
    "Уход за лицом": "3000 ₽",
  };

  if (detectedService) {
    const price = priceMap[detectedService];
    if (bookingIntent) {
      return `Понял. ${detectedService}${price ? ` — ${price}` : ""}. Как Вас зовут?`;
    }
    return price
      ? `${detectedService} — ${price}. Хотите записаться на удобное время?`
      : `Понял, интересует ${detectedService}. Хотите записаться?`;
  }

  if (!lead.name) {
    return "Понял. Как Вас зовут?";
  }

  if (!lead.phone) {
    return "Подскажите, пожалуйста, Ваш номер телефона для связи.";
  }

  if (/завтра|сегодня|на\s*\d{1,2}|в\s*\d{1,2}/i.test(userText)) {
    return "Понял. На какое время Вам будет удобно? После этого подтвержу запись.";
  }

  return ASK_AI_FALLBACK;
}

function extractName(text: string): string | undefined {
  const lower = text.toLowerCase();
  const match =
    lower.match(/меня зовут\s+([а-яёa-z-]+)/i) ||
    lower.match(/я\s+([а-яёa-z-]{2,})/i);
  if (!match?.[1]) return undefined;
  const raw = match[1];
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

function extractPhone(text: string): string | undefined {
  const phone = text.replace(/[^\d+]/g, "");
  const digits = phone.replace(/[^\d]/g, "");
  if (digits.length < 10) return undefined;
  return phone.startsWith("+") ? phone : `+${digits}`;
}

function extractNameSmart(text: string): string | undefined {
  const cleaned = text.trim();
  if (!cleaned) return undefined;

  const phraseMatch =
    cleaned.match(/(?:меня\s+зовут|я)\s+([A-Za-zА-Яа-яЁё-]{2,})/i) ||
    cleaned.match(/(?:my\s+name\s+is|i\s*am|i'm)\s+([A-Za-zА-Яа-яЁё-]{2,})/i);

  if (phraseMatch?.[1]) {
    const value = phraseMatch[1].replace(/[^A-Za-zА-Яа-яЁё-]/g, "");
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  if (/^[A-Za-zА-Яа-яЁё-]{2,20}$/.test(cleaned)) {
    return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }

  return undefined;
}

function normalizeToken(value: string): string {
  return value.toLowerCase().replace(/\s+/g, "").replace(/[^a-zа-яё-]/gi, "");
}

function isBlockedName(value: string): boolean {
  const token = normalizeToken(value);
  const blocked = new Set([
    ...QUICK_OPTIONS.map((v) => normalizeToken(v)),
    "услуги",
    "консультация",
    "вопрос",
    "другое",
    "запись",
    "записьнаприем",
    "прием",
    "телефон",
    "номер",
    "цена",
    "стоимость",
  ]);
  return blocked.has(token);
}

function normalizeServiceIntent(raw: string | undefined): string | undefined {
  if (!raw) return undefined;
  const value = raw.trim();
  if (!value) return undefined;
  const lower = value.toLowerCase();

  // Hard reject absurd body-part intents before any category match.
  if (/(спин|колен|локт|пятк|ступн|живот|поясниц|плечо)/i.test(lower)) {
    return undefined;
  }

  // Canonical beauty categories
  if (/(стриж|стричь|подстрич|пострич|haircut)/i.test(lower)) return "Стрижка";
  if (/(окраш|тонир|балаяж|шатуш|airtouch)/i.test(lower)) return "Окрашивание";
  if (/(маник|ногт)/i.test(lower)) return "Маникюр";
  if (/(педик)/i.test(lower)) return "Педикюр";
  if (/(бров|ресниц|ламинир)/i.test(lower)) return "Брови/ресницы";
  if (/(лиц|чистк|пилинг|уход)/i.test(lower)) return "Уход за лицом";
  if (/(массаж|spa|спа)/i.test(lower)) return "Массаж/SPA";

  // Reject absurd/non-beauty phrases from lead card
  const hasAbsurdBodyPart = /(колен|локт|пятк|ступн|живот|поясниц|плечо)/i.test(lower);
  const hasBeautySignal = /(стриж|стричь|подстрич|пострич|окраш|маник|педик|бров|ресниц|лиц|уход|пилинг|массаж|spa|спа)/i.test(lower);
  if (hasAbsurdBodyPart || !hasBeautySignal) return undefined;

  if (value.length >= 3 && value.length <= 40) {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  return undefined;
}

function hasBookingIntent(text: string): boolean {
  return /(запис|запись|завтра|сегодня|в\s*\d{1,2}|на\s*\d{1,2}|время|окно|свободн|прием)/i.test(
    text
  );
}

function isSuspiciousServiceRequest(text: string): boolean {
  const lower = text.toLowerCase();
  return /(спин|колен|локт|пятк|ступн|живот|поясниц|плечо)/i.test(lower);
}

function isExplicitServiceConfirmation(text: string): boolean {
  return /(цель обращения|услуга:|это будет|запись на)/i.test(text);
}

function isServiceList(text: string): boolean {
  const lower = text.toLowerCase();
  const hits = [
    /стриж/gi,
    /маник/gi,
    /педик/gi,
    /бров/gi,
    /ресниц/gi,
    /уход/gi,
    /пилинг/gi,
    /массаж/gi,
    /окраш/gi,
  ].reduce((acc, re) => acc + ((lower.match(re) || []).length > 0 ? 1 : 0), 0);
  return hits >= 2;
}

function sanitizeAssistantReply(userText: string, reply: string): string {
  if (!reply) return reply;
  let cleaned = reply.trim();
  if (/^спасибо[!.,\s]/i.test(cleaned)) {
    cleaned = cleaned.replace(/^спасибо[!.,\s]*/i, "Понял. ");
  }
  if (!isSuspiciousServiceRequest(userText)) return cleaned;

  const confirmsWeHaveIt =
    /(да|конечно|отлично).*(у нас есть|доступна|предоставляется|входит)/i.test(
      reply
    ) || /(стрижк[аи]\s+спин|услуг[аи]\s+.*спин)/i.test(reply.toLowerCase());

  if (!confirmsWeHaveIt) return cleaned;

  return "Похоже, запрос неоднозначный. Уточните, пожалуйста: Вас интересует стрижка волос или процедура ухода/депиляции для спины? Я подскажу самый подходящий вариант.";
}

function extractServiceIntent(text: string): string | undefined {
  const lower = text.toLowerCase();
  const cleaned = text.trim();
  if (!cleaned) return undefined;

  if (/стриж|подстричь|haircut/.test(lower)) return "Стрижка";
  if (/окраш|тонир|балаяж|шатуш|airtouch/.test(lower)) return "Окрашивание";
  if (/маник|ногт/.test(lower)) return "Маникюр";
  if (/педик/.test(lower)) return "Педикюр";
  if (/бров|ресниц|ламинир/.test(lower)) return "Брови/ресницы";
  if (/лиц|чистк|пилинг|уход/.test(lower)) return "Уход за лицом";
  if (/массаж|spa|спа/.test(lower)) return "Массаж/SPA";

  // Generic intent: "хочу записаться на ...", "нужна ..."
  const generic =
    cleaned.match(/(?:хочу|нужна|нужен|интересует|записаться\s+на)\s+([A-Za-zА-Яа-яЁё0-9\s-]{3,40})/i) ||
    cleaned.match(/(?:по|насчет|по поводу)\s+([A-Za-zА-Яа-яЁё0-9\s-]{3,40})/i);

  if (generic?.[1]) {
    const service = generic[1].trim().replace(/[.,!?;:]+$/g, "");
    if (service.length >= 3 && service.length <= 40) {
      return service.charAt(0).toUpperCase() + service.slice(1);
    }
  }

  return undefined;
}

export default function DemoChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [llmHistory, setLlmHistory] = useState<
    Array<{ role: "user" | "assistant"; content: string }>
  >([]);
  const [inputVal, setInputVal] = useState("");
  const [lead, setLead] = useState<Record<string, string>>({});
  const [typing, setTyping] = useState(false);
  const [awaitingName, setAwaitingName] = useState(false);
  const [awaitingPhone, setAwaitingPhone] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useScrollReveal();

  const scrollToBottom = () =>
    setTimeout(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop =
          chatContainerRef.current.scrollHeight;
      }
    }, 50);

  const pushUserMessage = (text: string) => {
    setMessages((prev) => [...prev, { id: Date.now(), type: "user", text }]);
    scrollToBottom();
  };

  const pushBotMessage = (text: string) => {
    setMessages((prev) => [...prev, { id: Date.now(), type: "bot", text }]);
    scrollToBottom();
  };

  const initGreeting = async () => {
    setTyping(true);
    try {
      const greeting = await askDeepSeek([], "greeting");
      setMessages([{ id: Date.now(), type: "bot", text: greeting }]);
      setLlmHistory([{ role: "assistant", content: greeting }]);
    } catch {
      setMessages([{ id: Date.now(), type: "bot", text: FALLBACK_GREETING }]);
      setLlmHistory([{ role: "assistant", content: FALLBACK_GREETING }]);
    } finally {
      setTyping(false);
      scrollToBottom();
    }
  };

  useEffect(() => {
    void initGreeting();
  }, []);

  const sendToAi = async (userText: string) => {
    const detectedPhone = extractPhone(userText);
    const rawName = extractNameSmart(userText);
    const serviceFromText = normalizeServiceIntent(extractServiceIntent(userText));
    const isGenericOption =
      QUICK_OPTIONS.includes(userText) ||
      /(услуг|услуги|прайс|цены)/i.test(userText);
    const isAbsurdRequest = ABSURD_REQUEST_RE.test(userText.toLowerCase());
    const detectedService =
      isGenericOption || isAbsurdRequest
        ? undefined
        : serviceFromText;
    const hasExplicitNameIntent = /(меня\s+зовут|my\s+name\s+is|i\s*am|i'm)/i.test(
      userText
    );
    const isSingleWordReply = userText.trim().split(/\s+/).length === 1;
    const isServiceLikeName =
      /(стриж|маник|педик|бров|ресниц|услуг|запис|уход|spa|массаж)/i.test(userText);
    const canCaptureName =
      (hasExplicitNameIntent ||
        (awaitingName && isSingleWordReply && !detectedPhone)) &&
      !isServiceLikeName;
    const detectedName =
      canCaptureName &&
      rawName &&
      !detectedService &&
      !isBlockedName(rawName) &&
      !QUICK_OPTIONS.includes(userText)
        ? rawName
        : undefined;

    if (awaitingPhone && !detectedPhone) {
      const reply = "����������, ����������, ��� ����� �������� ��� �����.";
      pushBotMessage(reply);
      setLlmHistory((prev) => [...prev, { role: "user", content: userText }, { role: "assistant", content: reply }]);
      return;
    }

    if (awaitingName && isServiceLikeName) {
      const serviceLabel = detectedService || serviceFromText;
      if (serviceLabel && !lead.service) {
        setLead((prev) => ({ ...prev, service: serviceLabel }));
      }
      const reply = serviceLabel
        ? `�����, �� ������: ${serviceLabel}. ��� ��� �����?`
        : "�����. ��� ��� �����?";
      pushBotMessage(reply);
      setLlmHistory((prev) => [...prev, { role: "user", content: userText }, { role: "assistant", content: reply }]);
      setAwaitingName(true);
      return;
    }
    const updatedLead = {
      ...lead,
      service: lead.service || detectedService || lead.service,
      name: lead.name || detectedName || lead.name,
      phone: lead.phone || detectedPhone || lead.phone,
    };
    setLead(updatedLead);
    if (detectedName) setAwaitingName(false);
    if (detectedPhone) setAwaitingPhone(false);

    setTyping(true);
    scrollToBottom();

    try {
      const updatedHistory = [
        ...llmHistory,
        { role: "user" as const, content: userText },
      ];
      const stage =
        !updatedLead.name || !updatedLead.phone
          ? "lead_collection"
          : "free_conversation";
      let reply = await askDeepSeek(updatedHistory, stage, updatedLead);
      reply = sanitizeAssistantReply(userText, reply);

      // If the assistant clarified a concrete service (e.g. "цель обращения — педикюр"),
      // use that as fallback source for lead goal.
      const serviceFromReplyRaw = extractServiceIntent(reply);
      const userMentionsService = Boolean(serviceFromText);
      const serviceFromReply =
        !isGenericOption &&
        !isAbsurdRequest &&
        userMentionsService &&
        isExplicitServiceConfirmation(reply) &&
        !isServiceList(reply)
          ? normalizeServiceIntent(serviceFromReplyRaw)
          : undefined;
      const bookingIntent = hasBookingIntent(userText);

      let resolvedService = updatedLead.service || serviceFromReply;
      if (bookingIntent && resolvedService) {
        resolvedService =
          resolvedService && !/^запись на прием/i.test(resolvedService)
            ? `Запись на прием: ${resolvedService}`
            : "Запись на прием";
      }
      if (!resolvedService && updatedLead.name && updatedLead.phone) {
        resolvedService = SERVICE_NEEDS_CALLBACK;
      }
      if (resolvedService && resolvedService !== lead.service) {
        setLead((prev) => ({ ...prev, service: resolvedService as string }));
      }

      const asksName = /(как\s+вас\s+зовут|ваше\s+имя|имя\s+клиента)/i.test(reply);
      const asksPhone = /(номер\s+телефона|телефон\s+для\s+связи|контактн(ый|ого)\s+номер|ваш\s+номер)/i.test(reply);
      setAwaitingName(asksName);
      setAwaitingPhone(asksPhone);

      setLlmHistory([
        ...updatedHistory,
        { role: "assistant", content: reply },
      ]);
      pushBotMessage(reply);
    } catch {
      const fallback = buildFallbackReply({
        userText,
        lead: updatedLead,
        detectedService,
        bookingIntent: hasBookingIntent(userText),
        isAbsurd: isAbsurdRequest,
      });
      setLlmHistory((prev) => [
        ...prev,
        { role: "user", content: userText },
        { role: "assistant", content: fallback },
      ]);
      pushBotMessage(fallback);
    } finally {
      setTyping(false);
    }
  };

  const handleOption = async (option: string) => {
    pushUserMessage(option);
    await sendToAi(option);
  };

  const handleSend = async () => {
    if (!inputVal.trim() || typing) return;
    const userText = inputVal.trim();
    setInputVal("");
    pushUserMessage(userText);
    await sendToAi(userText);
  };

  const handleReset = () => {
    setLead({});
    setInputVal("");
    setMessages([]);
    setLlmHistory([]);
    setAwaitingName(false);
    setAwaitingPhone(false);
    void initGreeting();
  };

  const hasLead = Boolean(lead.service || lead.name || lead.phone);
  const isReady = Boolean(lead.name && lead.phone);

  return (
    <section id="demo" ref={sectionRef} aria-label="Интерактивный демо-чат">
      <div
        className="section-scenario spotlight-wrap"
        style={{
          background: "linear-gradient(180deg, #f3f6f3, #eef2ee)",
          borderRadius: 48,
          boxShadow: "0 100px 200px rgba(0,0,0,0.12)",
          padding: "200px 80px",
          maxWidth: 1300,
          margin: "120px auto",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <h2
          className="reveal"
          style={{
            fontFamily: "Jura, sans-serif",
            fontSize: "clamp(28px, 4vw, 42px)",
            marginBottom: 16,
            textAlign: "center",
            color: "var(--text)",
            letterSpacing: "-0.5px",
          }}
        >
          Интерактивный сценарий
        </h2>
        <p className="demo-chat-hint reveal reveal-delay-1">
          Попробуйте сценарий: нажмите кнопку или напишите свой вопрос в чат
        </p>

        <div
          className="demo-layout"
          style={{
            display: "flex",
            gap: 48,
            alignItems: "center",
            justifyContent: "center",
            flexWrap: "wrap",
            marginTop: 12,
          }}
        >
          <div
            className="demo-chat-card reveal reveal-delay-2"
            style={{
              width: 420,
              height: 520,
              zIndex: 10,
              position: "relative",
              pointerEvents: "auto",
              background: "#ffffff",
              boxShadow: "0 60px 140px rgba(0,0,0,0.18)",
              borderRadius: 20,
              overflow: "hidden",
              border: "1px solid var(--border)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                background: "var(--surface)",
                borderBottom: "1px solid var(--border)",
                padding: "16px 18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 10,
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: 10 }}
              >
                <div
                  style={{
                    width: 9,
                    height: 9,
                    borderRadius: "50%",
                    background: "var(--primary)",
                  }}
                />
                <div
                  style={{
                    color: "var(--text)",
                    fontWeight: 500,
                    fontSize: 15,
                  }}
                >
                  Чат-помощник
                </div>
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="btn-secondary text-button"
                style={{ fontSize: 12, padding: "6px 12px", borderRadius: 10 }}
                aria-label="Сбросить диалог"
              >
                Сброс
              </button>
            </div>

            <div
              ref={chatContainerRef}
              style={{
                flex: 1,
                overflowY: "auto",
                padding: 16,
                display: "flex",
                flexDirection: "column",
                gap: 10,
                background: "var(--bg)",
                scrollBehavior: "smooth",
              }}
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    display: "flex",
                    justifyContent:
                      msg.type === "user" ? "flex-end" : "flex-start",
                  }}
                >
                  <div
                    style={{
                      background:
                        msg.type === "bot"
                          ? "var(--surface)"
                          : msg.id === messages[messages.length - 1]?.id
                            ? "var(--primary-dark)"
                            : "var(--primary)",
                      color: msg.type === "bot" ? "var(--text)" : "#fff",
                      padding: "10px 14px",
                      borderRadius:
                        msg.type === "bot"
                          ? "14px 14px 14px 4px"
                          : "14px 14px 4px 14px",
                      fontSize: 14,
                      maxWidth: 290,
                      border:
                        msg.type === "bot"
                          ? "1px solid var(--border)"
                          : "none",
                      lineHeight: 1.5,
                      animation: "fadeIn 0.3s ease",
                    }}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {typing && (
                <div
                  style={{
                    display: "flex",
                    gap: 4,
                    alignItems: "center",
                    padding: "12px 14px",
                    background: "var(--surface)",
                    borderRadius: "14px 14px 14px 4px",
                    width: 58,
                    border: "1px solid var(--border)",
                    animation: "fadeIn 0.3s ease",
                  }}
                >
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                </div>
              )}
            </div>

            <div
              style={{
                padding: 14,
                borderTop: "1px solid var(--border)",
                background: "var(--surface)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                  marginBottom: 10,
                }}
              >
                {QUICK_OPTIONS.map((opt, idx) => (
                  <button
                    type="button"
                    key={opt}
                    onClick={() => void handleOption(opt)}
                    disabled={typing}
                    className={`demo-option-btn ${idx === 0 ? "demo-option-btn-primary" : ""}`}
                    style={{
                      padding: "8px 12px",
                      borderRadius: 100,
                      fontSize: 13,
                      fontWeight: 500,
                      fontFamily: "inherit",
                      opacity: typing ? 0.6 : 1,
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <input
                  className="input-field"
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && void handleSend()
                  }
                  placeholder="Напишите ваш вопрос..."
                  style={{ flex: 1, padding: "12px 14px", fontSize: 14 }}
                  aria-label="Введите сообщение"
                />
                <button
                  type="button"
                  onClick={() => void handleSend()}
                  disabled={typing}
                  className="btn-primary text-button"
                  style={{
                    padding: "12px 18px",
                    fontSize: 14,
                    borderRadius: 14,
                    opacity: typing ? 0.7 : 1,
                  }}
                  aria-label="Отправить сообщение"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div
            className="demo-arrow"
            style={{
              fontSize: 40,
              lineHeight: 1,
              color: "rgba(95, 127, 91, 0.4)",
              userSelect: "none",
              pointerEvents: "none",
              fontWeight: 300,
            }}
          >
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </div>

          <div
            className="form-card reveal reveal-delay-3"
            style={{
              width: 420,
              height: 520,
              background: "#ffffff",
              boxShadow: "0 40px 100px rgba(0,0,0,0.12)",
              borderRadius: 20,
              border: "1px solid var(--border)",
              padding: 24,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 22,
              }}
            >
              <span
                style={{ fontWeight: 600, fontSize: 18, color: "var(--text)" }}
              >
                Карточка заявки
              </span>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  padding: "6px 14px",
                  borderRadius: 100,
                  border: "1px solid",
                  borderColor: isReady
                    ? "var(--primary)"
                    : "rgba(95, 127, 91, 0.25)",
                  color: isReady ? "#fff" : "var(--primary)",
                  background: isReady ? "var(--primary)" : "rgba(95, 127, 91, 0.08)",
                  transition: "all 0.3s ease",
                }}
              >
                {isReady ? "Собрано" : "В процессе"}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 18,
                paddingBottom: 20,
                borderBottom: "1px solid var(--border)",
              }}
            >
              {[
                { label: "Цель обращения", value: lead.service, icon: "🎯" },
                { label: "Имя клиента", value: lead.name, icon: "👤" },
                { label: "Контактный номер", value: lead.phone, icon: "📱" },
              ].map(({ label, value, icon }) => (
                <div key={label}>
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--text-muted)",
                      marginBottom: 6,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <span style={{ fontSize: 14 }}>{icon}</span>
                    {label}
                  </div>
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 500,
                      color: value ? "var(--text)" : "rgba(0,0,0,0.2)",
                      minHeight: 22,
                      transition: "color 0.3s ease",
                    }}
                  >
                    {value || "Ожидание данных..."}
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                marginTop: "auto",
                paddingTop: 20,
                display: "flex",
                alignItems: "center",
                gap: 10,
                opacity: hasLead ? 1 : 0.45,
                transition: "opacity 0.3s",
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: isReady
                    ? "var(--primary)"
                    : "rgba(95, 127, 91, 0.25)",
                  transition: "background 0.3s",
                  boxShadow: isReady
                    ? "0 0 8px rgba(95, 127, 91, 0.4)"
                    : "none",
                }}
              />
              <div
                style={{
                  fontSize: 13,
                  color: "var(--text-muted)",
                  lineHeight: 1.45,
                }}
              >
                {isReady
                  ? "Контакты собраны. Можно передавать заявку в CRM."
                  : "Заполняется по ходу диалога."}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1100px) {
          .section-scenario {
            padding: 120px 32px !important;
            border-radius: 32px !important;
          }
          .demo-layout {
            flex-direction: column !important;
            align-items: center !important;
          }
          .demo-arrow {
            transform: rotate(90deg);
          }
        }
        @media (max-width: 768px) {
          .section-scenario {
            padding: 64px 16px !important;
            border-radius: 24px !important;
            margin: 48px auto !important;
          }
          .demo-chat-card,
          .form-card {
            width: 100% !important;
            max-width: 420px !important;
            height: auto !important;
            min-height: 440px !important;
          }
        }
      `}</style>
    </section>
  );
}
