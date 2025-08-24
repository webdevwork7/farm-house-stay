"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, ArrowLeft, Search } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1500076656116-558758c991c1?w=600&h=400&fit=crop"
              alt="Lost in the countryside"
              className="w-full max-w-md mx-auto rounded-2xl shadow-lg"
            />
            <div className="absolute inset-0 bg-black/20 rounded-2xl flex items-center justify-center">
              <div className="text-white text-8xl font-bold opacity-80">404</div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Oops! You've Wandered Off the Farm</h1>
          <p className="text-xl text-gray-600 mb-2">
            The page you're looking for seems to have gone on a countryside adventure.
          </p>
          <p className="text-gray-500">Don't worry, even the best explorers sometimes take a wrong turn!</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
            <Link href="/" className="flex items-center gap-2">
              <Home className="w-5 h-5" />
              Back to Home
            </Link>
          </Button>

          <Button asChild variant="outline" size="lg">
            <Link href="/properties" className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Browse Properties
            </Link>
          </Button>

          <Button variant="ghost" size="lg" onClick={() => window.history.back()} className="flex items-center gap-2">
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </Button>
        </div>

        {/* Helpful Links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-500 mb-4">Looking for something specific?</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/about" className="text-green-600 hover:text-green-700 hover:underline">
              About Us
            </Link>
            <Link href="/contact" className="text-green-600 hover:text-green-700 hover:underline">
              Contact
            </Link>
            <Link href="/properties" className="text-green-600 hover:text-green-700 hover:underline">
              All Properties
            </Link>
            <Link href="/auth/login" className="text-green-600 hover:text-green-700 hover:underline">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
