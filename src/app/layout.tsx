import type { Metadata } from "next";
import "./globals.css";
import { GeistSans } from "geist/font/sans";

export const metadata: Metadata = {
  title: "PLP Enrollment Dashboard",
  description: "A website that provides insights about PLP Enrollment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${GeistSans.className} antialiased text-[#303030]`}
      >
        {children}
      </body>
    </html>
  );
}
