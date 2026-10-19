import * as React from "react";

type BadgeVariant = "default" | "secondary" | "outline" | "success" | "warning";

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-primary-600 text-white border-transparent",
  secondary: "bg-ink/10 text-ink border-transparent",
  outline: "border border-ink/20 text-ink",
  success: "bg-emerald-100 text-emerald-700 border-transparent",
  warning: "bg-amber-100 text-amber-700 border-transparent",
};

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant;
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => (
    <div
      ref={ref}
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${variantClasses[variant]} ${className ?? ""}`}
      {...props}
    />
  )
);
Badge.displayName = "Badge";

export { Badge };
