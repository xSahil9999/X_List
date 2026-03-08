import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "h-10 w-full rounded-lg border border-borderSoft bg-panel px-3 text-sm text-textMain placeholder:text-textMuted focus:border-accent focus:outline-none",
      className
    )}
    {...props}
  />
));

Input.displayName = "Input";
