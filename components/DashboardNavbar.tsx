"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

interface DashboardNavbarProps {
  currentPage?: string;
  siteName?: string;
}

export default function DashboardNavbar({
  currentPage,
  siteName = "FarmStay Oasis",
}: DashboardNavbarProps) {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            href="/dashboard"
            className="flex items-center space-x-2 cursor-pointer"
          >
            <Image
              src="https://zrzgqsfudgsbnrcmmfvk.supabase.co/storage/v1/object/public/images/logos/logo-1752963729950.png"
              alt={`${siteName} Logo`}
              width={32}
              height={32}
              className="w-8 h-8 rounded-lg"
            />
            <span className="text-xl font-bold text-green-800">{siteName}</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button
                variant={currentPage === "dashboard" ? "default" : "ghost"}
                className="cursor-pointer"
              >
                Dashboard
              </Button>
            </Link>
            <Link href="/dashboard/properties">
              <Button
                variant={currentPage === "properties" ? "default" : "ghost"}
                className="cursor-pointer"
              >
                Properties
              </Button>
            </Link>
            <Link href="/dashboard/analytics">
              <Button
                variant={currentPage === "analytics" ? "default" : "ghost"}
                className="cursor-pointer"
              >
                Analytics
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
