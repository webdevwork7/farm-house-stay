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
    sm: "w-18 h-18",
    md: "w-24 h-24",
    lg: "w-28 h-28",
  };

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  return (
    <Link href="/" className="flex items-center space-x-2 cursor-pointer group">
      <div className="relative flex-shrink-0">
        <Image
          src="https://zrzgqsfudgsbnrcmmfvk.supabase.co/storage/v1/object/public/images/logos/logo-1752963729950.png"
          alt={`${siteName} Logo`}
          width={size === "lg" ? 112 : size === "md" ? 96 : 72}
          height={size === "lg" ? 112 : size === "md" ? 96 : 72}
          className={`${sizeClasses[size]} object-contain group-hover:scale-105 transition-transform duration-200`}
          priority
        />
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
