"use client";

import { useScrollReveal } from "../hooks/useScrollReveal";

const reasons = [
  {
    title: "Внедрение за 1–3 дня",
    desc: "Без долгих согласований и многомесячной разработки. Запускаем и тестируем систему уже на этой неделе.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    title: "Под ваш бизнес",
    desc: "Не шаблонное решение: сценарий собирается под вашу воронку, услуги и реальные заявки.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
  },
  {
    title: "Без сложных CRM",
    desc: "Работаем с удобным форматом: Telegram, таблица или существующая CRM, без лишней нагрузки.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
];

export default function WhyMe() {
  const sectionRef = useScrollReveal();

  return (
    <section
      id="whyme"
      className="section-shell-compact"
      style={{ background: "var(--bg)" }}
      ref={sectionRef}
      aria-label="Почему выбирают нас"
    >
      <div className="section-container">
        <div className="section-head reveal">
          <h2
            style={{
              fontFamily: "Jura, sans-serif",
              fontSize: "clamp(28px, 4vw, 42px)",
              fontWeight: 500,
              letterSpacing: "-0.5px",
            }}
          >
            Почему стоит работать со мной
          </h2>
          <p style={{ maxWidth: 500, margin: "0 auto" }}>
            Беру на себя техническую часть и настройку сценария, чтобы Вы
            получали готовые заявки без ручной обработки.
          </p>
          <div
            style={{
              maxWidth: 560,
              margin: "18px auto 0",
              fontSize: 14,
              lineHeight: 1.7,
              color: "var(--text-muted)",
              fontWeight: 400,
              textAlign: "left",
            }}
          >
            <div>→ Настройкой занимаюсь лично</div>
            <div>→ Под каждый бизнес собираю систему под ключ, без шаблонных решений</div>
            <div>→ Работаю напрямую</div>
          </div>
        </div>

        <div
          className="section-content-gap"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 20,
            maxWidth: 1000,
            margin: "0 auto",
          }}
        >
          {reasons.map((r, i) => (
            <div
              key={r.title}
              className="card reveal"
              style={{
                padding: 28,
                borderRadius: 20,
                border: "1px solid var(--border)",
                background: "var(--surface)",
                display: "flex",
                flexDirection: "column",
                gap: 16,
                transitionDelay: `${i * 0.1}s`,
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: "rgba(95, 127, 91, 0.08)",
                  border: "1px solid rgba(95, 127, 91, 0.12)",
                  color: "var(--primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.3s ease",
                }}
              >
                {r.icon}
              </div>
              <h3 style={{ fontWeight: 600, fontSize: 17, color: "var(--text)" }}>
                {r.title}
              </h3>
              <p style={{ color: "var(--text-muted)", fontSize: 14, lineHeight: 1.6 }}>
                {r.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
