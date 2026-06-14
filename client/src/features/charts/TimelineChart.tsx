import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { TimelineItem } from "../../../../shared/src/schemas";

interface TimelineChartProps {
  data: TimelineItem[];
}

function formatMonth(month: string) {
  const [year, m] = month.split("-");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[parseInt(m) - 1]} '${year.slice(2)}`;
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="border-2 border-black bg-white p-3" style={{ boxShadow: "3px 3px 0 #000" }}>
      <p className="text-xs font-black uppercase">{label}</p>
      <p className="text-sm font-bold">{payload[0].value} books</p>
      {payload[1] && <p className="text-xs font-semibold text-black/60">{payload[1].value.toLocaleString()} pages</p>}
    </div>
  );
}

export function TimelineChart({ data }: TimelineChartProps) {
  if (data.length < 2) return null;

  const chartData = data.map((d) => ({ ...d, label: formatMonth(d.month) }));

  return (
    <div
      className="border-3 border-black bg-white p-5"
      style={{ borderWidth: "3px", boxShadow: "4px 4px 0 #000" }}
    >
      <h3 className="text-base font-black text-black mb-4 uppercase tracking-wide">Reading Timeline</h3>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <pattern id="hatch" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="4" stroke="#FFEB3B" strokeWidth="2" />
            </pattern>
          </defs>
          <CartesianGrid strokeDasharray="0" stroke="#000" strokeWidth={1} opacity={0.1} />
          <XAxis
            dataKey="label"
            tick={{ fontWeight: 700, fontSize: 10, fill: "#000" }}
            tickLine={{ stroke: "#000" }}
            axisLine={{ stroke: "#000", strokeWidth: 2 }}
          />
          <YAxis
            tick={{ fontWeight: 700, fontSize: 11, fill: "#000" }}
            tickLine={{ stroke: "#000" }}
            axisLine={{ stroke: "#000", strokeWidth: 2 }}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="booksCompleted"
            stroke="#000"
            strokeWidth={2}
            fill="#FFEB3B"
            fillOpacity={0.7}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
