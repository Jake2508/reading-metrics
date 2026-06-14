import { useStats } from "./hooks/useStats";
import { HeroStats } from "./HeroStats";
import { FeaturedAuthor } from "./FeaturedAuthor";
import { FeaturedBook } from "./FeaturedBook";
import { ReadingDNA } from "./ReadingDNA";
import { InsightCards } from "./InsightCards";
import { GenreBarChart } from "../charts/GenreBarChart";
import { AuthorBarChart } from "../charts/AuthorBarChart";
import { TimelineChart } from "../charts/TimelineChart";

function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div
      className={`border-3 border-black bg-gray-100 animate-pulse ${className}`}
      style={{ borderWidth: "3px", boxShadow: "4px 4px 0 #000" }}
    />
  );
}

export function Dashboard() {
  const { data: stats, isLoading, error } = useStats();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonCard key={i} className="h-28" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SkeletonCard className="h-52" />
          <SkeletonCard className="h-52" />
        </div>
        <SkeletonCard className="h-48" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex items-center justify-center min-h-64">
        <div
          className="border-3 border-black bg-[#FF5252] p-6 text-white max-w-md"
          style={{ borderWidth: "3px", boxShadow: "4px 4px 0 #000" }}
        >
          <h2 className="font-black text-xl mb-2">Failed to load dashboard</h2>
          <p className="text-sm font-semibold opacity-80">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!stats || stats.totalBooks === 0) {
    return (
      <div className="p-6 flex items-center justify-center min-h-64">
        <div
          className="border-3 border-black bg-[#FFEB3B] p-8 text-black max-w-md text-center"
          style={{ borderWidth: "3px", boxShadow: "4px 4px 0 #000" }}
        >
          <div className="text-5xl mb-4">
            <svg viewBox="0 0 24 24" width="56" height="56" fill="none" stroke="currentColor" strokeWidth="2" className="mx-auto">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
          </div>
          <h2 className="font-black text-2xl mb-2">No books yet</h2>
          <p className="text-sm font-semibold opacity-70">
            Head to Admin to add your first book and start tracking your reading.
          </p>
        </div>
      </div>
    );
  }

  const hasTimeline = stats.readingTimeline.length >= 2;
  const hasAuthors = stats.authorBreakdown.length >= 2;

  return (
    <div className="flex flex-col gap-6 p-6">
      <HeroStats stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <FeaturedAuthor stats={stats} />
        <FeaturedBook stats={stats} />
      </div>

      <ReadingDNA stats={stats} />

      <InsightCards stats={stats} />

      <div className={`grid gap-4 ${hasTimeline && hasAuthors ? "grid-cols-1 lg:grid-cols-3" : "grid-cols-1 lg:grid-cols-2"}`}>
        <div className={hasTimeline && hasAuthors ? "lg:col-span-1" : ""}>
          <GenreBarChart data={stats.genreBreakdown} />
        </div>
        {hasAuthors && (
          <div>
            <AuthorBarChart data={stats.authorBreakdown} />
          </div>
        )}
        {hasTimeline && (
          <div className={hasAuthors ? "" : "lg:col-span-1"}>
            <TimelineChart data={stats.readingTimeline} />
          </div>
        )}
      </div>
    </div>
  );
}
