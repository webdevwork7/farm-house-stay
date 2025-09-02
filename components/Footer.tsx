"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Phone } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  const [siteName, setSiteName] = useState("Farm Feast Farm House");
  const [contactPhone, setContactPhone] = useState("+91 99999 88888");
  const [contactEmail, setContactEmail] = useState(
    "info@farmfeastfarmhouse.com"
  );

  useEffect(() => {
    fetchSiteSettings();
  }, []);

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
          if (setting.key === "contact_email") setContactEmail(setting.value);
        });
      }
    } catch (error) {
      console.error("Error fetching site settings:", error);
    }
  };

  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">FS</span>
              </div>
              <span className="text-xl font-bold">{siteName}</span>
            </div>
            <p className="text-gray-400">
              Connecting travelers with authentic farm experiences across India.
              Discover the beauty of rural life.
            </p>
            <div className="flex items-center space-x-2 text-gray-400">
              <Phone className="w-4 h-4" />
              <span>{contactPhone}</span>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <div className="space-y-2">
              <Link
                href="/properties"
                className="block text-gray-400 hover:text-white transition-colors"
              >
                Browse Properties
              </Link>
              <Link
                href="/about"
                className="block text-gray-400 hover:text-white transition-colors"
              >
                About Us
              </Link>
              <Link
                href="/contact"
                className="block text-gray-400 hover:text-white transition-colors"
              >
                Contact
              </Link>
              <Link
                href="/auth/register"
                className="block text-gray-400 hover:text-white transition-colors"
              >
                Sign Up
              </Link>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">For Hosts</h3>
            <div className="space-y-2">
              <Link
                href="/auth/register"
                className="block text-gray-400 hover:text-white transition-colors"
              >
                List Your Property
              </Link>
              <Link
                href="/dashboard"
                className="block text-gray-400 hover:text-white transition-colors"
              >
                Owner Dashboard
              </Link>
              <Link
                href="/contact"
                className="block text-gray-400 hover:text-white transition-colors"
              >
                Host Support
              </Link>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Legal</h3>
            <div className="space-y-2">
              <Link
                href="/privacy-policy"
                className="block text-gray-400 hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms-conditions"
                className="block text-gray-400 hover:text-white transition-colors"
              >
                Terms & Conditions
              </Link>
              <Link
                href="/return-policy"
                className="block text-gray-400 hover:text-white transition-colors"
              >
                Return Policy
              </Link>
              <Link
                href="/disclaimer"
                className="block text-gray-400 hover:text-white transition-colors"
              >
                Disclaimer
              </Link>
              <Link
                href="/shipping-policy"
                className="block text-gray-400 hover:text-white transition-colors"
              >
                Shipping Policy
              </Link>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Info</h3>
            <div className="space-y-2 text-gray-400">
              <p>{contactEmail}</p>
              <p>{contactPhone}</p>
              <p>Hyderabad, Telangana</p>
              <p>Available 24/7</p>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-center md:text-left">
              &copy; 2025 {siteName}. All rights reserved. | Bringing you closer
              to nature, one farm at a time.
            </p>
            <div className="flex flex-wrap justify-center md:justify-end gap-4 text-sm">
              <Link
                href="/privacy-policy"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/terms-conditions"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Terms
              </Link>
              <Link
                href="/return-policy"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Returns
              </Link>
              <Link
                href="/disclaimer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Disclaimer
              </Link>
              <Link
                href="/shipping-policy"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Shipping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
