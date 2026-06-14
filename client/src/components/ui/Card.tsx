import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  color?: "yellow" | "red" | "blue" | "white" | "black";
}

const colorMap = {
  yellow: "bg-[#FFEB3B]",
  red: "bg-[#FF5252]",
  blue: "bg-[#2196F3]",
  white: "bg-white",
  black: "bg-black text-white",
};

export function Card({ children, className = "", color = "white" }: CardProps) {
  return (
    <div
      className={`border-3 border-black shadow-brutal p-5 ${colorMap[color]} ${className}`}
      style={{ borderWidth: "3px", boxShadow: "4px 4px 0 #000" }}
    >
      {children}
    </div>
  );
}
