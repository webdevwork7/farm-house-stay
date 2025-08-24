import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "FarmStay Oasis - Premium Farm House Rentals in Hyderabad",
  description:
    "Escape to luxury farm houses within 40 miles of Hyderabad. Perfect for family getaways, corporate retreats, and special celebrations. Book your authentic farmstay experience today.",
  keywords:
    "farmstay, farm house rental, Hyderabad, weekend getaway, rural tourism, farm vacation, family retreat",
  authors: [{ name: "FarmStay Oasis" }],
  creator: "FarmStay Oasis",
  publisher: "FarmStay Oasis",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://farmstayoasis.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "FarmStay Oasis - Premium Farm House Rentals in Hyderabad",
    description:
      "Escape to luxury farm houses within 40 miles of Hyderabad. Perfect for family getaways, corporate retreats, and special celebrations.",
    url: "https://farmstayoasis.com",
    siteName: "FarmStay Oasis",
    images: [
      {
        url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=630&fit=crop",
        width: 1200,
        height: 630,
        alt: "Luxury farmhouse with pool - FarmStay Oasis",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FarmStay Oasis - Premium Farm House Rentals",
    description:
      "Escape to luxury farm houses within 40 miles of Hyderabad. Book your authentic farmstay experience today.",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=630&fit=crop",
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#16a34a" },
    ],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
