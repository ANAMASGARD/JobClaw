import type { Metadata } from "next";
import { Archivo_Black, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Web3Provider } from "@/providers/Web3Provider";

const archivoBlack = Archivo_Black({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-head",
  display: "swap",
});

const space = Space_Grotesk({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "JobClaw",
  description: "Autonomous job-hunting agent — discover, personalize, and apply with onchain accountability",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "dark h-full antialiased font-sans",
        archivoBlack.variable,
        space.variable,
      )}
    >
      <body className="min-h-full flex flex-col">
        <Web3Provider>{children}</Web3Provider>
      </body>
    </html>
  );
}
