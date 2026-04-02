import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Автоматизация заявок — настраиваю систему сбора обращений для малого бизнеса",
  description: "Настраиваю систему, которая отвечает клиентам, собирает заявки и отправляет уведомления. Для салонов красоты, клиник, мастеров и локального бизнеса.",
  keywords: "автоматизация заявок, сбор заявок, чат на сайте, уведомления telegram, для малого бизнеса",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Jura:wght@400;500&family=Manrope:wght@400;500;600;700&display=swap&subset=cyrillic" rel="stylesheet" />
      </head>
      <body>
        <a href="#main-content" className="skip-link">
          Перейти к содержимому
        </a>
        <div id="main-content">{children}</div>
      </body>
    </html>
  );
}
