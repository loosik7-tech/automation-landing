"use client";

import { useEffect, useRef, useState } from "react";
import { useScrollReveal } from "../hooks/useScrollReveal";

type Message = { id: number; type: "bot" | "user"; text: string };
type AiEnvelope = {
  reply?: string;
  lead_update?: {
    service?: string;
    name?: string;
    phone?: string;
  };
  needs_clarification?: boolean;
  confidence?: number;
};

const QUICK_OPTIONS = [
  "РљРѕРЅСЃСѓР»СЊС‚Р°С†РёСЏ",
  "Р—Р°РїРёСЃСЊ РЅР° РїСЂРёРµРј",
  "РЈСЃР»СѓРіРё",
  "Р’РѕРїСЂРѕСЃ",
  "Р”СЂСѓРіРѕРµ",
];

const ABSURD_REQUEST_RE =
  /(СЏРёС†|СЏР№С†|РїРµРЅРёСЃ|С‡Р»РµРЅ|РёРЅС‚РёРј|РїР°С…|Р¶РѕРї|Р·Р°РґРЅРёС†|СЃРµРєСЃ|СЌСЂРѕС‚|Р°РЅСѓСЃ|РіРµРЅРёС‚Р°Р»|РїРёР·Рґ|С…СѓР№|РґРёС‡СЊ)/i;

const FALLBACK_GREETING =
  "Р—РґСЂР°РІСЃС‚РІСѓР№С‚Рµ! РЇ РѕРЅР»Р°Р№РЅ-РєРѕРЅСЃСѓР»СЊС‚Р°РЅС‚ СЃР°Р»РѕРЅР°. РџРѕРґСЃРєР°Р¶Сѓ РїРѕ СѓСЃР»СѓРіР°Рј, С†РµРЅР°Рј Рё Р·Р°РїРёСЃРё.";
const ASK_AI_FALLBACK =
  "РџРѕРЅСЏР» РІР°СЃ. РЈС‚РѕС‡РЅРёС‚Рµ, РїРѕР¶Р°Р»СѓР№СЃС‚Р°, Р·Р°РїСЂРѕСЃ, Рё СЏ РїРѕРјРѕРіСѓ СЃ РІС‹Р±РѕСЂРѕРј РёР»Рё Р·Р°РїРёСЃСЊСЋ.";

const SERVICE_NEEDS_CALLBACK = "РќСѓР¶РµРЅ Р·РІРѕРЅРѕРє РґР»СЏ СѓС‚РѕС‡РЅРµРЅРёСЏ СѓСЃР»СѓРіРё";

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
  const data = (await response.json()) as AiEnvelope;
  return {
    reply: data.reply?.trim() || ASK_AI_FALLBACK,
    lead_update: data.lead_update ?? {},
    needs_clarification: Boolean(data.needs_clarification),
    confidence: typeof data.confidence === "number" ? data.confidence : 0,
  };
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
    return "РџРѕС…РѕР¶Рµ, Р·Р°РїСЂРѕСЃ РЅРµ СЃРѕРІСЃРµРј РїСЂРѕ СѓСЃР»СѓРіРё СЃР°Р»РѕРЅР°. РЈС‚РѕС‡РЅРёС‚Рµ, РїРѕР¶Р°Р»СѓР№СЃС‚Р°, С‡С‚Рѕ РёРјРµРЅРЅРѕ Р’С‹ С…РѕС‚РёС‚Рµ, Рё СЏ РїРѕРґСЃРєР°Р¶Сѓ РїРѕРґС…РѕРґСЏС‰РёР№ РІР°СЂРёР°РЅС‚.";
  }

  const priceMap: Record<string, string> = {
    "РЎС‚СЂРёР¶РєР°": "РѕС‚ 1800 в‚Ѕ",
    "РњР°РЅРёРєСЋСЂ": "2200 в‚Ѕ",
    "РџРµРґРёРєСЋСЂ": "2500 в‚Ѕ",
    "Р‘СЂРѕРІРё/СЂРµСЃРЅРёС†С‹": "1200 в‚Ѕ",
    "РЈС…РѕРґ Р·Р° Р»РёС†РѕРј": "3000 в‚Ѕ",
  };

  if (detectedService) {
    const price = priceMap[detectedService];
    if (bookingIntent) {
      return `РџРѕРЅСЏР». ${detectedService}${price ? ` вЂ” ${price}` : ""}. РљР°Рє Р’Р°СЃ Р·РѕРІСѓС‚?`;
    }
    return price
      ? `${detectedService} вЂ” ${price}. РҐРѕС‚РёС‚Рµ Р·Р°РїРёСЃР°С‚СЊСЃСЏ РЅР° СѓРґРѕР±РЅРѕРµ РІСЂРµРјСЏ?`
      : `РџРѕРЅСЏР», РёРЅС‚РµСЂРµСЃСѓРµС‚ ${detectedService}. РҐРѕС‚РёС‚Рµ Р·Р°РїРёСЃР°С‚СЊСЃСЏ?`;
  }

  if (!lead.name) {
    return "РџРѕРЅСЏР». РљР°Рє Р’Р°СЃ Р·РѕРІСѓС‚?";
  }

  if (!lead.phone) {
    return "РџРѕРґСЃРєР°Р¶РёС‚Рµ, РїРѕР¶Р°Р»СѓР№СЃС‚Р°, Р’Р°С€ РЅРѕРјРµСЂ С‚РµР»РµС„РѕРЅР° РґР»СЏ СЃРІСЏР·Рё.";
  }

  if (/Р·Р°РІС‚СЂР°|СЃРµРіРѕРґРЅСЏ|РЅР°\s*\d{1,2}|РІ\s*\d{1,2}/i.test(userText)) {
    return "РџРѕРЅСЏР». РќР° РєР°РєРѕРµ РІСЂРµРјСЏ Р’Р°Рј Р±СѓРґРµС‚ СѓРґРѕР±РЅРѕ? РџРѕСЃР»Рµ СЌС‚РѕРіРѕ РїРѕРґС‚РІРµСЂР¶Сѓ Р·Р°РїРёСЃСЊ.";
  }

  return ASK_AI_FALLBACK;
}

function extractName(text: string): string | undefined {
  const lower = text.toLowerCase();
  const match =
    lower.match(/РјРµРЅСЏ Р·РѕРІСѓС‚\s+([Р°-СЏС‘a-z-]+)/i) ||
    lower.match(/СЏ\s+([Р°-СЏС‘a-z-]{2,})/i);
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
    cleaned.match(/(?:меня\s+зовут|я)\s+([\p{L}-]{2,})/iu) ||
    cleaned.match(/(?:my\s+name\s+is|i\s*am|i'm)\s+([\p{L}-]{2,})/iu);

  if (phraseMatch?.[1]) {
    const value = phraseMatch[1].replace(/[^\p{L}-]/gu, "");
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  if (/^[\p{L}-]{2,20}$/u.test(cleaned)) {
    return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }

  return undefined;
}

function extractNameFromMixedInput(text: string): string | undefined {
  const token = text.trim().match(/[\p{L}-]{2,20}/u)?.[0];
  if (!token) return undefined;
  return token.charAt(0).toUpperCase() + token.slice(1);
}

function normalizeToken(value: string): string {
  return value.toLowerCase().replace(/\s+/g, "").replace(/[^a-zР°-СЏС‘-]/gi, "");
}

function isBlockedName(value: string): boolean {
  const token = normalizeToken(value);
  const blocked = new Set([
    ...QUICK_OPTIONS.map((v) => normalizeToken(v)),
    "СѓСЃР»СѓРіРё",
    "РєРѕРЅСЃСѓР»СЊС‚Р°С†РёСЏ",
    "РІРѕРїСЂРѕСЃ",
    "РґСЂСѓРіРѕРµ",
    "Р·Р°РїРёСЃСЊ",
    "Р·Р°РїРёСЃСЊРЅР°РїСЂРёРµРј",
    "РїСЂРёРµРј",
    "С‚РµР»РµС„РѕРЅ",
    "РЅРѕРјРµСЂ",
    "С†РµРЅР°",
    "СЃС‚РѕРёРјРѕСЃС‚СЊ",
  ]);
  return blocked.has(token);
}

function normalizeServiceIntent(raw: string | undefined): string | undefined {
  if (!raw) return undefined;
  const value = raw.trim();
  if (!value) return undefined;
  const lower = value.toLowerCase();

  // Hard reject absurd body-part intents before any category match.
  if (/(СЃРїРёРЅ|РєРѕР»РµРЅ|Р»РѕРєС‚|РїСЏС‚Рє|СЃС‚СѓРїРЅ|Р¶РёРІРѕС‚|РїРѕСЏСЃРЅРёС†|РїР»РµС‡Рѕ)/i.test(lower)) {
    return undefined;
  }

  // Canonical beauty categories
  if (/(СЃС‚СЂРёР¶|СЃС‚СЂРёС‡СЊ|РїРѕРґСЃС‚СЂРёС‡|РїРѕСЃС‚СЂРёС‡|haircut)/i.test(lower)) return "РЎС‚СЂРёР¶РєР°";
  if (/(окраш|тонир|балаяж|шатуш|airtouch)/i.test(lower)) return "Окрашивание";
  if (/(уклад|styling)/i.test(lower)) return "Укладка";
  if (/(РјР°РЅРёРє|РЅРѕРіС‚)/i.test(lower)) return "РњР°РЅРёРєСЋСЂ";
  if (/(РїРµРґРёРє)/i.test(lower)) return "РџРµРґРёРєСЋСЂ";
  if (/(Р±СЂРѕРІ|СЂРµСЃРЅРёС†|Р»Р°РјРёРЅРёСЂ)/i.test(lower)) return "Р‘СЂРѕРІРё/СЂРµСЃРЅРёС†С‹";
  if (/(Р»РёС†|С‡РёСЃС‚Рє|РїРёР»РёРЅРі|СѓС…РѕРґ)/i.test(lower)) return "РЈС…РѕРґ Р·Р° Р»РёС†РѕРј";
  if (/(РјР°СЃСЃР°Р¶|spa|СЃРїР°)/i.test(lower)) return "РњР°СЃСЃР°Р¶/SPA";

  // Reject absurd/non-beauty phrases from lead card
  const hasAbsurdBodyPart = /(РєРѕР»РµРЅ|Р»РѕРєС‚|РїСЏС‚Рє|СЃС‚СѓРїРЅ|Р¶РёРІРѕС‚|РїРѕСЏСЃРЅРёС†|РїР»РµС‡Рѕ)/i.test(lower);
  const hasBeautySignal = /(СЃС‚СЂРёР¶|СЃС‚СЂРёС‡СЊ|РїРѕРґСЃС‚СЂРёС‡|РїРѕСЃС‚СЂРёС‡|РѕРєСЂР°С€|РјР°РЅРёРє|РїРµРґРёРє|Р±СЂРѕРІ|СЂРµСЃРЅРёС†|Р»РёС†|СѓС…РѕРґ|РїРёР»РёРЅРі|РјР°СЃСЃР°Р¶|spa|СЃРїР°)/i.test(lower);
  if (hasAbsurdBodyPart || !hasBeautySignal) return undefined;

  if (value.length >= 3 && value.length <= 40) {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  return undefined;
}

function hasBookingIntent(text: string): boolean {
  return /(Р·Р°РїРёСЃ|Р·Р°РїРёСЃСЊ|Р·Р°РІС‚СЂР°|СЃРµРіРѕРґРЅСЏ|РІ\s*\d{1,2}|РЅР°\s*\d{1,2}|РІСЂРµРјСЏ|РѕРєРЅРѕ|СЃРІРѕР±РѕРґРЅ|РїСЂРёРµРј)/i.test(
    text
  );
}

function isSuspiciousServiceRequest(text: string): boolean {
  const lower = text.toLowerCase();
  return /(СЃРїРёРЅ|РєРѕР»РµРЅ|Р»РѕРєС‚|РїСЏС‚Рє|СЃС‚СѓРїРЅ|Р¶РёРІРѕС‚|РїРѕСЏСЃРЅРёС†|РїР»РµС‡Рѕ)/i.test(lower);
}

function isExplicitServiceConfirmation(text: string): boolean {
  return /(С†РµР»СЊ РѕР±СЂР°С‰РµРЅРёСЏ|СѓСЃР»СѓРіР°:|СЌС‚Рѕ Р±СѓРґРµС‚|Р·Р°РїРёСЃСЊ РЅР°)/i.test(text);
}

function isServiceList(text: string): boolean {
  const lower = text.toLowerCase();
  const hits = [
    /СЃС‚СЂРёР¶/gi,
    /РјР°РЅРёРє/gi,
    /РїРµРґРёРє/gi,
    /Р±СЂРѕРІ/gi,
    /СЂРµСЃРЅРёС†/gi,
    /СѓС…РѕРґ/gi,
    /РїРёР»РёРЅРі/gi,
    /РјР°СЃСЃР°Р¶/gi,
    /РѕРєСЂР°С€/gi,
  ].reduce((acc, re) => acc + ((lower.match(re) || []).length > 0 ? 1 : 0), 0);
  return hits >= 2;
}

function sanitizeAssistantReply(userText: string, reply: string): string {
  if (!reply) return reply;
  let cleaned = reply.trim();
  if (/^СЃРїР°СЃРёР±Рѕ[!.,\s]/i.test(cleaned)) {
    cleaned = cleaned.replace(/^СЃРїР°СЃРёР±Рѕ[!.,\s]*/i, "РџРѕРЅСЏР». ");
  }
  if (!isSuspiciousServiceRequest(userText)) return cleaned;

  const confirmsWeHaveIt =
    /(РґР°|РєРѕРЅРµС‡РЅРѕ|РѕС‚Р»РёС‡РЅРѕ).*(Сѓ РЅР°СЃ РµСЃС‚СЊ|РґРѕСЃС‚СѓРїРЅР°|РїСЂРµРґРѕСЃС‚Р°РІР»СЏРµС‚СЃСЏ|РІС…РѕРґРёС‚)/i.test(
      reply
    ) || /(СЃС‚СЂРёР¶Рє[Р°Рё]\s+СЃРїРёРЅ|СѓСЃР»СѓРі[Р°Рё]\s+.*СЃРїРёРЅ)/i.test(reply.toLowerCase());

  if (!confirmsWeHaveIt) return cleaned;

  return "РџРѕС…РѕР¶Рµ, Р·Р°РїСЂРѕСЃ РЅРµРѕРґРЅРѕР·РЅР°С‡РЅС‹Р№. РЈС‚РѕС‡РЅРёС‚Рµ, РїРѕР¶Р°Р»СѓР№СЃС‚Р°: Р’Р°СЃ РёРЅС‚РµСЂРµСЃСѓРµС‚ СЃС‚СЂРёР¶РєР° РІРѕР»РѕСЃ РёР»Рё РїСЂРѕС†РµРґСѓСЂР° СѓС…РѕРґР°/РґРµРїРёР»СЏС†РёРё РґР»СЏ СЃРїРёРЅС‹? РЇ РїРѕРґСЃРєР°Р¶Сѓ СЃР°РјС‹Р№ РїРѕРґС…РѕРґСЏС‰РёР№ РІР°СЂРёР°РЅС‚.";
}

function extractServiceIntent(text: string): string | undefined {
  const lower = text.toLowerCase();
  const cleaned = text.trim();
  if (!cleaned) return undefined;

  if (/СЃС‚СЂРёР¶|РїРѕРґСЃС‚СЂРёС‡СЊ|haircut/.test(lower)) return "РЎС‚СЂРёР¶РєР°";
  if (/(окраш|тонир|балаяж|шатуш|airtouch)/i.test(lower)) return "Окрашивание";
  if (/(уклад|styling)/i.test(lower)) return "Укладка";
  if (/РјР°РЅРёРє|РЅРѕРіС‚/.test(lower)) return "РњР°РЅРёРєСЋСЂ";
  if (/РїРµРґРёРє/.test(lower)) return "РџРµРґРёРєСЋСЂ";
  if (/Р±СЂРѕРІ|СЂРµСЃРЅРёС†|Р»Р°РјРёРЅРёСЂ/.test(lower)) return "Р‘СЂРѕРІРё/СЂРµСЃРЅРёС†С‹";
  if (/Р»РёС†|С‡РёСЃС‚Рє|РїРёР»РёРЅРі|СѓС…РѕРґ/.test(lower)) return "РЈС…РѕРґ Р·Р° Р»РёС†РѕРј";
  if (/РјР°СЃСЃР°Р¶|spa|СЃРїР°/.test(lower)) return "РњР°СЃСЃР°Р¶/SPA";

  // Generic intent: "С…РѕС‡Сѓ Р·Р°РїРёСЃР°С‚СЊСЃСЏ РЅР° ...", "РЅСѓР¶РЅР° ..."
  const generic =
    cleaned.match(/(?:хочу|нужна|нужен|интересует|записаться\s+на)\s+([\p{L}\p{N}\s-]{3,40})/iu) ||
    cleaned.match(/(?:по|насчет|по поводу)\s+([\p{L}\p{N}\s-]{3,40})/iu);

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
      setMessages([{ id: Date.now(), type: "bot", text: greeting.reply || FALLBACK_GREETING }]);
      setLlmHistory([{ role: "assistant", content: greeting.reply || FALLBACK_GREETING }]);
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
    const mixedName = extractNameFromMixedInput(userText);
    const serviceFromText = normalizeServiceIntent(extractServiceIntent(userText));
    const isGenericOption =
      QUICK_OPTIONS.includes(userText) ||
      /(СѓСЃР»СѓРі|СѓСЃР»СѓРіРё|РїСЂР°Р№СЃ|С†РµРЅС‹)/i.test(userText);
    const isAbsurdRequest = ABSURD_REQUEST_RE.test(userText.toLowerCase());
    const hasBodyPartConflict = isSuspiciousServiceRequest(userText);
    const detectedService =
      isGenericOption || isAbsurdRequest || hasBodyPartConflict
        ? undefined
        : serviceFromText;
    const hasExplicitNameIntent = /(РјРµРЅСЏ\s+Р·РѕРІСѓС‚|my\s+name\s+is|i\s*am|i'm)/i.test(
      userText
    );
    const isSingleWordReply = userText.trim().split(/\s+/).length === 1;
    const isServiceLikeName =
      /(СЃС‚СЂРёР¶|РјР°РЅРёРє|РїРµРґРёРє|Р±СЂРѕРІ|СЂРµСЃРЅРёС†|СѓСЃР»СѓРі|Р·Р°РїРёСЃ|СѓС…РѕРґ|spa|РјР°СЃСЃР°Р¶)/i.test(userText);
    const canCaptureName =
      (hasExplicitNameIntent ||
        (awaitingName && (isSingleWordReply || Boolean(detectedPhone)))) &&
      !isServiceLikeName;
    const nameCandidate = rawName || (awaitingName ? mixedName : undefined);
    const detectedName =
      canCaptureName &&
      nameCandidate &&
      !detectedService &&
      !isBlockedName(nameCandidate) &&
      !QUICK_OPTIONS.includes(userText)
        ? nameCandidate
        : undefined;

    if (awaitingPhone && !detectedPhone) {
      const reply = "пїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅ, пїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅ, пїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅ.";
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
        ? `пїЅпїЅпїЅпїЅпїЅ, пїЅпїЅ пїЅпїЅпїЅпїЅпїЅпїЅ: ${serviceLabel}. пїЅпїЅпїЅ пїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅ?`
        : "пїЅпїЅпїЅпїЅпїЅ. пїЅпїЅпїЅ пїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅ?";
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
      const ai = await askDeepSeek(updatedHistory, stage, updatedLead);
      let reply = sanitizeAssistantReply(userText, ai.reply || ASK_AI_FALLBACK);

      // If the assistant clarified a concrete service (e.g. "С†РµР»СЊ РѕР±СЂР°С‰РµРЅРёСЏ вЂ” РїРµРґРёРєСЋСЂ"),
      // use that as fallback source for lead goal.
      const aiServiceRaw = normalizeServiceIntent(ai.lead_update?.service);
      const serviceFromReplyRaw = extractServiceIntent(reply);
      const userMentionsService = Boolean(serviceFromText);
      const serviceFromReply =
        !isGenericOption &&
        !isAbsurdRequest &&
        !hasBodyPartConflict &&
        userMentionsService &&
        isExplicitServiceConfirmation(reply) &&
        !isServiceList(reply)
          ? normalizeServiceIntent(serviceFromReplyRaw)
          : undefined;
      const bookingIntent = hasBookingIntent(userText);

      const aiServiceAccepted =
        aiServiceRaw &&
        !isAbsurdRequest &&
        !hasBodyPartConflict &&
        !isServiceList(aiServiceRaw) &&
        (ai.confidence ?? 0) >= 0.6
          ? aiServiceRaw
          : undefined;
      let resolvedService = updatedLead.service || aiServiceAccepted || serviceFromReply;
      if (bookingIntent && resolvedService) {
        resolvedService =
          resolvedService && !/^Р·Р°РїРёСЃСЊ РЅР° РїСЂРёРµРј/i.test(resolvedService)
            ? `Р—Р°РїРёСЃСЊ РЅР° РїСЂРёРµРј: ${resolvedService}`
            : "Р—Р°РїРёСЃСЊ РЅР° РїСЂРёРµРј";
      }
      if (!resolvedService && updatedLead.name && updatedLead.phone) {
        resolvedService = SERVICE_NEEDS_CALLBACK;
      }
      if (resolvedService && resolvedService !== lead.service) {
        setLead((prev) => ({ ...prev, service: resolvedService as string }));
      }

      const asksName = /(РєР°Рє\s+РІР°СЃ\s+Р·РѕРІСѓС‚|РІР°С€Рµ\s+РёРјСЏ|РёРјСЏ\s+РєР»РёРµРЅС‚Р°)/i.test(reply);
      const asksPhone = /(РЅРѕРјРµСЂ\s+С‚РµР»РµС„РѕРЅР°|С‚РµР»РµС„РѕРЅ\s+РґР»СЏ\s+СЃРІСЏР·Рё|РєРѕРЅС‚Р°РєС‚РЅ(С‹Р№|РѕРіРѕ)\s+РЅРѕРјРµСЂ|РІР°С€\s+РЅРѕРјРµСЂ)/i.test(reply);
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
    <section id="demo" ref={sectionRef} aria-label="РРЅС‚РµСЂР°РєС‚РёРІРЅС‹Р№ РґРµРјРѕ-С‡Р°С‚">
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
          РРЅС‚РµСЂР°РєС‚РёРІРЅС‹Р№ СЃС†РµРЅР°СЂРёР№
        </h2>
        <p className="demo-chat-hint reveal reveal-delay-1">
          РџРѕРїСЂРѕР±СѓР№С‚Рµ СЃС†РµРЅР°СЂРёР№: РЅР°Р¶РјРёС‚Рµ РєРЅРѕРїРєСѓ РёР»Рё РЅР°РїРёС€РёС‚Рµ СЃРІРѕР№ РІРѕРїСЂРѕСЃ РІ С‡Р°С‚
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
                  Р§Р°С‚-РїРѕРјРѕС‰РЅРёРє
                </div>
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="btn-secondary text-button"
                style={{ fontSize: 12, padding: "6px 12px", borderRadius: 10 }}
                aria-label="РЎР±СЂРѕСЃРёС‚СЊ РґРёР°Р»РѕРі"
              >
                РЎР±СЂРѕСЃ
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
                  placeholder="РќР°РїРёС€РёС‚Рµ РІР°С€ РІРѕРїСЂРѕСЃ..."
                  style={{ flex: 1, padding: "12px 14px", fontSize: 14 }}
                  aria-label="Р’РІРµРґРёС‚Рµ СЃРѕРѕР±С‰РµРЅРёРµ"
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
                  aria-label="РћС‚РїСЂР°РІРёС‚СЊ СЃРѕРѕР±С‰РµРЅРёРµ"
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
                РљР°СЂС‚РѕС‡РєР° Р·Р°СЏРІРєРё
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
                {isReady ? "РЎРѕР±СЂР°РЅРѕ" : "Р’ РїСЂРѕС†РµСЃСЃРµ"}
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
                { label: "Р¦РµР»СЊ РѕР±СЂР°С‰РµРЅРёСЏ", value: lead.service, icon: "рџЋЇ" },
                { label: "РРјСЏ РєР»РёРµРЅС‚Р°", value: lead.name, icon: "рџ‘¤" },
                { label: "РљРѕРЅС‚Р°РєС‚РЅС‹Р№ РЅРѕРјРµСЂ", value: lead.phone, icon: "рџ“±" },
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
                    {value || "РћР¶РёРґР°РЅРёРµ РґР°РЅРЅС‹С…..."}
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
                  ? "РљРѕРЅС‚Р°РєС‚С‹ СЃРѕР±СЂР°РЅС‹. РњРѕР¶РЅРѕ РїРµСЂРµРґР°РІР°С‚СЊ Р·Р°СЏРІРєСѓ РІ CRM."
                  : "Р—Р°РїРѕР»РЅСЏРµС‚СЃСЏ РїРѕ С…РѕРґСѓ РґРёР°Р»РѕРіР°."}
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


