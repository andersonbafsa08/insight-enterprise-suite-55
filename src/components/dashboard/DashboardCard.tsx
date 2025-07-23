import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface DashboardCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  badge?: {
    text: string;
    variant?: "default" | "secondary" | "destructive" | "outline";
  };
  className?: string;
}

export function DashboardCard({
  title,
  value,
  description,
  icon,
  trend,
  badge,
  className,
}: DashboardCardProps) {
  return (
    <Card className={`transition-shadow hover:shadow-md ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="h-4 w-4 text-muted-foreground">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-foreground">
              {value}
            </div>
            {badge && (
              <Badge variant={badge.variant || "secondary"}>
                {badge.text}
              </Badge>
            )}
          </div>
          
          {description && (
            <p className="text-xs text-muted-foreground">
              {description}
            </p>
          )}
          
          {trend && (
            <div className="flex items-center space-x-1">
              <span
                className={`text-xs font-medium ${
                  trend.isPositive
                    ? "text-accent"
                    : "text-destructive"
                }`}
              >
                {trend.isPositive ? "+" : ""}
                {trend.value}%
              </span>
              <span className="text-xs text-muted-foreground">
                em relação ao mês anterior
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}