"use client";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        background: "var(--primary-dark)",
        color: "rgba(245,241,232,0.8)",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "64px 24px 48px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 48,
            marginBottom: 48,
          }}
        >
          {/* Left: Brand & Contact */}
          <div style={{ maxWidth: 320 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: "rgba(255,255,255,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <span
                style={{
                  fontWeight: 700,
                  fontSize: 16,
                  color: "white",
                  letterSpacing: "-0.3px",
                }}
              >
                Автоматизация заявок
              </span>
            </div>
            <p
              style={{
                fontSize: 14,
                lineHeight: 1.6,
                color: "rgba(245,241,232,0.5)",
                marginBottom: 24,
              }}
            >
              Настраиваю системы автоматической обработки обращений для малого и
              среднего бизнеса.
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
                fontSize: 14,
              }}
            >
              <a
                href="https://wa.me/79670040505"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  color: "rgba(245,241,232,0.7)",
                  textDecoration: "none",
                  fontWeight: 500,
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "rgba(245,241,232,0.7)";
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 11.5C20 16.1944 16.1944 20 11.5 20C10.02 20 8.628 19.622 7.414 18.958L4 20L5.094 16.744C4.39 15.499 4 14.06 4 12.5C4 7.80558 7.80558 4 12.5 4C17.1944 4 21 7.80558 21 12.5" />
                  <path d="M9.2 9.6C9.2 9.6 9.5 8.8 10.1 8.8C10.7 8.8 11.3 10.2 11.3 10.2C11.3 10.2 11.4 10.6 11.1 10.9L10.7 11.3C10.7 11.3 10.6 11.5 10.8 11.8C11 12.2 11.8 13.3 13.3 14C13.3 14 13.6 14.2 13.9 13.9L14.4 13.5C14.4 13.5 14.7 13.3 15.1 13.4C15.1 13.4 16.5 14 16.5 14.6C16.5 15.2 15.8 15.6 15.8 15.6C15.8 15.6 14.9 16.2 13.2 15.5C11.5 14.8 10.2 13.2 9.6 12.2C9 11.2 8.7 10.3 9.2 9.6Z" />
                </svg>
                WhatsApp
              </a>
              <a
                href="https://t.me/automshh"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  color: "rgba(245,241,232,0.7)",
                  textDecoration: "none",
                  fontWeight: 500,
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "rgba(245,241,232,0.7)";
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21.5 2L2 10.5L8.5 13.5L12 11.5L9.5 15.5L10 19L14 15.5L19.5 20.5L21.5 2Z" />
                </svg>
                Telegram
              </a>
            </div>
          </div>

          {/* Right: Navigation */}
          <div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "1px",
                color: "rgba(245,241,232,0.4)",
                marginBottom: 20,
              }}
            >
              Навигация
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px 32px",
              }}
            >
              {[
                { href: "#problem", label: "Как это работает" },
                { href: "#benefits", label: "Преимущества" },
                { href: "#how", label: "Процесс" },
                { href: "#demo", label: "Демо-чат" },
                { href: "#testimonials", label: "Отзывы" },
                { href: "#niches", label: "Для кого" },
                { href: "#whyme", label: "Подход" },
                { href: "#contact", label: "Контакты" },
              ].map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  style={{
                    color: "rgba(245,241,232,0.6)",
                    textDecoration: "none",
                    fontSize: 14,
                    fontWeight: 500,
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "white";
                    e.currentTarget.style.transform = "translateX(2px)";
                    e.currentTarget.style.display = "inline-block";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "rgba(245,241,232,0.6)";
                    e.currentTarget.style.transform = "translateX(0)";
                  }}
                >
                  {l.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            height: 1,
            background: "rgba(255,255,255,0.08)",
          }}
        />
      </div>
    </footer>
  );
}
