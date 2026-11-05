import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { SITE_URL, DEFAULT_OG_IMAGE, organizationJsonLd } from "@/lib/seo";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});


export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "A New Day Foundation | Founded by Dawnn Lewis | Youth Empowerment in Los Angeles",
    template: "%s | A New Day Foundation",
  },
  description:
    "Founded in 2017 by Grammy Award-winning artist Dawnn Lewis, A New Day Foundation gives teens ages 13–19 the mentors, experiences, and skills to build their futures.",
  applicationName: "A New Day Foundation",
  keywords: [
    "A New Day Foundation",
    "ANDF",
    "Dawnn Lewis",
    "youth nonprofit Los Angeles",
    "youth mentorship",
    "Focused N F.I.T.",
    "financial literacy for teens",
    "Band Camp",
    "Topgolf family experiences",
    "HBCU Heroes",
    "501(c)(3)",
  ],
  authors: [{ name: "A New Day Foundation" }],
  creator: "A New Day Foundation",
  publisher: "A New Day Foundation",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "A New Day Foundation",
    title: "A New Day Foundation | Founded by Dawnn Lewis",
    description:
      "Every young person deserves a new day. Mentors, real-world experiences, and scholarships for teens ages 13–19.",
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "A New Day Foundation | Founded by Dawnn Lewis",
    description:
      "Every young person deserves a new day. Mentors, real-world experiences, and scholarships for teens ages 13–19.",
    images: [DEFAULT_OG_IMAGE.url],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  category: "nonprofit",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
        />
        {children}
      </body>
    </html>
  );
}
