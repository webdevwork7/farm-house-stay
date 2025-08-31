"use client";

import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Phone } from "lucide-react";
import Logo from "@/components/Logo";

export default function LandingNavbar() {
  const [siteName, setSiteName] = useState("Farm Feast Farm House");
  const [contactPhone, setContactPhone] = useState("+91 99999 88888");

  useEffect(() => {
    const fetchSiteSettings = async () => {
      try {
        const supabase = createClient();
        const { data: settings } = await supabase
          .from("site_settings")
          .select("key, value");

        if (settings) {
          settings.forEach((setting: { key: string; value: string }) => {
            if (setting.key === "site_name") setSiteName(setting.value);
            if (setting.key === "contact_phone") setContactPhone(setting.value);
          });
        }
      } catch (error) {
        console.error("Error fetching site settings:", error);
      }
    };

    fetchSiteSettings();
  }, []);

  const handleCall = () => {
    window.open(`tel:${contactPhone}`, "_self");
  };

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-green-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Logo siteName={siteName} size="md" showText={false} />

          <Button
            size="lg"
            onClick={handleCall}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 cursor-pointer"
          >
            <Phone className="w-4 h-4 mr-2" />
            Call Now
          </Button>
        </div>
      </div>
    </nav>
  );
}
