import { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "h-10 w-full rounded-lg border border-borderSoft bg-panel px-3 text-sm text-textMain focus:border-accent focus:outline-none",
        className
      )}
      {...props}
    />
  );
}
