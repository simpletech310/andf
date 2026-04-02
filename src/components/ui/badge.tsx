import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "gold" | "primary" | "secondary" | "success" | "warning" | "danger" | "info" | "outline";

export function Badge({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: BadgeVariant }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        {
          "bg-background-elevated text-foreground-muted": variant === "default",
          "bg-primary-100 text-primary-600 border border-primary-300": variant === "gold",
          "bg-primary-100 text-primary-700 border border-primary-200": variant === "primary",
          "bg-secondary-100 text-secondary-700 border border-secondary-200": variant === "secondary",
          "bg-emerald-500/20 text-emerald-400": variant === "success",
          "bg-amber-500/20 text-amber-400": variant === "warning",
          "bg-red-500/20 text-red-400": variant === "danger",
          "bg-blue-500/20 text-blue-400": variant === "info",
          "border border-border text-foreground-muted": variant === "outline",
        },
        className
      )}
      {...props}
    />
  );
}
