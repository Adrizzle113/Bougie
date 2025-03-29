// src/components/admin/tripdetails/tabs/textarea.tsx
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium text-[#17403a]">
            {label}
          </label>
        )}
        <textarea
          className={cn(
            "w-full min-h-[100px] px-3 py-2 text-sm",
            "border border-[#e7decf] rounded-md",
            "bg-white text-[#001c30]",
            "focus:outline-none focus:border-[#17403a] focus:ring-1 focus:ring-[#17403a]",
            "placeholder:text-gray-400",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "resize-vertical",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
export { Textarea };