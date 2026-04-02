"use client";
import { useState } from "react";
import { useScrollReveal } from "../hooks/useScrollReveal";

const niches = [
  "Салон красоты / Медицина",
  "Сфера услуг (ремонт, выезд)",
  "Обучение / Онлайн-школа",
  "Спорт / Фитнес",
  "Недвижимость",
  "HoReCa",
  "B2B Услуги",
  "Другое направление",
];

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 0) return "";
  if (digits.length <= 1) return `+7`;
  if (digits.length <= 4) return `+7 (${digits.slice(1)}`;
  if (digits.length <= 7)
    return `+7 (${digits.slice(1, 4)}) ${digits.slice(4)}`;
  if (digits.length <= 9)
    return `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  return `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9, 11)}`;
}

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    niche: "",
    phone: "",
    text: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const sectionRef = useScrollReveal();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setForm((p) => ({ ...p, phone: formatted }));
  };

  return (
    <section
      id="contact"
      className="section-shell-compact"
      style={{
        background: "var(--surface)",
        borderTop: "1px solid var(--border)",
      }}
      ref={sectionRef}
      aria-label="Контактная форма"
    >
      <div className="section-container">
        <div
          style={{
            maxWidth: 800,
            margin: "0 auto",
            display: "flex",
            flexWrap: "wrap",
            gap: 48,
            justifyContent: "space-between",
          }}
        >
          <div className="reveal" style={{ flex: 1, minWidth: 280 }}>
            <div className="badge" style={{ marginBottom: 20 }}>
              Начать сотрудничество
            </div>
            <h2
              style={{
                fontFamily: "Jura, sans-serif",
                fontSize: "clamp(28px, 4vw, 42px)",
                fontWeight: 500,
                marginBottom: 24,
                letterSpacing: "-0.5px",
                lineHeight: 1.15,
              }}
            >
              Обсудим <br /> интеграцию для вас
            </h2>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: 16,
                lineHeight: 1.6,
                marginBottom: 40,
                maxWidth: 360,
              }}
            >
              Оставьте контакты для связи. Мы проведем короткий анализ вашей ниши
              и предложим оптимальный сценарий автоматизации.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <span
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: "rgba(95, 127, 91, 0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    fontWeight: 700,
                    color: "var(--primary)",
                    flexShrink: 0,
                    fontFamily: "Manrope, sans-serif",
                  }}
                >
                  1
                </span>
                <div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "var(--text)",
                      marginBottom: 4,
                    }}
                  >
                    Технический анализ
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: "var(--text-muted)",
                      lineHeight: 1.5,
                    }}
                  >
                    Изучим пути клиента на вашем сайте.
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <span
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: "rgba(95, 127, 91, 0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    fontWeight: 700,
                    color: "var(--primary)",
                    flexShrink: 0,
                    fontFamily: "Manrope, sans-serif",
                  }}
                >
                  2
                </span>
                <div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "var(--text)",
                      marginBottom: 4,
                    }}
                  >
                    Разработка сценария
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: "var(--text-muted)",
                      lineHeight: 1.5,
                    }}
                  >
                    Напишем логику общения бота.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="reveal reveal-delay-1" style={{ flex: 1, minWidth: 320 }}>
            <p
              style={{
                fontSize: 13,
                color: "var(--text-muted)",
                marginBottom: 16,
                lineHeight: 1.5,
              }}
            >
              Стоимость зависит от задачи и рассчитывается индивидуально
            </p>
            <div
              className="card"
              style={{
                padding: 36,
                borderRadius: 24,
                background: "var(--bg)",
                border: "1px solid var(--border)",
                boxShadow: "0 12px 48px rgba(47,47,47,0.03)",
              }}
            >
              {!submitted ? (
                <form
                  onSubmit={handleSubmit}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 20,
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontWeight: 600,
                        fontSize: 13,
                        marginBottom: 8,
                        color: "var(--text)",
                      }}
                    >
                      Ваше имя
                    </label>
                    <input
                      className="input-field"
                      type="text"
                      placeholder="Александр"
                      value={form.name}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, name: e.target.value }))
                      }
                      required
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        display: "block",
                        fontWeight: 600,
                        fontSize: 13,
                        marginBottom: 8,
                        color: "var(--text)",
                      }}
                    >
                      Направление бизнеса
                    </label>
                    <select
                      className="input-field"
                      value={form.niche}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, niche: e.target.value }))
                      }
                    >
                      <option value="" disabled>
                        Сфера деятельности
                      </option>
                      {niches.map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      style={{
                        display: "block",
                        fontWeight: 600,
                        fontSize: 13,
                        marginBottom: 8,
                        color: "var(--text)",
                      }}
                    >
                      Контактный телефон
                    </label>
                    <input
                      className="input-field"
                      type="tel"
                      placeholder="+7 (___) ___-__-__"
                      value={form.phone}
                      onChange={handlePhoneChange}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-primary text-button"
                    disabled={loading}
                    style={{
                      marginTop: 4,
                      width: "100%",
                      padding: "16px",
                      fontSize: 15,
                    }}
                  >
                    {loading ? (
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 8,
                        }}
                      >
                        <span
                          style={{
                            width: 16,
                            height: 16,
                            border: "2px solid rgba(255,255,255,0.3)",
                            borderTopColor: "#fff",
                            borderRadius: "50%",
                            animation: "spin 0.6s linear infinite",
                          }}
                        />
                        Отправка данных...
                      </span>
                    ) : (
                      "Оставить заявку"
                    )}
                  </button>
                  <div
                    style={{
                      fontSize: 11,
                      color: "var(--text-muted)",
                      textAlign: "center",
                      lineHeight: 1.5,
                    }}
                  >
                    Отправляя форму, вы соглашаетесь с форматом обработки данных.
                  </div>
                </form>
              ) : (
                <div
                  className="animate-scaleIn"
                  style={{ textAlign: "center", padding: "32px 0" }}
                >
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: "50%",
                      background:
                        "linear-gradient(135deg, var(--primary), var(--primary-dark))",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 24px",
                      animation: "glow 2s ease-in-out infinite",
                    }}
                  >
                    <svg
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h3
                    style={{
                      fontWeight: 600,
                      fontSize: 22,
                      marginBottom: 12,
                      color: "var(--text)",
                    }}
                  >
                    Заявка принята
                  </h3>
                  <p
                    style={{
                      color: "var(--text-muted)",
                      marginBottom: 32,
                      lineHeight: 1.6,
                      fontSize: 15,
                    }}
                  >
                    Благодарим за обращение,{" "}
                    {form.name || "уважаемый клиент"}.<br /> Мы свяжемся с вами в
                    ближайшее время.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setForm({ name: "", niche: "", phone: "", text: "" });
                    }}
                    className="btn-secondary text-button"
                    style={{ fontSize: 13, padding: "10px 20px" }}
                  >
                    Заполнить еще раз
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media (max-width: 768px) {
          #contact .section-container > div {
            flex-direction: column !important;
          }
        }
      `}</style>
    </section>
  );
}
