"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Truck, Package, MapPin, Clock, Mail } from "lucide-react";
import LandingNavbar from "@/components/LandingNavbar";

export default function ShippingPolicyPage() {
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
      <title>Shipping Policy - {siteName}</title>
      <div className="min-h-screen bg-white">
        <Navbar currentPage="shipping-policy" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Truck className="w-4 h-4" />
              <span>Delivery Information</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Shipping Policy
            </h1>
            <p className="text-xl text-gray-600">
              Information about our farm product delivery and shipping services.
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
                Overview
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  {siteName} offers fresh farm products and organic produce
                  delivery services to guests and local customers. This policy
                  outlines our shipping procedures, delivery areas, and terms
                  for product shipments.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Available Products
                </h2>
              </div>
              <div className="space-y-4 text-gray-700">
                <h3 className="text-lg font-semibold">Fresh Farm Produce</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Organic vegetables (seasonal availability)</li>
                  <li>Fresh fruits from our orchards</li>
                  <li>Farm-fresh dairy products</li>
                  <li>Free-range eggs</li>
                  <li>Homemade preserves and pickles</li>
                  <li>Organic grains and pulses</li>
                </ul>

                <h3 className="text-lg font-semibold">
                  Farm Experience Packages
                </h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Welcome gift baskets for guests</li>
                  <li>Organic cooking ingredient kits</li>
                  <li>Farm-to-table meal packages</li>
                  <li>Seasonal harvest boxes</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Delivery Areas
                </h2>
              </div>
              <div className="space-y-4 text-gray-700">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-green-50 border-l-4 border-green-400 p-4">
                    <h3 className="text-lg font-semibold text-green-800 mb-2">
                      Local Delivery (Free)
                    </h3>
                    <ul className="text-green-700 space-y-1">
                      <li>• Within 10km radius</li>
                      <li>• Same-day delivery available</li>
                      <li>• Minimum order: ₹500</li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                    <h3 className="text-lg font-semibold text-blue-800 mb-2">
                      Regional Delivery
                    </h3>
                    <ul className="text-blue-700 space-y-1">
                      <li>• Hyderabad & surrounding areas</li>
                      <li>• 1-2 business days</li>
                      <li>• Delivery charges apply</li>
                    </ul>
                  </div>
                </div>

                <h3 className="text-lg font-semibold">Delivery Charges</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="border border-gray-300 px-4 py-2 text-left">
                          Distance
                        </th>
                        <th className="border border-gray-300 px-4 py-2 text-left">
                          Delivery Time
                        </th>
                        <th className="border border-gray-300 px-4 py-2 text-left">
                          Charges
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">
                          0-10 km
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          Same day
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          Free (min ₹500)
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">
                          10-25 km
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          Next day
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          ₹50
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">
                          25-50 km
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          1-2 days
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          ₹100
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Delivery Timeline
                </h2>
              </div>
              <div className="space-y-4 text-gray-700">
                <h3 className="text-lg font-semibold">Order Processing</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Orders placed before 2 PM: Same-day processing</li>
                  <li>Orders placed after 2 PM: Next-day processing</li>
                  <li>Weekend orders processed on Monday</li>
                  <li>Holiday delays may apply</li>
                </ul>

                <h3 className="text-lg font-semibold">Delivery Windows</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold">Morning Slot</h4>
                    <p>8:00 AM - 12:00 PM</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Evening Slot</h4>
                    <p>2:00 PM - 6:00 PM</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Packaging & Handling
              </h2>
              <div className="space-y-4 text-gray-700">
                <h3 className="text-lg font-semibold">
                  Fresh Produce Packaging
                </h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Eco-friendly, biodegradable packaging materials</li>
                  <li>Temperature-controlled containers for dairy products</li>
                  <li>Protective packaging to prevent damage during transit</li>
                  <li>
                    Clear labeling with product information and expiry dates
                  </li>
                </ul>

                <h3 className="text-lg font-semibold">Quality Assurance</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Products harvested fresh on the day of delivery</li>
                  <li>Quality checks before packaging</li>
                  <li>Proper storage during transportation</li>
                  <li>Hygiene protocols followed throughout the process</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Order Tracking
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>Stay updated on your order status:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Order confirmation via SMS and email</li>
                  <li>Dispatch notification with estimated delivery time</li>
                  <li>Real-time tracking for regional deliveries</li>
                  <li>Delivery confirmation with photo proof</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Special Handling
              </h2>
              <div className="space-y-4 text-gray-700">
                <h3 className="text-lg font-semibold">Perishable Items</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    Insulated packaging for temperature-sensitive products
                  </li>
                  <li>Ice packs included for dairy and meat products</li>
                  <li>Priority delivery for highly perishable items</li>
                  <li>Customer notification for immediate collection</li>
                </ul>

                <h3 className="text-lg font-semibold">Bulk Orders</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Special arrangements for orders above ₹5,000</li>
                  <li>Advance notice required (24-48 hours)</li>
                  <li>Possible discounts on delivery charges</li>
                  <li>Flexible delivery scheduling</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Delivery Issues
              </h2>
              <div className="space-y-4 text-gray-700">
                <h3 className="text-lg font-semibold">
                  Failed Delivery Attempts
                </h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Three delivery attempts will be made</li>
                  <li>Customer notification before each attempt</li>
                  <li>Alternative delivery arrangements can be made</li>
                  <li>Storage charges may apply after 48 hours</li>
                </ul>

                <h3 className="text-lg font-semibold">
                  Damaged or Missing Items
                </h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Report issues within 2 hours of delivery</li>
                  <li>Photo evidence required for damage claims</li>
                  <li>Replacement or refund provided for valid claims</li>
                  <li>Investigation process for missing items</li>
                </ul>
              </div>
            </section>

            <div className="bg-purple-50 rounded-lg p-6 mt-12">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Order or Delivery Questions?
                </h3>
              </div>
              <p className="text-gray-700">
                For orders, delivery inquiries, or to report issues, contact us
                at{" "}
                <a
                  href={`mailto:${contactEmail}`}
                  className="text-purple-600 hover:text-purple-800"
                >
                  {contactEmail}
                </a>{" "}
                or call our delivery team directly.
              </p>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}
