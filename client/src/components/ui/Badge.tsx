import type { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  color?: "yellow" | "red" | "blue" | "black";
}

const colorMap = {
  yellow: "bg-[#FFEB3B] text-black",
  red: "bg-[#FF5252] text-white",
  blue: "bg-[#2196F3] text-white",
  black: "bg-black text-white",
};

export function Badge({ children, color = "black" }: BadgeProps) {
  return (
    <span
      className={`inline-block px-2 py-0.5 text-xs font-bold uppercase tracking-wide border border-black ${colorMap[color]}`}
    >
      {children}
    </span>
  );
}
