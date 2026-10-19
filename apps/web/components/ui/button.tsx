import * as React from "react";

type ButtonVariant = "default" | "primary" | "destructive" | "outline" | "secondary" | "ghost" | "link";
type ButtonSize = "default" | "sm" | "lg" | "icon";

const base =
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

const variantClasses: Record<ButtonVariant, string> = {
  default: "bg-ink text-white hover:opacity-90",
  primary: "bg-primary-600 text-white hover:bg-primary-500",
  destructive: "bg-destructive/60 text-white hover:bg-destructive",
  outline: "border border-ink/20 bg-transparent hover:bg-ink/5 text-ink",
  secondary: "bg-ink/10 text-ink hover:bg-ink/15",
  ghost: "hover:bg-ink/5 text-ink",
  link: "underline-offset-4 hover:underline text-primary-600",
};

const sizeClasses: Record<ButtonSize, string> = {
  default: "h-10 px-4 py-2",
  sm: "h-9 rounded-md px-3",
  lg: "h-11 rounded-md px-8",
  icon: "h-10 w-10",
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => (
    <button
      ref={ref}
      className={`${base} ${variantClasses[variant]} ${sizeClasses[size]} ${
        className ?? ""
      }`}
      {...props}
    />
  )
);
Button.displayName = "Button";

export { Button };
