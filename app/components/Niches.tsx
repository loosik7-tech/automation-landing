"use client";

import { useScrollReveal } from "../hooks/useScrollReveal";

const niches = [
  {
    num: "01",
    title: "Эстетика и красота",
    desc: "Салоны, клиники, спа, частные мастера",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
  {
    num: "02",
    title: "Медицина",
    desc: "Стоматологии, приемы, обследования",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
  },
  {
    num: "03",
    title: "Тех-услуги",
    desc: "СТО, ремонт, выездные специалисты",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
  },
  {
    num: "04",
    title: "Обучение",
    desc: "Школы, курсы, репетиторы, тренеры",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
  },
  {
    num: "05",
    title: "Спорт",
    desc: "Фитнес-клубы, студии йоги, секции",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v8" />
        <path d="M8 12h8" />
      </svg>
    ),
  },
  {
    num: "06",
    title: "Недвижимость",
    desc: "Запись на просмотры, бронирование",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    num: "07",
    title: "HoReCa",
    desc: "Бронирование столов в ресторанах",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
        <line x1="6" y1="1" x2="6" y2="4" />
        <line x1="10" y1="1" x2="10" y2="4" />
        <line x1="14" y1="1" x2="14" y2="4" />
      </svg>
    ),
  },
  {
    num: "08",
    title: "B2B",
    desc: "Консультации, встречи, аудит",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
  },
];

export default function Niches() {
  const sectionRef = useScrollReveal();

  return (
    <section
      id="niches"
      className="section-shell"
      style={{
        background: "var(--bg)",
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
      }}
      ref={sectionRef}
      aria-label="Сферы применения"
    >
      <div className="section-container">
        <div
          className="reveal"
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: 44,
            gap: 28,
          }}
        >
          <div style={{ maxWidth: 500 }}>
            <div className="badge" style={{ marginBottom: 20 }}>
              Сферы применения
            </div>
            <h2
              style={{
                fontFamily: "Jura, sans-serif",
                fontSize: "clamp(28px, 4vw, 42px)",
                fontWeight: 500,
                letterSpacing: "-0.5px",
                lineHeight: 1.15,
              }}
            >
              Интеграция под любой бизнес-процесс
            </h2>
          </div>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: 16,
              maxWidth: 360,
              lineHeight: 1.6,
            }}
          >
            Если основа вашего бизнеса — первичные заявки, система гарантированно
            повысит % их обработки.
          </p>
        </div>

        <div
          className="reveal reveal-delay-1"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: 2,
            background: "var(--border)",
            border: "1px solid var(--border)",
            borderRadius: 24,
            overflow: "hidden",
          }}
        >
          {niches.map((niche) => (
            <div
              key={niche.title}
              style={{
                background: "var(--bg)",
                padding: "28px 24px",
                display: "flex",
                flexDirection: "column",
                gap: 16,
                transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--surface)";
                e.currentTarget.style.transform = "scale(1.02)";
                e.currentTarget.style.zIndex = "1";
                e.currentTarget.style.boxShadow =
                  "0 8px 24px rgba(0,0,0,0.06)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--bg)";
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.zIndex = "0";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: "rgba(95, 127, 91, 0.06)",
                  border: "1px solid rgba(95, 127, 91, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--primary)",
                }}
              >
                {niche.icon}
              </div>
              <div>
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: 15,
                    marginBottom: 4,
                    color: "var(--text)",
                  }}
                >
                  {niche.title}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: "var(--text-muted)",
                    lineHeight: 1.5,
                  }}
                >
                  {niche.desc}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div
          className="reveal reveal-delay-2"
          style={{ textAlign: "center", marginTop: 48 }}
        >
          <p style={{ color: "var(--text-muted)", fontSize: 15 }}>
            Нужно нестандартное решение?{" "}
            <a
              href="#contact"
              style={{
                color: "var(--primary-dark)",
                fontWeight: 600,
                borderBottom: "1px solid rgba(95, 127, 91, 0.3)",
                textDecoration: "none",
                paddingBottom: 2,
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--primary)";
                e.currentTarget.style.borderBottomColor = "var(--primary)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--primary-dark)";
                e.currentTarget.style.borderBottomColor =
                  "rgba(95, 127, 91, 0.3)";
              }}
            >
              Опишите задачу — обсудим интеграцию
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
