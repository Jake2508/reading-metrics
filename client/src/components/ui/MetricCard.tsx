interface MetricCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  color?: "yellow" | "red" | "blue" | "white";
  size?: "sm" | "md" | "lg";
}

const colorMap = {
  yellow: "bg-[#FFEB3B]",
  red: "bg-[#FF5252] text-white",
  blue: "bg-[#2196F3] text-white",
  white: "bg-white",
};

export function MetricCard({ label, value, subtitle, color = "white", size = "md" }: MetricCardProps) {
  const isLight = color === "yellow" || color === "white";
  const padding = size === "sm" ? "p-3" : "p-5";
  const valueSize = size === "lg" ? "text-4xl" : size === "sm" ? "text-2xl" : "text-3xl";
  const subtitleSize = size === "sm" ? "text-xs" : "text-sm";
  return (
    <div
      className={`border-3 border-black ${padding} flex flex-col gap-0.5 ${colorMap[color]}`}
      style={{ borderWidth: "3px", boxShadow: "4px 4px 0 #000" }}
    >
      <span className={`text-xs font-bold uppercase tracking-widest ${isLight ? "text-black/60" : "text-white/70"}`}>
        {label}
      </span>
      <span className={`font-black leading-none ${valueSize} ${isLight ? "text-black" : "text-white"}`}>
        {value}
      </span>
      {subtitle && (
        <span className={`${subtitleSize} font-semibold ${isLight ? "text-black/70" : "text-white/80"}`}>
          {subtitle}
        </span>
      )}
    </div>
  );
}
