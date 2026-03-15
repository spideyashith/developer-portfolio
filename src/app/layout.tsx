import type { Metadata } from "next";
import { Orbitron, Rajdhani, Fira_Code } from "next/font/google";
import "./globals.css";
import WarpSpeedBackground from "@/components/WarpSpeedBackground";
import AlienChat from "@/components/AlienChat";
import TacticalCursor from "@/components/TacticalCursor";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
});

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

const firaCode = Fira_Code({
  variable: "--font-geist-mono", // Keep the same variable name for globals.css mapping
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Commander | Portfolio",
  description: "AI/ML Research Intern & Full-Stack Developer Data Vault",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${orbitron.variable} ${rajdhani.variable} ${firaCode.variable} antialiased selection:bg-cyan-500/30 selection:text-cyan-50 min-h-screen text-foreground bg-obsidian`}
      >
        <WarpSpeedBackground />
        <main className="relative z-10">{children}</main>
        <AlienChat />
        <TacticalCursor />
      </body>
    </html>
  );
}
