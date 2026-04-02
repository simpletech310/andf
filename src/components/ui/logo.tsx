import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: number;
  variant?: "default" | "light";
}

export function Logo({ className, size = 40, variant = "default" }: LogoProps) {
  return (
    <div
      className={cn("shrink-0 relative", className)}
      style={{ width: size, height: size }}
    >
      <Image
        src="/images/logo/andf-logo.png"
        alt="A New Day Foundation"
        fill
        className={cn(
          "object-contain",
          variant === "light" && "mix-blend-screen"
        )}
        sizes={`${size}px`}
        priority
      />
    </div>
  );
}
