import type { Stats } from "../../../../shared/src/schemas";
import { Badge } from "../../components/ui/Badge";

interface FeaturedAuthorProps {
  stats: Stats;
}

export function FeaturedAuthor({ stats }: FeaturedAuthorProps) {
  const { topAuthor } = stats;

  if (!topAuthor) {
    return (
      <div
        className="border-3 border-black p-6 bg-[#FFEB3B] flex items-center justify-center h-full"
        style={{ borderWidth: "3px", boxShadow: "4px 4px 0 #000" }}
      >
        <p className="font-bold text-black/60">No author data yet</p>
      </div>
    );
  }

  const topAuthorBooks = stats.authorBreakdown.find((a) => a.author === topAuthor.name);

  return (
    <div
      className="border-3 border-black bg-[#FFEB3B] p-6 flex flex-col gap-4 h-full"
      style={{ borderWidth: "3px", boxShadow: "4px 4px 0 #000" }}
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-black/50">
            Top Author
          </span>
          <h2 className="text-3xl font-black text-black mt-1 leading-tight">
            {topAuthor.name}
          </h2>
        </div>
        <Badge color="black">#1</Badge>
      </div>

      <div className="flex gap-3 mt-auto">
        <div className="border-2 border-black bg-white p-3 flex-1 text-center">
          <div className="text-2xl font-black text-black">{topAuthor.bookCount}</div>
          <div className="text-xs font-bold text-black/60 uppercase mt-0.5">Books</div>
        </div>
        <div className="border-2 border-black bg-white p-3 flex-1 text-center">
          <div className="text-2xl font-black text-black">{topAuthor.percentage}%</div>
          <div className="text-xs font-bold text-black/60 uppercase mt-0.5">Of Library</div>
        </div>
        <div className="border-2 border-black bg-white p-3 flex-1 text-center">
          <div className="text-2xl font-black text-black">
            {topAuthorBooks ? Math.round(topAuthorBooks.pages / topAuthorBooks.count) : "—"}
          </div>
          <div className="text-xs font-bold text-black/60 uppercase mt-0.5">Avg Pages</div>
        </div>
      </div>

      <div>
        <div className="text-xs font-bold text-black/50 uppercase mb-1.5">Library Share</div>
        <div className="h-4 border-2 border-black bg-white overflow-hidden">
          <div
            className="h-full bg-black transition-all"
            style={{ width: `${topAuthor.percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}
