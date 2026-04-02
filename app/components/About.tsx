"use client";

export default function About() {
  return (
    <section
      id="about"
      className="section-shell"
      style={{
        background: "var(--surface)",
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div className="section-container">
        <div className="section-head">
          <h2 style={{ fontFamily: "Jura, sans-serif",  fontSize: "clamp(20px, 2.2vw, 24px)", fontWeight: 500, letterSpacing: "-0.2px", lineHeight: 1.65 }}>
            Я настраиваю простые системы обработки заявок.
          </h2>
          <p style={{ maxWidth: 720, margin: "0 auto" }}>
            Без сложных CRM и перегруженных решений - только то, что реально приносит заявки и освобождает ваше время.
          </p>
        </div>

        <div className="section-content-gap" style={{ textAlign: "center" }}>
          <div
            style={{
              display: "inline-block",
              background: "var(--bg)",
              border: "1px solid var(--border)",
              padding: "12px 24px",
              borderRadius: 100,
              fontSize: 14,
              fontWeight: 500,
              color: "var(--primary-dark)",
            }}
          >
            Обычно внедрение занимает 1-3 дня
          </div>
        </div>
      </div>
    </section>
  );
}
