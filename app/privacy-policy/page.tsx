"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Shield, Lock, Eye, Database, Mail } from "lucide-react";

export default function PrivacyPolicyPage() {
  const [siteName, setSiteName] = useState("Farm Feast Farm House");
  const [contactEmail, setContactEmail] = useState(
    "info@farmfeastfarmhouse.com"
  );

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
            if (setting.key === "contact_email") setContactEmail(setting.value);
          });
        }
      } catch (error) {
        console.error("Error fetching site settings:", error);
      }
    };

    fetchSiteSettings();
  }, []);

  return (
    <>
      <title>Privacy Policy - {siteName}</title>
      <div className="min-h-screen bg-white">
        <Navbar currentPage="privacy-policy" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Shield className="w-4 h-4" />
              <span>Privacy & Security</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Privacy Policy
            </h1>
            <p className="text-xl text-gray-600">
              Your privacy is important to us. Learn how we collect, use, and
              protect your information.
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <p className="text-gray-700 mb-0">
                <strong>Last Updated:</strong> January 2025
              </p>
            </div>

            <section className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                  <Database className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Information We Collect
                </h2>
              </div>
              <div className="space-y-4 text-gray-700">
                <p>
                  We collect information you provide directly to us, such as
                  when you:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Create an account or make a booking</li>
                  <li>Contact us for support or inquiries</li>
                  <li>Subscribe to our newsletter</li>
                  <li>Participate in surveys or promotions</li>
                </ul>
                <p>
                  This may include your name, email address, phone number,
                  payment information, and booking preferences.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                  <Eye className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  How We Use Your Information
                </h2>
              </div>
              <div className="space-y-4 text-gray-700">
                <p>We use the information we collect to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Process and manage your bookings</li>
                  <li>Provide customer support and respond to inquiries</li>
                  <li>Send booking confirmations and important updates</li>
                  <li>Improve our services and user experience</li>
                  <li>Comply with legal obligations</li>
                  <li>Prevent fraud and ensure security</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
                  <Lock className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Information Sharing
                </h2>
              </div>
              <div className="space-y-4 text-gray-700">
                <p>
                  We do not sell, trade, or rent your personal information to
                  third parties. We may share your information only in the
                  following circumstances:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>With property owners to facilitate your booking</li>
                  <li>With service providers who assist in our operations</li>
                  <li>When required by law or to protect our rights</li>
                  <li>In connection with a business transfer or merger</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Data Security
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  We implement appropriate security measures to protect your
                  personal information against unauthorized access, alteration,
                  disclosure, or destruction. This includes:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Encryption of sensitive data</li>
                  <li>Secure server infrastructure</li>
                  <li>Regular security audits</li>
                  <li>Limited access to personal information</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Your Rights
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>You have the right to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Access and update your personal information</li>
                  <li>Request deletion of your data</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Request a copy of your data</li>
                  <li>Lodge a complaint with relevant authorities</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Cookies and Tracking
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  We use cookies and similar technologies to enhance your
                  experience, analyze usage, and provide personalized content.
                  You can control cookie settings through your browser
                  preferences.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Changes to This Policy
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  We may update this privacy policy from time to time. We will
                  notify you of any material changes by posting the new policy
                  on this page and updating the "Last Updated" date.
                </p>
              </div>
            </section>

            <div className="bg-blue-50 rounded-lg p-6 mt-12">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Contact Us</h3>
              </div>
              <p className="text-gray-700">
                If you have any questions about this Privacy Policy, please
                contact us at{" "}
                <a
                  href={`mailto:${contactEmail}`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  {contactEmail}
                </a>
              </p>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}
