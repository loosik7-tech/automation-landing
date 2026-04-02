"use client";

import { useScrollReveal } from "../hooks/useScrollReveal";

function ArrowDownIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <polyline points="19 12 12 19 5 12" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

const steps = [
  { label: "Входящая заявка", desc: "Клиент пишет на сайте" },
  { label: "Ответ за 3 секунды", desc: "Автоматическое приветствие" },
  { label: "Сбор данных", desc: "Имя, телефон, потребность" },
  { label: "Готовый лид в CRM", desc: "Мгновенная передача вам" },
];

export default function ProblemSolution() {
  const sectionRef = useScrollReveal();

  return (
    <section
      id="problem"
      style={{
        paddingTop: 112,
        paddingBottom: 112,
        background: "var(--surface)",
      }}
      ref={sectionRef}
      aria-label="Как система работает"
    >
      <div className="section-container" style={{ textAlign: "center" }}>
        <div className="badge reveal">Как это работает</div>

        <h2
          className="reveal"
          style={{
            fontFamily: "Jura, sans-serif",
            fontSize: "clamp(28px, 4vw, 42px)",
            fontWeight: 500,
            lineHeight: 1.15,
            color: "#111",
            margin: "12px 0 0",
            letterSpacing: "-0.5px",
          }}
        >
          Как система обрабатывает заявки
        </h2>

        <p
          className="reveal reveal-delay-1"
          style={{
            maxWidth: 480,
            margin: "16px auto 0",
            fontSize: 16,
            color: "var(--text-muted)",
            lineHeight: 1.6,
          }}
        >
          Каждое обращение проходит через простой и надёжный путь — без ручной
          обработки и потерь
        </p>

        <div
          className="reveal reveal-delay-2"
          style={{
            marginTop: 48,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            gap: 0,
            flexWrap: "wrap",
          }}
        >
          {steps.map((step, i) => (
            <div
              key={step.label}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 0,
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 16,
                  minWidth: 160,
                  maxWidth: 180,
                  padding: "0 16px",
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 16,
                    background:
                      i === steps.length - 1
                        ? "linear-gradient(135deg, var(--primary), var(--primary-dark))"
                        : "rgba(95, 127, 91, 0.08)",
                    border: `1px solid ${i === steps.length - 1 ? "transparent" : "rgba(95, 127, 91, 0.15)"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color:
                      i === steps.length - 1 ? "#fff" : "var(--primary)",
                    fontSize: 18,
                    fontWeight: 700,
                    fontFamily: "Manrope, sans-serif",
                    flexShrink: 0,
                  }}
                >
                  {i === steps.length - 1 ? (
                    <CheckIcon />
                  ) : (
                    `0${i + 1}`
                  )}
                </div>
                <div>
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: 14,
                      color: "var(--text)",
                      marginBottom: 6,
                      lineHeight: 1.3,
                    }}
                  >
                    {step.label}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: "var(--text-muted)",
                      lineHeight: 1.5,
                    }}
                  >
                    {step.desc}
                  </div>
                </div>
              </div>

              {i < steps.length - 1 && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    paddingTop: 18,
                    color: "rgba(95, 127, 91, 0.35)",
                    flexShrink: 0,
                  }}
                >
                  <ArrowDownIcon />
                </div>
              )}
            </div>
          ))}
        </div>

        <div
          className="reveal reveal-delay-3"
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 24,
            marginTop: 48,
            flexWrap: "wrap",
          }}
        >
          {["Без ожидания", "Без потерь", "Без ручной работы"].map((t) => (
            <div
              key={t}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 14,
                color: "var(--text-muted)",
              }}
            >
              <span
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  background: "rgba(95, 127, 91, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--primary)",
                  flexShrink: 0,
                }}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              {t}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
