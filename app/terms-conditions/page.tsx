"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FileText, Users, CreditCard, AlertTriangle, Mail } from "lucide-react";

export default function TermsConditionsPage() {
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
      <title>Terms & Conditions - {siteName}</title>
      <div className="min-h-screen bg-white">
        <Navbar currentPage="terms-conditions" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <FileText className="w-4 h-4" />
              <span>Legal Terms</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Terms & Conditions
            </h1>
            <p className="text-xl text-gray-600">
              Please read these terms carefully before using our services.
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <p className="text-gray-700 mb-0">
                <strong>Last Updated:</strong> January 2025
              </p>
            </div>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Acceptance of Terms
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  By accessing and using {siteName} services, you accept and
                  agree to be bound by the terms and provision of this
                  agreement. If you do not agree to abide by the above, please
                  do not use this service.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Booking Terms
                </h2>
              </div>
              <div className="space-y-4 text-gray-700">
                <h3 className="text-lg font-semibold">
                  Reservation Requirements
                </h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>All bookings must be made by guests 18 years or older</li>
                  <li>Valid identification is required at check-in</li>
                  <li>Maximum occupancy limits must be respected</li>
                  <li>Advance booking confirmation is required</li>
                </ul>

                <h3 className="text-lg font-semibold">Check-in/Check-out</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Standard check-in time: 2:00 PM</li>
                  <li>Standard check-out time: 11:00 AM</li>
                  <li>Early check-in/late check-out subject to availability</li>
                  <li>Additional charges may apply for extended stays</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Payment Terms
                </h2>
              </div>
              <div className="space-y-4 text-gray-700">
                <h3 className="text-lg font-semibold">Payment Policy</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>50% advance payment required to confirm booking</li>
                  <li>Remaining balance due at check-in</li>
                  <li>Accepted payment methods: Cash, UPI, Bank Transfer</li>
                  <li>All prices are inclusive of applicable taxes</li>
                </ul>

                <h3 className="text-lg font-semibold">Cancellation Policy</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Free cancellation up to 48 hours before check-in</li>
                  <li>50% refund for cancellations within 24-48 hours</li>
                  <li>No refund for same-day cancellations or no-shows</li>
                  <li>Weather-related cancellations handled case-by-case</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Guest Responsibilities
              </h2>
              <div className="space-y-4 text-gray-700">
                <h3 className="text-lg font-semibold">Property Care</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Treat the property and facilities with respect</li>
                  <li>Report any damages immediately</li>
                  <li>Follow all safety guidelines and instructions</li>
                  <li>Maintain cleanliness and hygiene standards</li>
                </ul>

                <h3 className="text-lg font-semibold">Conduct Guidelines</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Respect other guests and local community</li>
                  <li>No smoking in designated non-smoking areas</li>
                  <li>Pets allowed only with prior approval</li>
                  <li>Quiet hours: 10:00 PM to 7:00 AM</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-red-100 text-red-600 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Liability and Safety
                </h2>
              </div>
              <div className="space-y-4 text-gray-700">
                <h3 className="text-lg font-semibold">
                  Limitation of Liability
                </h3>
                <p>
                  While we strive to provide a safe environment, guests
                  participate in farm activities at their own risk. {siteName}{" "}
                  is not liable for:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Personal injuries during farm activities</li>
                  <li>Loss or damage to personal belongings</li>
                  <li>Weather-related disruptions</li>
                  <li>Third-party services or activities</li>
                </ul>

                <h3 className="text-lg font-semibold">Safety Guidelines</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Follow all posted safety instructions</li>
                  <li>Supervise children at all times</li>
                  <li>Use protective equipment when provided</li>
                  <li>Report safety concerns immediately</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Prohibited Activities
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>The following activities are strictly prohibited:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Illegal drug use or excessive alcohol consumption</li>
                  <li>Disturbing farm animals or crops</li>
                  <li>Unauthorized access to restricted areas</li>
                  <li>Commercial photography without permission</li>
                  <li>Littering or environmental damage</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Modifications and Termination
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>We reserve the right to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Modify these terms at any time</li>
                  <li>Terminate bookings for violation of terms</li>
                  <li>Refuse service to any guest</li>
                  <li>Update pricing and policies</li>
                </ul>
              </div>
            </section>

            <div className="bg-green-50 rounded-lg p-6 mt-12">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Questions?</h3>
              </div>
              <p className="text-gray-700">
                If you have any questions about these Terms & Conditions, please
                contact us at{" "}
                <a
                  href={`mailto:${contactEmail}`}
                  className="text-green-600 hover:text-green-800"
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
