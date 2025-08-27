"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { createClient } from "@/lib/supabase/client";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  HeadphonesIcon,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [siteName, setSiteName] = useState("Farm Feast Farm House");
  const [contactPhone, setContactPhone] = useState("+91 99999 88888");
  const [contactEmail, setContactEmail] = useState(
    "info@farmfeastfarmhouse.com"
  );
  const { toast } = useToast();

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
        settings.forEach((setting) => {
          if (setting.key === "site_name") setSiteName(setting.value);
          if (setting.key === "contact_phone") setContactPhone(setting.value);
          if (setting.key === "contact_email") setContactEmail(setting.value);
        });
      }
    } catch (error) {
      console.error("Error fetching site settings:", error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
    toast({
      title: "Message Sent Successfully! 📧",
      description:
        "Thank you for your message! We'll get back to you within 24 hours.",
      duration: 5000,
    });
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <>
      <title>Contact Us - {siteName}</title>
      <div className="min-h-screen">
        {/* Navigation */}
        <Navbar currentPage="contact" />

        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-green-50 via-blue-50 to-amber-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-6">
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                Get In Touch
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900">
                Contact <span className="text-green-600">Us</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Have questions about farmstays or need help with your booking?
                We're here to help you plan the perfect rural getaway.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Form & Info */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <Card className="border-0 shadow-xl">
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h2 className="text-2xl font-bold text-gray-900">
                        Send us a Message
                      </h2>
                      <p className="text-gray-600">
                        Fill out the form below and we'll get back to you within
                        24 hours.
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label
                            htmlFor="name"
                            className="text-sm font-medium text-gray-700"
                          >
                            Full Name
                          </label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Your full name"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label
                            htmlFor="email"
                            className="text-sm font-medium text-gray-700"
                          >
                            Email Address
                          </label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="your@email.com"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label
                            htmlFor="phone"
                            className="text-sm font-medium text-gray-700"
                          >
                            Phone Number
                          </label>
                          <Input
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder={contactPhone}
                          />
                        </div>
                        <div className="space-y-2">
                          <label
                            htmlFor="subject"
                            className="text-sm font-medium text-gray-700"
                          >
                            Subject
                          </label>
                          <Input
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            placeholder="How can we help?"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label
                          htmlFor="message"
                          className="text-sm font-medium text-gray-700"
                        >
                          Message
                        </label>
                        <Textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Tell us more about your inquiry..."
                          rows={5}
                          required
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
                      >
                        Send Message
                      </Button>
                    </form>

                    {/* Map Section */}
                    <div className="mt-8 pt-8 border-t">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Find Us Here
                      </h3>
                      <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center relative overflow-hidden">
                        <iframe
                          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d243647.3160407725!2d78.24323!3d17.4123!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb99daeaebd2c7%3A0xae93b78392bafbc2!2sHyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1640000000000!5m2!1sen!2sin"
                          width="100%"
                          height="100%"
                          style={{ border: 0 }}
                          allowFullScreen
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          className="rounded-lg"
                          title={`${siteName} Location`}
                        />
                        <div className="absolute inset-0 bg-gray-300 flex items-center justify-center rounded-lg">
                          <div className="text-center text-gray-600">
                            <MapPin className="w-12 h-12 mx-auto mb-2" />
                            <p className="font-medium">Hyderabad, Telangana</p>
                            <p className="text-sm">{siteName}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <div className="space-y-8">
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Get in Touch
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    We're always happy to help! Whether you're planning your
                    next farmstay adventure or looking to list your property,
                    our team is here to assist you.
                  </p>
                </div>

                <div className="space-y-6">
                  {[
                    {
                      icon: Phone,
                      title: "Phone Support",
                      content: contactPhone,
                      subtitle: "Available 24/7 for urgent inquiries",
                      color: "bg-green-100 text-green-600",
                    },
                    {
                      icon: Mail,
                      title: "Email Support",
                      content: contactEmail,
                      subtitle: "We'll respond within 24 hours",
                      color: "bg-blue-100 text-blue-600",
                    },
                    {
                      icon: MapPin,
                      title: "Office Location",
                      content: "Hyderabad, Telangana",
                      subtitle: "India - 500001",
                      color: "bg-red-100 text-red-600",
                    },
                    {
                      icon: Clock,
                      title: "Business Hours",
                      content: "Mon - Sun: 9:00 AM - 9:00 PM",
                      subtitle: "Emergency support available 24/7",
                      color: "bg-amber-100 text-amber-600",
                    },
                  ].map((item, index) => (
                    <Card key={index} className="border-0 shadow-lg">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div
                            className={`w-12 h-12 ${
                              item.color.split(" ")[0]
                            } rounded-full flex items-center justify-center flex-shrink-0`}
                          >
                            <item.icon
                              className={`w-6 h-6 ${item.color.split(" ")[1]}`}
                            />
                          </div>
                          <div className="space-y-1">
                            <h3 className="font-semibold text-gray-900">
                              {item.title}
                            </h3>
                            <p className="text-gray-900 font-medium">
                              {item.content}
                            </p>
                            <p className="text-sm text-gray-600">
                              {item.subtitle}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 to-blue-50">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                        <HeadphonesIcon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          Need Immediate Help?
                        </h3>
                        <p className="text-sm text-gray-600">
                          Call us now for instant support
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-gray-600">
                Quick answers to common questions
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  question: "How do I book a farmstay?",
                  answer:
                    "Simply browse our properties, select your dates, and book instantly through our secure platform. You'll receive confirmation within minutes.",
                },
                {
                  question: "What's included in a farmstay booking?",
                  answer:
                    "Each farmstay includes accommodation, basic amenities, and access to farm activities. Meals and additional services vary by property and are clearly listed.",
                },
                {
                  question: "Can I cancel or modify my booking?",
                  answer:
                    "Yes, you can cancel or modify your booking up to 48 hours before check-in. Cancellation policies vary by property and are shown during booking.",
                },
                {
                  question: "How do I list my farm property?",
                  answer:
                    "Click 'List Your Property' to get started. Our team will guide you through the verification process and help you create an attractive listing.",
                },
                {
                  question: "Is customer support available 24/7?",
                  answer:
                    "Yes, we provide 24/7 phone support for urgent matters. For general inquiries, email support is available with responses within 24 hours.",
                },
              ].map((faq, index) => (
                <Card key={index} className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <MessageCircle className="w-5 h-5 text-green-600 mr-2" />
                        {faq.question}
                      </h3>
                      <p className="text-gray-600 leading-relaxed pl-7">
                        {faq.answer}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-white">
              Ready to Start Your Adventure?
            </h2>
            <p className="text-xl text-green-100">
              Don't wait! Browse our amazing farmstay properties and book your
              perfect rural getaway today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/properties">
                <Button
                  size="lg"
                  className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3"
                >
                  Browse Properties
                </Button>
              </Link>
              <Link href="/auth/sign-up">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 px-8 py-3 bg-transparent"
                >
                  Sign Up Now
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
