import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "./lib/i18n/LanguageContext";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.URL ?? "https://rociodopazo.com"),
  title: "Rocío Dopazo — Arquitecta de triangulación sistémica",
  description:
    "Autora, artista y creadora de Magia para Atrevidos (MPA). Integro estructura, narrativa y arte para transformar la experiencia.",
  openGraph: {
    title: "Rocío Dopazo",
    description: "Hacer visible la configuración invisible.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
