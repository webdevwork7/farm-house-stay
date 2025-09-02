"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AlertTriangle, Shield, Info, ExternalLink, Mail } from "lucide-react";
import LandingNavbar from "@/components/LandingNavbar";

export default function DisclaimerPage() {
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
      <title>Disclaimer - {siteName}</title>
      <div className="min-h-screen bg-white">
        <Navbar currentPage="disclaimer" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <AlertTriangle className="w-4 h-4" />
              <span>Important Notice</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Disclaimer
            </h1>
            <p className="text-xl text-gray-600">
              Important information about the use of our services and website.
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
                General Disclaimer
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  The information contained in this website is for general
                  information purposes only. While we endeavor to keep the
                  information up to date and correct, we make no representations
                  or warranties of any kind, express or implied, about the
                  completeness, accuracy, reliability, suitability, or
                  availability with respect to the website or the information,
                  products, services, or related graphics contained on the
                  website for any purpose.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-red-100 text-red-600 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Limitation of Liability
                </h2>
              </div>
              <div className="space-y-4 text-gray-700">
                <p>
                  In no event will {siteName} be liable for any loss or damage
                  including without limitation:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Indirect or consequential loss or damage</li>
                  <li>
                    Loss of data or profits arising out of or in connection with
                    the use of this website
                  </li>
                  <li>
                    Personal injury or property damage during farm activities
                  </li>
                  <li>Weather-related disruptions or natural disasters</li>
                  <li>Third-party services or recommendations</li>
                  <li>Technical issues or website downtime</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Farm Activity Risks
                </h2>
              </div>
              <div className="space-y-4 text-gray-700">
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                    Assumption of Risk
                  </h3>
                  <p className="text-yellow-700">
                    Farm activities involve inherent risks. Guests participate
                    at their own risk and are responsible for their own safety
                    and that of their children.
                  </p>
                </div>

                <h3 className="text-lg font-semibold">
                  Potential Risks Include:
                </h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Interaction with farm animals</li>
                  <li>Uneven terrain and outdoor surfaces</li>
                  <li>Agricultural equipment and tools</li>
                  <li>Weather-related hazards</li>
                  <li>Allergic reactions to plants or animals</li>
                  <li>Insect bites and outdoor exposure</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                  <Info className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Information Accuracy
                </h2>
              </div>
              <div className="space-y-4 text-gray-700">
                <h3 className="text-lg font-semibold">Website Content</h3>
                <p>While we strive to provide accurate information:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Property descriptions may vary from actual conditions</li>
                  <li>
                    Photos are representative and may not reflect current state
                  </li>
                  <li>Amenities and services subject to availability</li>
                  <li>Pricing and policies may change without notice</li>
                  <li>Seasonal variations may affect described features</li>
                </ul>

                <h3 className="text-lg font-semibold">Booking Information</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Availability is subject to real-time confirmation</li>
                  <li>Rates may fluctuate based on demand and season</li>
                  <li>Special offers have terms and conditions</li>
                  <li>Group bookings require separate agreements</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
                  <ExternalLink className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Third-Party Services
                </h2>
              </div>
              <div className="space-y-4 text-gray-700">
                <p>
                  Our website may contain links to third-party websites or
                  services:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    We have no control over third-party content or services
                  </li>
                  <li>
                    We do not endorse or assume responsibility for third-party
                    offerings
                  </li>
                  <li>Use of third-party services is at your own risk</li>
                  <li>Third-party terms and conditions apply separately</li>
                  <li>Payment processing may involve third-party providers</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Health and Safety
              </h2>
              <div className="space-y-4 text-gray-700">
                <div className="bg-red-50 border-l-4 border-red-400 p-4">
                  <h3 className="text-lg font-semibold text-red-800 mb-2">
                    Medical Conditions
                  </h3>
                  <p className="text-red-700">
                    Guests with medical conditions, allergies, or physical
                    limitations should consult healthcare providers before
                    participating in farm activities.
                  </p>
                </div>

                <h3 className="text-lg font-semibold">
                  Safety Recommendations
                </h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Follow all posted safety guidelines</li>
                  <li>Wear appropriate clothing and footwear</li>
                  <li>Supervise children at all times</li>
                  <li>Report any safety concerns immediately</li>
                  <li>Carry personal medications and emergency contacts</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Intellectual Property
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  All content on this website is protected by copyright and
                  other intellectual property laws:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    Unauthorized reproduction or distribution is prohibited
                  </li>
                  <li>Images and content are for viewing purposes only</li>
                  <li>Commercial use requires written permission</li>
                  <li>
                    Trademarks and logos are property of respective owners
                  </li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Governing Law
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  This disclaimer is governed by and construed in accordance
                  with the laws of India. Any disputes relating to this
                  disclaimer will be subject to the exclusive jurisdiction of
                  the courts of Hyderabad, Telangana.
                </p>
              </div>
            </section>

            <div className="bg-red-50 rounded-lg p-6 mt-12">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-red-100 text-red-600 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Questions or Concerns?
                </h3>
              </div>
              <p className="text-gray-700">
                If you have any questions about this disclaimer or need
                clarification on any points, please contact us at{" "}
                <a
                  href={`mailto:${contactEmail}`}
                  className="text-red-600 hover:text-red-800"
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
