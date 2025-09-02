"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { RotateCcw, Calendar, CreditCard, Clock, Mail } from "lucide-react";
import LandingNavbar from "@/components/LandingNavbar";

export default function ReturnPolicyPage() {
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
      <title>Return Policy - {siteName}</title>
      <div className="min-h-screen bg-white">
        <Navbar currentPage="return-policy" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <RotateCcw className="w-4 h-4" />
              <span>Refund Policy</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Return Policy
            </h1>
            <p className="text-xl text-gray-600">
              Understanding our cancellation and refund policies for your
              bookings.
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
                  <Calendar className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Cancellation Timeline
                </h2>
              </div>
              <div className="space-y-6 text-gray-700">
                <div className="bg-green-50 border-l-4 border-green-400 p-4">
                  <h3 className="text-lg font-semibold text-green-800 mb-2">
                    48+ Hours Before Check-in
                  </h3>
                  <p className="text-green-700">
                    <strong>100% Refund:</strong> Full refund of all payments
                    made, including advance booking amount.
                  </p>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                    24-48 Hours Before Check-in
                  </h3>
                  <p className="text-yellow-700">
                    <strong>50% Refund:</strong> 50% of the total booking amount
                    will be refunded. Processing fee may apply.
                  </p>
                </div>

                <div className="bg-red-50 border-l-4 border-red-400 p-4">
                  <h3 className="text-lg font-semibold text-red-800 mb-2">
                    Less than 24 Hours / No-Show
                  </h3>
                  <p className="text-red-700">
                    <strong>No Refund:</strong> No refund will be provided for
                    same-day cancellations or no-shows.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Refund Process
                </h2>
              </div>
              <div className="space-y-4 text-gray-700">
                <h3 className="text-lg font-semibold">
                  How to Request a Refund
                </h3>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>Contact us immediately via phone or email</li>
                  <li>Provide your booking reference number</li>
                  <li>Specify the reason for cancellation</li>
                  <li>Submit any required documentation</li>
                </ol>

                <h3 className="text-lg font-semibold">Refund Timeline</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Cash Payments:</strong> Immediate refund upon
                    cancellation
                  </li>
                  <li>
                    <strong>UPI/Bank Transfer:</strong> 2-3 business days
                  </li>
                  <li>
                    <strong>Credit/Debit Cards:</strong> 5-7 business days
                  </li>
                  <li>
                    <strong>Online Wallets:</strong> 1-2 business days
                  </li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Special Circumstances
                </h2>
              </div>
              <div className="space-y-4 text-gray-700">
                <h3 className="text-lg font-semibold">
                  Weather-Related Cancellations
                </h3>
                <p>
                  In case of severe weather conditions that make travel unsafe:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Full refund or rescheduling option available</li>
                  <li>Official weather warnings must be in effect</li>
                  <li>Alternative dates subject to availability</li>
                </ul>

                <h3 className="text-lg font-semibold">Medical Emergencies</h3>
                <p>For genuine medical emergencies:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Medical certificate required for verification</li>
                  <li>Case-by-case evaluation for refund eligibility</li>
                  <li>Rescheduling preferred over refund when possible</li>
                </ul>

                <h3 className="text-lg font-semibold">Force Majeure Events</h3>
                <p>
                  For events beyond our control (natural disasters, government
                  restrictions):
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Full refund or credit for future booking</li>
                  <li>No penalty charges applied</li>
                  <li>Flexible rescheduling options</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Modification Policy
              </h2>
              <div className="space-y-4 text-gray-700">
                <h3 className="text-lg font-semibold">Date Changes</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Free date change up to 48 hours before check-in</li>
                  <li>Subject to availability of new dates</li>
                  <li>Price difference may apply for peak seasons</li>
                  <li>Only one free modification allowed per booking</li>
                </ul>

                <h3 className="text-lg font-semibold">Guest Count Changes</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Reduction in guests: Partial refund available</li>
                  <li>Increase in guests: Additional charges apply</li>
                  <li>Changes subject to property capacity limits</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Non-Refundable Items
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>The following are non-refundable under any circumstances:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Processing fees and transaction charges</li>
                  <li>Third-party service bookings (tours, activities)</li>
                  <li>Special event or festival bookings</li>
                  <li>Group booking deposits (10+ people)</li>
                  <li>Add-on services already consumed</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Dispute Resolution
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>If you disagree with our refund decision:</p>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>Contact our customer service team within 7 days</li>
                  <li>Provide detailed explanation and supporting documents</li>
                  <li>Allow 3-5 business days for review</li>
                  <li>Final decision will be communicated via email</li>
                </ol>
              </div>
            </section>

            <div className="bg-orange-50 rounded-lg p-6 mt-12">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Need Help?</h3>
              </div>
              <p className="text-gray-700">
                For cancellations or refund requests, contact us immediately at{" "}
                <a
                  href={`mailto:${contactEmail}`}
                  className="text-orange-600 hover:text-orange-800"
                >
                  {contactEmail}
                </a>{" "}
                or call our support team.
              </p>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}
