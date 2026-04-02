"use client";

import { useScrollReveal } from "../hooks/useScrollReveal";

const steps = [
  {
    num: "01",
    title: "Входящее обращение",
    desc: "Клиент оставляет заявку или вопрос на вашем сайте.",
  },
  {
    num: "02",
    title: "Мгновенный ответ",
    desc: "Система автоматически приветствует клиента.",
  },
  {
    num: "03",
    title: "Уточнение деталей",
    desc: "Выяснение потребности и сбор важных данных.",
  },
  {
    num: "04",
    title: "Фиксация контакта",
    desc: "Запрос имени и телефона в комфортной форме.",
  },
  {
    num: "05",
    title: "Передача вам",
    desc: "Готовая заявка отправляется напрямую менеджеру.",
  },
];

export default function HowItWorks() {
  const sectionRef = useScrollReveal();

  return (
    <section
      id="how"
      className="section-shell-compact"
      style={{ background: "var(--surface)" }}
      ref={sectionRef}
      aria-label="Процесс обработки"
    >
      <div className="section-container">
        <div className="section-head reveal">
          <div className="badge">Процесс</div>
          <h2
            style={{
              fontFamily: "Jura, sans-serif",
              fontSize: "clamp(28px, 4vw, 42px)",
              fontWeight: 500,
              letterSpacing: "-0.5px",
            }}
          >
            Как проходит обработка заявки
          </h2>
          <p style={{ maxWidth: 500, margin: "0 auto" }}>
            Элегантный и незаметный для пользователя процесс, который гарантирует
            сбор контактов.
          </p>
        </div>

        <div
          className="section-content-gap reveal reveal-delay-1"
          style={{
            display: "flex",
            gap: 0,
            alignItems: "flex-start",
            justifyContent: "center",
            flexWrap: "wrap",
            position: "relative",
          }}
        >
          {steps.map((step, i) => (
            <div
              key={step.num}
              className="reveal"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                width: 140,
                flexShrink: 0,
                position: "relative",
                transitionDelay: `${i * 0.1}s`,
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background: "rgba(95, 127, 91, 0.06)",
                  border: "1px solid rgba(95, 127, 91, 0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 16,
                  position: "relative",
                }}
              >
                <span
                  style={{
                    fontFamily: "Manrope, sans-serif",
                    fontSize: 16,
                    fontWeight: 700,
                    color: "var(--primary)",
                  }}
                >
                  {step.num}
                </span>
                {i < steps.length - 1 && (
                  <div
                    className="step-connector"
                    style={{
                      position: "absolute",
                      right: -32,
                      top: "50%",
                      width: 24,
                      height: 1,
                      background:
                        "linear-gradient(90deg, rgba(95,127,91,0.2), rgba(95,127,91,0.05))",
                    }}
                  />
                )}
              </div>
              <div
                style={{
                  fontWeight: 600,
                  fontSize: 14,
                  marginBottom: 6,
                  color: "var(--text)",
                  lineHeight: 1.3,
                }}
              >
                {step.title}
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
          ))}
        </div>

        <div
          className="card reveal reveal-delay-2"
          style={{
            marginTop: 48,
            background: "linear-gradient(135deg, var(--primary-dark) 0%, #3d5a39 100%)",
            border: "none",
            padding: "40px 48px",
            display: "flex",
            alignItems: "center",
            gap: 24,
            flexWrap: "wrap",
            justifyContent: "space-between",
            borderRadius: 24,
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#8fbd8a",
                }}
              />
              <div
                style={{
                  color: "white",
                  fontWeight: 500,
                  fontSize: 20,
                }}
              >
                Итог: готовый контакт клиента
              </div>
            </div>
            <div
              style={{
                color: "rgba(255,255,255,0.7)",
                fontSize: 15,
              }}
            >
              Контакт, имя и задача переданы вам. Никаких ручных действий.
            </div>
          </div>
          <a href="#contact">
            <button
              className="text-button"
              style={{
                background: "white",
                color: "var(--primary-dark)",
                padding: "16px 36px",
                border: "none",
                borderRadius: 16,
                cursor: "pointer",
                fontWeight: 500,
                fontSize: 15,
                transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.15)";
              }}
            >
              Заказать внедрение
            </button>
          </a>
        </div>
      </div>
    </section>
  );
}
