"use client";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ background: "var(--primary-dark)", color: "rgba(245,241,232,0.8)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "64px 24px 48px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 48, marginBottom: 48 }}>
          <div style={{ maxWidth: 320 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <span style={{ fontWeight: 700, fontSize: 16, color: "white", letterSpacing: "-0.3px" }}>
                Автоматизация заявок
              </span>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: "rgba(245,241,232,0.5)", marginBottom: 24 }}>
              Настраиваю системы автоматической обработки обращений для малого и среднего бизнеса.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 14 }}>
              <a href="https://wa.me/79670040505" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(245,241,232,0.7)", textDecoration: "none", fontWeight: 500 }}>WhatsApp</a>
              <a href="https://t.me/automshh" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(245,241,232,0.7)", textDecoration: "none", fontWeight: 500 }}>Telegram</a>
            </div>
          </div>

          <div>
            <div style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", color: "rgba(245,241,232,0.4)", marginBottom: 20 }}>
              Навигация
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 32px" }}>
              {[
                { href: "#problem", label: "Как это работает" },
                { href: "#benefits", label: "Преимущества" },
                { href: "#how", label: "Процесс" },
                { href: "#demo", label: "Демо-чат" },
                { href: "#testimonials", label: "Отзывы" },
                { href: "#niches", label: "Для кого" },
                { href: "#whyme", label: "Почему я" },
                { href: "#contact", label: "Контакты" },
              ].map((l) => (
                <a key={l.href} href={l.href} style={{ color: "rgba(245,241,232,0.6)", textDecoration: "none", fontSize: 14, fontWeight: 500 }}>
                  {l.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div style={{ height: 1, background: "rgba(255,255,255,0.08)" }} />
        <div style={{ marginTop: 20, fontSize: 13, color: "rgba(245,241,232,0.5)" }}>
          © {currentYear} Автоматизация заявок
        </div>
      </div>
    </footer>
  );
}
