import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label className="text-sm font-bold text-black uppercase tracking-wide">
            {label}
          </label>
        )}
        <input
          ref={ref}
          {...props}
          className={`
            border-2 border-black px-3 py-2 text-sm font-medium bg-white
            focus:outline-none focus:border-black focus:ring-2 focus:ring-black focus:ring-offset-1
            placeholder:text-gray-400
            ${error ? "border-[#FF5252]" : ""}
            ${className}
          `}
        />
        {error && <span className="text-xs font-bold text-[#FF5252]">{error}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";
