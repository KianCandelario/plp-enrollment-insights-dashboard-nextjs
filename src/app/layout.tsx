import type { Metadata } from "next";
import "./globals.css";
import { GeistSans } from "geist/font/sans";

export const metadata: Metadata = {
  title: "PLP Students' Ecological Profile Dashboard",
  description: "A website that automates report generation and provides enrollment forecasts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${GeistSans.className} antialiased text-[#303030] box-border`}
      >
        {children}
      </body>
    </html>
  );
}
