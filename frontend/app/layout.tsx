import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ValidatorOS",
  description: "High-Authority Executive Brief Generator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased dark"
    >
      <body className={`${outfit.className} min-h-full flex flex-col bg-zinc-950 text-zinc-50`}>{children}</body>
    </html>
  );
}
