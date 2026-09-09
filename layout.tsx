import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import PWARegister from "@/components/PWARegister";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap"
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap"
});

export const metadata: Metadata = {
  title: "Aesthetic Fashion — Diário Editorial",
  description:
    "Curadoria visual e mensagens pessoais sobre moda: inspiração, estilo e atitude.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" }
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }]
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Aesthetic Fashion"
  }
};

export const viewport: Viewport = {
  themeColor: "#2A2522"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${playfair.variable} ${inter.variable}`}>
      <body className="font-body">
        <PWARegister />
        {children}
      </body>
    </html>
  );
}
