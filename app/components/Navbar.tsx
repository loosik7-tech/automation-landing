"use client";
import { useState, useEffect } from "react";

const navLinks = [
  { href: "#problem", label: "Зачем" },
  { href: "#how", label: "Процесс" },
  { href: "#demo", label: "Демо-чат" },
  { href: "#niches", label: "Для кого" },
];

const iconButtonStyle: React.CSSProperties = {
  width: 44,
  height: 44,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 12,
  border: "1px solid rgba(95, 127, 91, 0.25)",
  color: "#4F6F4B",
  background: "rgba(95, 127, 91, 0.06)",
  textDecoration: "none",
  transition: "all 0.2s ease",
};

function TelegramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M22 3L11 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 3L15 21L11 13L3 9L22 3Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20 11.5C20 16.1944 16.1944 20 11.5 20C10.02 20 8.628 19.622 7.414 18.958L4 20L5.094 16.744C4.39 15.499 4 14.06 4 12.5C4 7.80558 7.80558 4 12.5 4C17.1944 4 21 7.80558 21 12.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.2 9.6C9.2 9.6 9.5 8.8 10.1 8.8C10.7 8.8 11.3 10.2 11.3 10.2C11.3 10.2 11.4 10.6 11.1 10.9L10.7 11.3C10.7 11.3 10.6 11.5 10.8 11.8C11 12.2 11.8 13.3 13.3 14C13.3 14 13.6 14.2 13.9 13.9L14.4 13.5C14.4 13.5 14.7 13.3 15.1 13.4C15.1 13.4 16.5 14 16.5 14.6C16.5 15.2 15.8 15.6 15.8 15.6C15.8 15.6 14.9 16.2 13.2 15.5C11.5 14.8 10.2 13.2 9.6 12.2C9 11.2 8.7 10.3 9.2 9.6Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <nav
      role="navigation"
      aria-label="Основная навигация"
      style={{
        padding: "12px 0",
        transition: "box-shadow 0.3s ease",
        boxShadow: scrolled ? "0 4px 24px rgba(47,47,47,0.04)" : "none",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: 60,
          position: "relative",
        }}
      >
        <div
          style={{ display: "flex", gap: 32, alignItems: "center" }}
          className="desktop-nav"
        >
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              style={{
                textDecoration: "none",
                color: "var(--text-muted)",
                fontWeight: 500,
                fontSize: 14,
                transition: "color 0.2s",
                position: "relative",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.color = "var(--text)";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.color = "var(--text-muted)";
              }}
            >
              {l.label}
            </a>
          ))}

          <div
            style={{
              marginLeft: 16,
              display: "flex",
              gap: 8,
              alignItems: "center",
            }}
          >
            <a
              href="https://wa.me/79670040505"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Написать в WhatsApp"
              style={iconButtonStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(95, 127, 91, 0.12)";
                e.currentTarget.style.borderColor = "rgba(95, 127, 91, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(95, 127, 91, 0.06)";
                e.currentTarget.style.borderColor = "rgba(95, 127, 91, 0.25)";
              }}
            >
              <WhatsAppIcon />
            </a>
            <a
              href="https://t.me/automshh"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Написать в Telegram"
              style={iconButtonStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(95, 127, 91, 0.12)";
                e.currentTarget.style.borderColor = "rgba(95, 127, 91, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(95, 127, 91, 0.06)";
                e.currentTarget.style.borderColor = "rgba(95, 127, 91, 0.25)";
              }}
            >
              <TelegramIcon />
            </a>
          </div>
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: "none",
            border: "none",
            background: "transparent",
            cursor: "pointer",
            padding: 8,
            position: "absolute",
            right: 24,
            top: "50%",
            transform: "translateY(-50%)",
          }}
          className="burger-btn"
          aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
          aria-expanded={menuOpen}
        >
          <div
            style={{
              width: 22,
              height: 2,
              background: "var(--text)",
              borderRadius: 2,
              marginBottom: 6,
              transition: "all 0.25s ease",
              transform: menuOpen
                ? "rotate(45deg) translate(5px, 5px)"
                : "none",
            }}
          />
          <div
            style={{
              width: 22,
              height: 2,
              background: "var(--text)",
              borderRadius: 2,
              marginBottom: 6,
              transition: "all 0.25s ease",
              opacity: menuOpen ? 0 : 1,
            }}
          />
          <div
            style={{
              width: 22,
              height: 2,
              background: "var(--text)",
              borderRadius: 2,
              transition: "all 0.25s ease",
              transform: menuOpen
                ? "rotate(-45deg) translate(5px, -5px)"
                : "none",
            }}
          />
        </button>
      </div>

      {menuOpen && (
        <div
          style={{
            background: "var(--bg)",
            borderTop: "1px solid var(--border)",
            padding: "16px 24px 24px",
            position: "fixed",
            top: "var(--nav-height)",
            width: "100%",
            left: 0,
            boxShadow: "var(--shadow-soft)",
            zIndex: 99,
            animation: "fadeIn 0.2s ease",
            height: "calc(100vh - var(--nav-height))",
          }}
        >
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              style={{
                display: "block",
                padding: "16px 0",
                textDecoration: "none",
                color: "var(--text)",
                fontWeight: 500,
                borderBottom: "1px solid var(--border)",
                fontSize: 16,
                transition: "color 0.2s",
              }}
            >
              {l.label}
            </a>
          ))}
          <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
            <a
              href="https://wa.me/79670040505"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              aria-label="Написать в WhatsApp"
              style={iconButtonStyle}
            >
              <WhatsAppIcon />
            </a>
            <a
              href="https://t.me/automshh"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              aria-label="Написать в Telegram"
              style={iconButtonStyle}
            >
              <TelegramIcon />
            </a>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .burger-btn { display: block !important; }
        }
      `}</style>
    </nav>
  );
}
