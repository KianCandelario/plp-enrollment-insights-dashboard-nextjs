import type { Metadata } from "next";
import "./globals.css";

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
        className={`antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
