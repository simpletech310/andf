import { type LucideIcon } from "lucide-react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  trend?: {
    value: string;
    up: boolean;
  };
  iconColor?: string;
  iconBg?: string;
}

export function StatCard({
  icon: Icon,
  value,
  label,
  trend,
  iconColor = "text-gold-500",
  iconBg = "bg-gold-500/10",
}: StatCardProps) {
  return (
    <Card hover={false}>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center", iconBg)}>
            <Icon className={cn("h-5 w-5", iconColor)} />
          </div>
          {trend && (
            <div
              className={cn(
                "flex items-center gap-1 text-xs font-medium",
                trend.up ? "text-emerald-400" : "text-red-400"
              )}
            >
              {trend.up ? (
                <ArrowUpRight className="h-3 w-3" />
              ) : (
                <ArrowDownRight className="h-3 w-3" />
              )}
              {trend.value}
            </div>
          )}
        </div>
        <div className="mt-4">
          <div className="text-2xl font-bold text-foreground">{value}</div>
          <div className="text-xs text-foreground-subtle mt-1">{label}</div>
        </div>
      </CardContent>
    </Card>
  );
}
