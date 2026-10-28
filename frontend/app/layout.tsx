import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dharohar AI — India's Cultural & Architectural Heritage",
  description: "Digital preservation, multilingual OCR, semantic search and spatial cartography of India's monuments and living crafts.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className="font-sans antialiased bg-white text-stone-800">
        {children}
      </body>
    </html>
  );
}
