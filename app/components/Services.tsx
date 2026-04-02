"use client";

const services = [
  {
    num: "I",
    title: "Интеллектуальный чат",
    desc: "Система интегрируется на сайт и моментально отвечает каждому посетителю, исключая ожидание.",
  },
  {
    num: "II",
    title: "Сбор контактных данных",
    desc: "Деликатный опрос клиента: имя, потребность, номер телефона. Без навязчивости и лишних вопросов.",
  },
  {
    num: "III",
    title: "Структурирование базы",
    desc: "Каждое обращение автоматически фиксируется в корпоративной таблице. Полный порядок в заявках.",
  },
  {
    num: "IV",
    title: "Моментальное уведомление",
    desc: "Как только клиент оставляет номер — вы сразу получаете оповещение в Telegram.",
  },
];

export default function Services() {
  return (
    <section id="services" className="section" style={{ padding: "120px 24px" }}>
      <div style={{ textAlign: "center", marginBottom: 64 }}>
        <div className="badge" style={{ marginBottom: 20 }}>Архитектура решения</div>
        <h2 style={{ fontFamily: "Jura, sans-serif",  fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 500, marginBottom: 16, letterSpacing: "-0.5px" }}>
          Что включает в себя настройка
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: 16, maxWidth: 500, margin: "0 auto", lineHeight: 1.6 }}>
          Полный цикл. От момента, когда клиент впервые написал на сайте, до готовой заявки.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24 }}>
        {services.map((s) => (
          <div key={s.title} className="card" style={{ padding: 40, borderRadius: 24, boxShadow: "none", border: "1px solid var(--border)", transition: "border-color 0.3s" }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--accent)")}
            onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--border)")}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--accent)", marginBottom: 24, letterSpacing: "1px" }}>
              {s.num}.
            </div>
            <h3 style={{ fontWeight: 500, fontSize: 18, marginBottom: 12, color: "var(--text)" }}>{s.title}</h3>
            <p style={{ color: "var(--text-muted)", fontSize: 14, lineHeight: 1.6 }}>{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
