// src/components/ui/input.tsx
import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, value = '', ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium text-[#17403a]">
            {label}
          </label>
        )}
        <input
          value={value}
          className={cn(
            "w-full px-3 py-2 text-sm",
            "border border-[#e7decf] rounded-md",
            "bg-white text-[#001c30]",
            "focus:outline-none focus:border-[#17403a] focus:ring-1 focus:ring-[#17403a]",
            "placeholder:text-gray-400",
            "disabled:cursor-not-allowed disabled:opacity-50",
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

Input.displayName = "Input";

export { Input };