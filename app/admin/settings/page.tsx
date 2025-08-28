"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Settings, Save, Shield } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AdminNavbar from "@/components/AdminNavbar";

interface SiteSettings {
  [key: string]: string;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>({
    site_name: "",
    site_description: "",
    contact_email: "",
    contact_phone: "",
    address: "",
    about_title: "",
    about_description: "",
    hero_title: "",
    hero_subtitle: "",
    hero_description: "",
    cta_title: "",
    cta_description: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    checkAuthAndFetchSettings();
  }, []);

  const checkAuthAndFetchSettings = async () => {
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/login");
        return;
      }

      // Check if user is admin
      const { data: userData } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();

      // Allow access if user is admin in database OR if email is admin@gmail.com
      const isAdmin =
        (userData && userData.role === "admin") ||
        user.email === "admin@gmail.com";

      if (!isAdmin) {
        toast({
          title: "Access Denied",
          description: "You don't have admin privileges.",
          variant: "destructive",
        });
        router.push("/");
        return;
      }

      // Fetch site settings
      const { data: settingsData } = await supabase
        .from("site_settings")
        .select("key, value");

      const settingsMap: SiteSettings = {
        site_name: "FarmStay Oasis",
        site_description: "Discover authentic farm experiences",
        contact_email: "info@farmstayoasis.com",
        contact_phone: "+91 99999 88888",
        address: "Hyderabad, Telangana, India",
        about_title: "About FarmStay Oasis",
        about_description:
          "We are passionate about connecting people with nature through authentic farmstay experiences. Our carefully curated collection of premium farm houses offers the perfect escape from city life.",
        hero_title: "Farm House for Rent in",
        hero_subtitle: "Hyderabad & Nearby",
        hero_description:
          "Escape to luxury farm houses within 40 miles of Hyderabad. Perfect for family getaways, corporate retreats, and special celebrations.",
        cta_title: "Ready for Your Farm Adventure?",
        cta_description:
          "Book your perfect farmstay today and create memories that will last a lifetime.",
      };

      settingsData?.forEach((setting) => {
        settingsMap[setting.key] = setting.value;
      });

      setSettings(settingsMap);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const supabase = createClient();

      // Update each setting
      for (const [key, value] of Object.entries(settings)) {
        const { error } = await supabase
          .from("site_settings")
          .upsert({ key, value }, { onConflict: "key" });

        if (error) throw error;
      }

      toast({
        title: "Settings Updated Successfully! ✅",
        description:
          "Site settings have been saved and will be reflected across the platform.",
        duration: 5000,
      });
    } catch (error) {
      console.error("Error updating settings:", error);
      toast({
        title: "Update Failed",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <title>Site Settings - Admin Panel</title>
      <div className="min-h-screen bg-gray-50">
        <AdminNavbar currentPage="settings" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Site Settings</h1>
            <p className="text-gray-600">Configure your platform settings</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <span>General Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="site_name">Site Name</Label>
                  <Input
                    id="site_name"
                    value={settings.site_name}
                    onChange={(e) =>
                      handleInputChange("site_name", e.target.value)
                    }
                    placeholder="FarmStay Oasis"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact_email">Contact Email</Label>
                  <Input
                    id="contact_email"
                    type="email"
                    value={settings.contact_email}
                    onChange={(e) =>
                      handleInputChange("contact_email", e.target.value)
                    }
                    placeholder="info@farmstayoasis.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="site_description">Site Description</Label>
                <Textarea
                  id="site_description"
                  value={settings.site_description}
                  onChange={(e) =>
                    handleInputChange("site_description", e.target.value)
                  }
                  placeholder="Discover authentic farm experiences..."
                  rows={3}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="contact_phone">Contact Phone</Label>
                  <Input
                    id="contact_phone"
                    value={settings.contact_phone}
                    onChange={(e) =>
                      handleInputChange("contact_phone", e.target.value)
                    }
                    placeholder="+91 99999 88888"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={settings.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    placeholder="Hyderabad, Telangana, India"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="about_title">About Section Title</Label>
                <Input
                  id="about_title"
                  value={settings.about_title}
                  onChange={(e) =>
                    handleInputChange("about_title", e.target.value)
                  }
                  placeholder="About FarmStay Oasis"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="about_description">
                  About Section Description
                </Label>
                <Textarea
                  id="about_description"
                  value={settings.about_description}
                  onChange={(e) =>
                    handleInputChange("about_description", e.target.value)
                  }
                  placeholder="We specialize in premium farm house rentals..."
                  rows={4}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="hero_title">Hero Title</Label>
                  <Input
                    id="hero_title"
                    value={settings.hero_title}
                    onChange={(e) =>
                      handleInputChange("hero_title", e.target.value)
                    }
                    placeholder="Farm House for Rent in"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hero_subtitle">Hero Subtitle</Label>
                  <Input
                    id="hero_subtitle"
                    value={settings.hero_subtitle}
                    onChange={(e) =>
                      handleInputChange("hero_subtitle", e.target.value)
                    }
                    placeholder="Hyderabad & Nearby"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="hero_description">Hero Description</Label>
                <Textarea
                  id="hero_description"
                  value={settings.hero_description}
                  onChange={(e) =>
                    handleInputChange("hero_description", e.target.value)
                  }
                  placeholder="Escape to luxury farm houses..."
                  rows={3}
                />
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? "Saving..." : "Save Settings"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
