import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-foreground-muted">
            {label}
          </label>
        )}
        <textarea
          id={id}
          className={cn(
            "flex min-h-[120px] w-full rounded-lg bg-background-elevated border border-border px-4 py-3 text-foreground placeholder:text-foreground-subtle transition-colors duration-200 resize-y",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary-500",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-red-500 focus:ring-red-500/40",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
