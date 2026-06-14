import type { Stats } from "../../../../shared/src/schemas";

interface ReadingDNAProps {
  stats: Stats;
}

const COLORS = ["#FFEB3B", "#FF5252", "#2196F3", "#4CAF50", "#FF9800", "#9C27B0", "#00BCD4", "#F44336"];

export function ReadingDNA({ stats }: ReadingDNAProps) {
  const genres = stats.genreBreakdown.slice(0, 7);

  return (
    <div
      className="border-3 border-black bg-white p-6"
      style={{ borderWidth: "3px", boxShadow: "4px 4px 0 #000" }}
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-black text-black">Reading DNA</h2>
          <p className="text-xs font-bold text-black/50 mt-0.5 uppercase tracking-wide">
            {stats.genresExplored} genres explored
          </p>
        </div>
        <div
          className="border-2 border-black px-3 py-1.5 bg-[#FFEB3B]"
        >
          <span className="text-sm font-black">
            Diversity {stats.diversityScore}
            <span className="text-black/50">/100</span>
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {genres.map((item, i) => (
          <div key={item.genre} className="flex items-center gap-3">
            <div className="w-28 text-xs font-bold text-black truncate flex-shrink-0 text-right">
              {item.genre}
            </div>
            <div className="flex-1 h-7 border-2 border-black bg-[#f5f5f5] overflow-hidden relative">
              <div
                className="h-full border-r-2 border-black transition-all"
                style={{
                  width: `${item.percentage}%`,
                  backgroundColor: COLORS[i % COLORS.length],
                }}
              />
              <span className="absolute inset-0 flex items-center px-2 text-xs font-black text-black">
                {item.count} {item.count === 1 ? "book" : "books"}
              </span>
            </div>
            <div className="w-12 text-right text-sm font-black text-black flex-shrink-0">
              {item.percentage}%
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t-2 border-black">
        {genres.map((item, i) => (
          <div key={item.genre} className="flex items-center gap-1.5">
            <div
              className="w-3 h-3 border border-black flex-shrink-0"
              style={{ backgroundColor: COLORS[i % COLORS.length] }}
            />
            <span className="text-xs font-bold text-black">{item.genre}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
