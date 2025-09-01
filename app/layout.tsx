import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/lib/auth/AuthProvider";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import Script from "next/script";

async function getSiteSettings() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const { data: settings } = await supabase
    .from("site_settings")
    .select("key, value");

  const settingsMap: Record<string, string> = {
    site_name: "Farm Feast Farm House",
    hero_description:
      "Escape to luxury farm houses within 40 miles of Hyderabad. Perfect for family getaways, corporate retreats, and special celebrations.",
  };

  settings?.forEach((setting) => {
    settingsMap[setting.key] = setting.value;
  });

  return settingsMap;
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const siteName = settings.site_name || "Farm Feast Farm House";
  const description =
    settings.hero_description ||
    "Escape to luxury farm houses within 40 miles of Hyderabad. Perfect for family getaways, corporate retreats, and special celebrations.";
  const logoUrl =
    "https://zrzgqsfudgsbnrcmmfvk.supabase.co/storage/v1/object/public/images/logos/logo-1752963729950.png";

  return {
    title: {
      default: `${siteName} - Premium Farm House Rentals`,
      template: `%s - ${siteName}`,
    },
    description: description,
    keywords:
      "farmstay, farm house rental, Hyderabad, weekend getaway, rural tourism, farm vacation, family retreat, authentic farm experience",
    authors: [{ name: siteName }],
    creator: siteName,
    publisher: siteName,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL("https://farm-stay.vercel.app"),
    alternates: {
      canonical: "/",
    },
    openGraph: {
      title: `${siteName} - Premium Farm House Rentals`,
      description: description,
      url: "https://farm-stay.vercel.app",
      siteName: siteName,
      images: [
        {
          url: logoUrl,
          width: 1200,
          height: 630,
          alt: `${siteName} - Premium Farm House Rentals`,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${siteName} - Premium Farm House Rentals`,
      description: description,
      images: [logoUrl],
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
        { url: logoUrl, sizes: "16x16", type: "image/png" },
        { url: logoUrl, sizes: "32x32", type: "image/png" },
      ],
      apple: [{ url: logoUrl, sizes: "180x180", type: "image/png" }],
      shortcut: logoUrl,
    },
    manifest: "/site.webmanifest",
  };
}

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
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-17515421909"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            // Main config
            gtag('config', 'AW-17515421909');

            // Phone conversion config
            gtag('config', 'AW-17515421909/0hV7CMCKiJIbENXBgKBB', {
              'phone_conversion_number': '+91 8897326898'
            });

            // Custom conversion function
            function gtag_report_conversion(url) {
              var callback = function () {
                if (typeof(url) != 'undefined') {
                  window.location = url;
                }
              };
              gtag('event', 'conversion', {
                'send_to': 'AW-17515421909/XEwVCOuGk5IbENXBgKBB',
                'event_callback': callback
              });
              return false;
            }
          `}
        </Script>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
