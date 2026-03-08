"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger";

const styles: Record<Variant, string> = {
  primary: "bg-accent text-slate-900 hover:bg-accentMuted",
  secondary: "bg-panelSoft text-textMain hover:bg-borderSoft",
  ghost: "bg-transparent text-textMain hover:bg-panelSoft",
  danger: "bg-red-500/85 text-red-50 hover:bg-red-500"
};

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export const Button = forwardRef<HTMLButtonElement, Props>(({ className, variant = "primary", ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center gap-2 rounded-lg border border-transparent px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60",
      styles[variant],
      className
    )}
    {...props}
  />
));

Button.displayName = "Button";
