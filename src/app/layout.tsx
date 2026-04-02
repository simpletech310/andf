import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "A New Day Foundation | Empowering Tomorrow's Leaders",
    template: "%s | A New Day Foundation",
  },
  description:
    "A New Day Foundation creates transformative experiences for young people through music, technology, mentorship, and community.",
  keywords: [
    "nonprofit",
    "youth empowerment",
    "mentorship",
    "music education",
    "STEM",
    "community",
    "Los Angeles",
    "foundation",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "A New Day Foundation",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        {children}
      </body>
    </html>
  );
}
