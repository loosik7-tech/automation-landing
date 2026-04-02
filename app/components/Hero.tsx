"use client";

export default function Hero() {
  return (
    <section className="hero" aria-label="Главный экран">
      <div
        style={{
          maxWidth: 780,
          margin: "0 auto",
          padding: "0 24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          background: "transparent",
          boxShadow: "none",
          border: "none",
        }}
      >
        <h1
          className="hero-title animate-fadeUp"
          style={{ animationDelay: "0.1s" }}
        >
          Автоматическая обработка заявок для бизнеса
        </h1>

        <p
          className="hero-subtitle animate-fadeUp"
          style={{ animationDelay: "0.25s" }}
        >
          Для салонов, клиник и сервисов с записью: ответы клиентам за секунды,
          сбор контактов и передача заявок в CRM
        </p>

        <p
          className="hero-tertiary animate-fadeUp"
          style={{ animationDelay: "0.35s" }}
        >
          Вы перестаете терять заявки уже через 3 дня
        </p>

        <div
          className="chat animate-fadeUp"
          style={{ animationDelay: "0.45s" }}
        >
          <div className="hero-chat-card">
            <div className="hero-chat-header">
              <span
                style={{
                  display: "inline-block",
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "var(--primary)",
                  marginRight: 10,
                }}
              />
              Автоматический чат
            </div>

            <div className="hero-chat-body">
              <div className="hero-message hero-message-user">
                Добрый день, подскажите стоимость?
              </div>

              <div className="hero-message hero-message-bot">
                Стоимость зависит от задачи. Подскажите, куда отправить
                прайс-лист?
              </div>

              <div className="hero-message hero-message-user">
                +7 900 123-45-67
              </div>

              <div className="hero-typing">
                <div className="typing-dot" />
                <div className="typing-dot" />
                <div className="typing-dot" />
              </div>
            </div>
          </div>
        </div>

        <div
          className="buttons animate-fadeUp"
          style={{ animationDelay: "0.55s" }}
        >
          <a href="#contact" className="hero-link">
            <button className="text-button hero-btn-primary">
              Настроить систему
            </button>
          </a>

          <a href="#demo" className="hero-link">
            <button className="text-button hero-btn-secondary">
              Попробовать демо
            </button>
          </a>
        </div>

      </div>
    </section>
  );
}
