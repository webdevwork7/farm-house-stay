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

        <Script id="trackwiser-analytics" strategy="afterInteractive">
          {`
    (function() {
      // TrackWiser configuration
      var trackingCode = 'r0f0pkwt7kvdg46vi8uk';
      var apiUrl = 'https://ltluebewuhheisbbjcss.supabase.co/functions/v1/track-event';
      var heatmapApiUrl = 'https://ltluebewuhheisbbjcss.supabase.co/functions/v1/track-heatmap';
      
      // Generate or get visitor ID
      function getVisitorId() {
        var visitorId = localStorage.getItem('tw_visitor_id');
        if (!visitorId) {
          visitorId = 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
          localStorage.setItem('tw_visitor_id', visitorId);
        }
        return visitorId;
      }
      
      // Generate session ID
      function getSessionId() {
        var sessionId = sessionStorage.getItem('tw_session_id');
        if (!sessionId) {
          sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
          sessionStorage.setItem('tw_session_id', sessionId);
        }
        return sessionId;
      }
      
      // Send tracking event
      function sendEvent(eventType, eventData) {
        var data = {
          tracking_code: trackingCode,
          event_type: eventType || 'page_view',
          visitor_id: getVisitorId(),
          session_id: getSessionId(),
          page_url: window.location.href,
          referrer: document.referrer || '',
          user_agent: navigator.userAgent,
          timestamp: new Date().toISOString(),
          data: eventData || {}
        };
        
        console.log('TrackWiser: Sending event', eventType, data);
        
        fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        }).then(function(response) {
          return response.json();
        }).then(function(result) {
          if (result.success) {
            console.log('TrackWiser: Event sent successfully', result);
          } else {
            console.error('TrackWiser: Failed to send event', result);
          }
        }).catch(function(error) {
          console.error('TrackWiser: Error sending event:', error);
        });
      }
      
      // Track page view on load
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
          sendEvent('page_view');
        });
      } else {
        sendEvent('page_view');
      }
      
      // Send heatmap event
      function sendHeatmapEvent(eventType, element, x, y) {
        var elementInfo = '';
        var elementText = '';
        
        if (element) {
          elementText = element.textContent?.trim().substring(0, 100) || element.innerText?.trim().substring(0, 100) || '';
          var selector = element.tagName.toLowerCase();
          if (element.id) {
            selector += '#' + element.id;
          } else if (element.className) {
            var classes = element.className.split(' ').filter(function(c) {
              return c.length > 0 && !c.includes('bg-') && !c.includes('text-') && !c.includes('border-') && !c.includes('rounded-');
            });
            if (classes.length > 0) {
              selector += '.' + classes.slice(0, 3).join('.');
            }
          }
          if (elementText.length > 0 && elementText.length < 50) {
            elementInfo = elementText;
          } else {
            elementInfo = selector;
          }
        }
        
        var data = {
          tracking_code: trackingCode,
          event_type: eventType,
          page_url: window.location.href,
          x_position: x,
          y_position: y,
          element_selector: elementInfo,
          element_text: elementText,
          session_id: getSessionId(),
          visitor_id: getVisitorId()
        };
        
        console.log('TrackWiser: Sending heatmap event', eventType, data);
        
        fetch(heatmapApiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        }).catch(function(error) {
          console.error('TrackWiser: Error sending heatmap event', error);
        });
      }
      
      // Track clicks on important elements
      document.addEventListener('click', function(e) {
        var target = e.target;
        if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.classList.contains('trackable')) {
          sendEvent('click', {
            element: target.tagName,
            text: target.textContent || target.innerText || '',
            href: target.href || '',
            class: target.className || ''
          });
        }
        sendHeatmapEvent('click', target, e.clientX, e.clientY);
      });
      
      // Track form submissions
      document.addEventListener('submit', function(e) {
        var form = e.target;
        if (form.tagName === 'FORM') {
          sendEvent('form_submit', {
            form_id: form.id || '',
            form_name: form.name || '',
            action: form.action || ''
          });
          sendHeatmapEvent('form_submit', form, 0, 0);
        }
      });
      
      // Track scroll depth
      var maxScroll = 0;
      var lastScrollTime = 0;
      window.addEventListener('scroll', function() {
        var scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        if (scrollPercent > maxScroll && scrollPercent % 25 === 0) {
          maxScroll = scrollPercent;
          sendEvent('scroll', { depth: scrollPercent });
        }
        var now = Date.now();
        if (now - lastScrollTime > 1000) {
          sendHeatmapEvent('scroll', null, 0, window.scrollY);
          lastScrollTime = now;
        }
      });
      
      // Track hover events (throttled)
      var hoverTimeout;
      document.addEventListener('mouseover', function(e) {
        clearTimeout(hoverTimeout);
        hoverTimeout = setTimeout(function() {
          sendHeatmapEvent('hover', e.target, e.clientX, e.clientY);
        }, 500);
      });
      
      // Track time on page
      var startTime = Date.now();
      window.addEventListener('beforeunload', function() {
        var timeSpent = Math.round((Date.now() - startTime) / 1000);
        sendEvent('time_on_page', { seconds: timeSpent });
      });
      
      // Expose tracking function globally
      window.trackWiser = {
        track: sendEvent,
        getVisitorId: getVisitorId,
        getSessionId: getSessionId
      };
      
      console.log('TrackWiser Analytics initialized for Farm House');
    })();
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
