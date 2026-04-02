"use client";
import { useEffect, useState } from "react";

const botMessages = [
  { id: 1, type: "user", text: "Здравствуйте, подскажите стоимость услуг?", delay: 800 },
  { id: 2, type: "bot", text: "Добрый день! Стоимость зависит от задачи. Подсказать варианты?", delay: 1500 },
  { id: 3, type: "user", text: "Да, давайте", delay: 1200 },
  { id: 4, type: "bot", text: "У меня есть 3 формата работы. Как к вам обращаться, чтобы выслать прайс-лист?", delay: 2000 },
  { id: 5, type: "user", text: "Евгений", delay: 1000 },
  { id: 6, type: "bot", text: "Приятно познакомиться, Евгений. На какой номер отправить PDF в WhatsApp?", delay: 2000 },
  { id: 7, type: "user", text: "+7 900 123-45-67", delay: 1500 },
  { id: 8, type: "bot", text: "Файл отправлен! Заявка передана.", delay: 1500 },
] as const;

export default function HeroChat() {
  const [visible, setVisible] = useState<number[]>([]);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    let i = 0;
    setVisible([]);
    setTyping(false);

    const show = () => {
      if (i >= botMessages.length) {
        setTimeout(() => {
          setVisible([]);
          i = 0;
          show();
        }, 5000);
        return;
      }

      const msg = botMessages[i];
      if (msg.type === "bot") {
        setTyping(true);
        setTimeout(() => {
          setTyping(false);
          setVisible((prev) => [...prev, msg.id]);
          i++;
          setTimeout(show, 600);
        }, msg.delay);
      } else {
        setTimeout(() => {
          setVisible((prev) => [...prev, msg.id]);
          i++;
          show();
        }, msg.delay);
      }
    };

    const t = setTimeout(show, 1000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18, flexShrink: 0, width: "100%", maxWidth: 372, position: "relative" }}>
      <div
        className="card"
        style={{
          padding: 0,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          zIndex: 10,
          borderRadius: 28,
          background: "linear-gradient(180deg, rgba(250,251,248,0.98) 0%, rgba(237,241,236,0.9) 100%)",
          border: "1px solid rgba(216,222,215,0.95)",
          boxShadow: "0 14px 36px rgba(45,49,44,0.09)",
        }}
      >
        <div style={{ background: "rgba(250,251,248,0.92)", borderBottom: "1px solid var(--border)", padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--primary)" }} />
          <div>
            <div className="text-body">Автоматический чат</div>
            <div className="text-small">Мгновенный ответ...</div>
          </div>
        </div>

        <div style={{ padding: "22px 16px", display: "flex", flexDirection: "column", gap: 13, height: 350, background: "rgba(243,245,242,0.72)", overflow: "hidden" }}>
          {botMessages.map((msg, idx) =>
            visible.includes(msg.id) ? (
              <div key={msg.id} className="animate-slideIn" style={{ display: "flex", justifyContent: msg.type === "user" ? "flex-end" : "flex-start" }}>
                <div
                  className={`${msg.type === "bot" ? "chat-bubble-bot" : "chat-bubble-user"} text-small`}
                  style={{
                    marginLeft: msg.type === "bot" && idx % 2 === 0 ? "4px" : "0px",
                    marginRight: msg.type === "user" && idx % 2 === 0 ? "4px" : "0px",
                    boxShadow: msg.type === "bot" ? "0 3px 9px rgba(45,49,44,0.06)" : "0 8px 16px rgba(122,143,106,0.22)",
                    color: msg.type === "user" ? "white" : "#4b5563",
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ) : null
          )}
          {typing && (
            <div className="animate-fadeIn" style={{ display: "flex", gap: 4, padding: "12px 16px", background: "var(--surface-strong)", borderRadius: "16px 16px 16px 4px", width: 64, border: "1px solid var(--border)", marginLeft: 4 }}>
              <div className="typing-dot" />
              <div className="typing-dot" />
              <div className="typing-dot" />
            </div>
          )}
        </div>
      </div>

      <div style={{ position: "relative", zIndex: 10, marginTop: -4 }}>
        <div
          className="card"
          style={{
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: 16,
            border: "1px solid rgba(216,222,215,0.95)",
            background: "linear-gradient(180deg, rgba(250,251,248,0.98) 0%, rgba(231,236,229,0.6) 100%)",
            borderRadius: 24,
            boxShadow: "0 12px 30px rgba(45,49,44,0.08)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span className={visible.includes(8) ? "" : "animate-pulse text-small"} style={{ color: "var(--primary)" }}>
                •
              </span>
              <span className="text-body" style={{ color: "#4b5563" }}>
                НОВАЯ ЗАЯВКА
              </span>
            </div>
            <div
              className="text-small"
              style={{
                color: visible.includes(8) ? "white" : "#8a8f98",
                background: visible.includes(8) ? "var(--primary)" : "var(--surface)",
                transition: "all 0.4s ease",
                padding: "4px 10px",
                borderRadius: 100,
              }}
            >
              {visible.includes(8) ? "Только что" : "Ожидание..."}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 16px" }}>
            {[
              ["Имя", visible.includes(5) ? "Евгений" : "—"],
              ["Запрос", visible.includes(1) ? "Прайс-лист" : "—"],
              ["Телефон", visible.includes(7) ? "+7 900 123-45-67" : "—"],
              ["Статус", visible.includes(8) ? "Собрано" : "В процессе"],
            ].map(([k, v]) => (
              <div key={k}>
                <div className="text-small" style={{ marginBottom: 4 }}>
                  {k}
                </div>
                <div
                  className="text-body"
                  style={{
                    color: k === "Статус" && visible.includes(8) ? "var(--primary)" : "#4b5563",
                    transition: "color 0.3s",
                  }}
                >
                  {v}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
