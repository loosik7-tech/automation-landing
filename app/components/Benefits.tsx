"use client";

import { useScrollReveal } from "../hooks/useScrollReveal";

function ShieldIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  );
}

function ZapIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function DatabaseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  );
}

function RocketIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  );
}

const benefits = [
  {
    title: "100% фиксация заявок",
    desc: "Каждое сообщение заканчивается получением телефона. Система работает без перерывов, выходных и праздников.",
    stat: "100%",
    statLabel: "сохранность",
    icon: ShieldIcon,
  },
  {
    title: "Моментальная реакция",
    desc: "Клиент получает ответ в первые секунды. Это формирует доверие и показывает высокий статус вашего сервиса.",
    stat: "0 сек",
    statLabel: "ожидание",
    icon: ZapIcon,
  },
  {
    title: "Идеальный порядок",
    desc: "Вы больше не перечитываете диалоги. Все контакты аккуратно складываются в единую структурированную базу.",
    stat: "CRM",
    statLabel: "выгрузка",
    icon: DatabaseIcon,
  },
  {
    title: "Внедрение «под ключ»",
    desc: "От вас требуется только согласовать сценарий. Вся техническая настройка занимает минимум времени.",
    stat: "1-3",
    statLabel: "рабочих дня",
    icon: RocketIcon,
  },
];

export default function Benefits() {
  const sectionRef = useScrollReveal();

  return (
    <section id="benefits" className="section-shell" ref={sectionRef} aria-label="Преимущества">
      <div className="section-container">
        <div className="section-head reveal">
          <div className="badge">Результат внедрения</div>
          <h2
            style={{
              fontFamily: "Jura, sans-serif",
              fontSize: "clamp(28px, 4vw, 42px)",
              fontWeight: 500,
              letterSpacing: "-0.5px",
            }}
          >
            Изменения, которые вы заметите сразу
          </h2>
          <p style={{ maxWidth: 480, margin: "0 auto" }}>
            Автоматизация не просто экономит время, она конвертирует заявки,
            которые раньше уходили к конкурентам.
          </p>
        </div>

        <div
          className="section-content-gap"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 20,
          }}
        >
          {benefits.map((b, i) => {
            const Icon = b.icon;
            return (
              <div
                key={b.title}
                className="card reveal"
                style={{
                  padding: 28,
                  transitionDelay: `${i * 0.1}s`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 20,
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: "rgba(95, 127, 91, 0.08)",
                      border: "1px solid rgba(95, 127, 91, 0.12)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--primary)",
                    }}
                  >
                    <Icon />
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div
                      style={{
                        fontSize: 28,
                        fontWeight: 700,
                        color: "var(--primary)",
                        letterSpacing: "-1px",
                        lineHeight: 1,
                        fontFamily: "Manrope, sans-serif",
                      }}
                    >
                      {b.stat}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "var(--text-muted)",
                        textTransform: "uppercase",
                        letterSpacing: "0.8px",
                        marginTop: 2,
                      }}
                    >
                      {b.statLabel}
                    </div>
                  </div>
                </div>

                <h3
                  style={{
                    fontWeight: 600,
                    fontSize: 17,
                    marginBottom: 8,
                    color: "var(--text)",
                  }}
                >
                  {b.title}
                </h3>
                <p
                  style={{
                    color: "var(--text-muted)",
                    fontSize: 14,
                    lineHeight: 1.6,
                  }}
                >
                  {b.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
