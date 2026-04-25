import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Unfold",
  description: "Source-grounded multilingual exam coaching for certification students."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
