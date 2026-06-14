interface MetricCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  color?: "yellow" | "red" | "blue" | "white";
  size?: "md" | "lg";
}

const colorMap = {
  yellow: "bg-[#FFEB3B]",
  red: "bg-[#FF5252] text-white",
  blue: "bg-[#2196F3] text-white",
  white: "bg-white",
};

export function MetricCard({ label, value, subtitle, color = "white", size = "md" }: MetricCardProps) {
  const isLight = color === "yellow" || color === "white";
  return (
    <div
      className={`border-3 border-black p-5 flex flex-col gap-1 ${colorMap[color]}`}
      style={{ borderWidth: "3px", boxShadow: "4px 4px 0 #000" }}
    >
      <span className={`text-xs font-bold uppercase tracking-widest ${isLight ? "text-black/60" : "text-white/70"}`}>
        {label}
      </span>
      <span className={`font-black leading-none ${size === "lg" ? "text-4xl" : "text-3xl"} ${isLight ? "text-black" : "text-white"}`}>
        {value}
      </span>
      {subtitle && (
        <span className={`text-sm font-semibold ${isLight ? "text-black/70" : "text-white/80"}`}>
          {subtitle}
        </span>
      )}
    </div>
  );
}
