import type { Metadata } from "next";
import { Inter, Space_Grotesk as SpaceGrotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

const spaceGrotest = SpaceGrotesk({
  variable: "--font-space-grotesk",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DevFlow",
  description: "A better version of Stack Overflow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} ${spaceGrotest.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
