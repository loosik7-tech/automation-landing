"use client";

import { useScrollReveal } from "../hooks/useScrollReveal";

const testimonials = [
  {
    name: "Анна К.",
    role: "Салон красоты, Москва",
    text: "Раньше теряли до 40% заявок в выходные. После внедрения ни один клиент не остался без ответа. Запись выросла на 25% за первый месяц.",
    rating: 5,
  },
  {
    name: "Дмитрий С.",
    role: "Стоматологическая клиника",
    text: "Клиенты перестали ждать ответа по 2-3 часа. Система отвечает мгновенно, собирает контакты и передаёт в нашу CRM. Очень доволен результатом.",
    rating: 5,
  },
  {
    name: "Елена М.",
    role: "Фитнес-клуб",
    text: "Настроили за 2 дня. Теперь каждое обращение с сайта — это готовая заявка на пробное занятие. Рекомендую всем знакомым владельцам бизнеса.",
    rating: 5,
  },
];

function StarIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="none"
      aria-hidden="true"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

export default function Testimonials() {
  const sectionRef = useScrollReveal();

  return (
    <section
      id="testimonials"
      className="section-shell"
      style={{ background: "var(--bg)" }}
      ref={sectionRef}
      aria-label="Отзывы клиентов"
    >
      <div className="section-container">
        <div className="section-head reveal">
          <div className="badge">Отзывы</div>
          <h2
            style={{
              fontFamily: "Jura, sans-serif",
              fontSize: "clamp(28px, 4vw, 42px)",
              fontWeight: 500,
              letterSpacing: "-0.5px",
            }}
          >
            Что говорят клиенты
          </h2>
          <p style={{ maxWidth: 480, margin: "0 auto" }}>
            Результаты, которых достигли бизнесы после внедрения автоматизации
            заявок.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 20,
          }}
        >
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className="testimonial-card reveal"
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <div
                style={{
                  display: "flex",
                  gap: 2,
                  marginBottom: 16,
                  color: "#e8b94a",
                }}
              >
                {Array.from({ length: t.rating }).map((_, j) => (
                  <StarIcon key={j} />
                ))}
              </div>

              <p
                style={{
                  fontSize: 15,
                  lineHeight: 1.65,
                  color: "var(--text)",
                  marginBottom: 24,
                  fontWeight: 400,
                }}
              >
                «{t.text}»
              </p>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  borderTop: "1px solid var(--border)",
                  paddingTop: 20,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    background: "rgba(95, 127, 91, 0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 600,
                    fontSize: 15,
                    color: "var(--primary)",
                    fontFamily: "Manrope, sans-serif",
                    flexShrink: 0,
                  }}
                >
                  {t.name.charAt(0)}
                </div>
                <div>
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: 14,
                      color: "var(--text)",
                      lineHeight: 1.3,
                    }}
                  >
                    {t.name}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: "var(--text-muted)",
                      lineHeight: 1.4,
                      marginTop: 2,
                    }}
                  >
                    {t.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
