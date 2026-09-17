import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Drop Dead — Olivia Rodrigo | ASCII Music Player",
  description: "Retro OLED ASCII Dot-Matrix Web Music Player & Waveform Visualizer for Drop Dead by Olivia Rodrigo",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⚡</text></svg>",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jetbrainsMono.variable} dark h-full overflow-hidden`}>
      <body className="h-full w-full bg-black text-white antialiased font-mono overflow-hidden select-none fixed inset-0">
        {children}
      </body>
    </html>
  );
}
