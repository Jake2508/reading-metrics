import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
}

const variants = {
  primary: "bg-[#FFEB3B] text-black hover:bg-yellow-400",
  secondary: "bg-white text-black hover:bg-gray-50",
  danger: "bg-[#FF5252] text-white hover:bg-red-500",
  ghost: "bg-transparent text-black hover:bg-gray-100",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm font-bold",
  md: "px-4 py-2 text-sm font-bold",
  lg: "px-6 py-3 text-base font-bold",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled}
      className={`
        border-2 border-black font-bold transition-all duration-150 cursor-pointer
        ${variants[variant]}
        ${sizes[size]}
        ${disabled ? "opacity-50 cursor-not-allowed" : "hover:-translate-y-0.5 active:translate-y-0"}
        ${className}
      `}
      style={{ boxShadow: disabled ? "none" : "3px 3px 0 #000", ...(!disabled ? {} : {}) }}
    >
      {children}
    </button>
  );
}
