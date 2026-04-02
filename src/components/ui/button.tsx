"use client";

import { forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "destructive" | "outline" | "donate";
  size?: "sm" | "md" | "lg" | "icon";
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(
          // Base — refined, geometric, confident
          "inline-flex items-center justify-center gap-2 font-semibold tracking-wide transition-all duration-250 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",

          // Variants
          {
            // Primary — brand indigo, clean and authoritative
            "bg-primary-500 text-white rounded-lg hover:bg-primary-600 active:scale-[0.98] shadow-[0_2px_8px_rgba(47,49,146,0.25)] hover:shadow-[0_4px_16px_rgba(47,49,146,0.35)]":
              variant === "primary",

            // Secondary — soft neutral, understated
            "bg-neutral-100 text-neutral-700 rounded-lg border border-neutral-200 hover:bg-neutral-200 hover:text-neutral-900 active:scale-[0.98]":
              variant === "secondary",

            // Outline — indigo border, transparent fill, converts on hover
            "bg-transparent text-primary-600 rounded-lg border-2 border-primary-400/60 hover:bg-primary-500 hover:text-white hover:border-primary-500 active:scale-[0.98] shadow-none hover:shadow-[0_2px_8px_rgba(47,49,146,0.2)]":
              variant === "outline",

            // Ghost — minimal, text-only presence
            "bg-transparent text-neutral-500 rounded-lg hover:text-neutral-800 hover:bg-neutral-100 active:scale-[0.98]":
              variant === "ghost",

            // Donate — warm orange, inviting, the emotional CTA
            "bg-secondary-500 text-white rounded-lg hover:bg-secondary-600 active:scale-[0.98] shadow-[0_2px_8px_rgba(240,125,26,0.25)] hover:shadow-[0_4px_16px_rgba(240,125,26,0.35)]":
              variant === "donate",

            // Destructive
            "bg-red-600 text-white rounded-lg hover:bg-red-700 active:scale-[0.98]":
              variant === "destructive",
          },

          // Sizes — generous padding, balanced proportions
          {
            "h-9 px-4 text-[13px]": size === "sm",
            "h-11 px-6 text-sm": size === "md",
            "h-[52px] px-8 text-[15px]": size === "lg",
            "h-10 w-10": size === "icon",
          },

          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
