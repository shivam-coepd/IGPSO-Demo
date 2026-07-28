import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "45-Day Business Training Internship in Indore | IGPSO",
  description: "Explore IGPSO's 45-day internship and business training program in Indore covering communication, HR, marketing, export, production, logistics and practical industrial exposure.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hi" className="scroll-smooth">
      <body className="min-h-screen bg-ivory text-navy">{children}</body>
    </html>
  );
}
