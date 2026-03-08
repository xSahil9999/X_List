import { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "w-full rounded-lg border border-borderSoft bg-panel px-3 py-2 text-sm text-textMain placeholder:text-textMuted focus:border-accent focus:outline-none",
        className
      )}
      {...props}
    />
  );
}
