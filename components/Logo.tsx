import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  siteName?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export default function Logo({
  siteName = "Farm Feast Farm House",
  size = "md",
  showText = true,
}: LogoProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  return (
    <Link href="/" className="flex items-center space-x-3 cursor-pointer group">
      <div className="relative">
        <Image
          src="https://zrzgqsfudgsbnrcmmfvk.supabase.co/storage/v1/object/public/images/logos/logo-1752963729950.png"
          alt={`${siteName} Logo`}
          width={size === "lg" ? 48 : size === "md" ? 32 : 24}
          height={size === "lg" ? 48 : size === "md" ? 32 : 24}
          className={`${sizeClasses[size]} rounded-lg shadow-sm group-hover:shadow-md transition-shadow duration-200`}
        />
        {/* Optional glow effect */}
        <div className="absolute inset-0 rounded-lg bg-green-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 blur-sm -z-10"></div>
      </div>
      {showText && (
        <div className="flex flex-col">
          <span
            className={`${textSizeClasses[size]} font-bold text-green-800 group-hover:text-green-700 transition-colors duration-200`}
          >
            {siteName}
          </span>
          {size === "lg" && (
            <span className="text-xs text-green-600 font-medium tracking-wide">
              Premium Farm Stays
            </span>
          )}
        </div>
      )}
    </Link>
  );
}
