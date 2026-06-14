import { useStats } from "./hooks/useStats";
import { HeroStats } from "./HeroStats";
import { FeaturedAuthor } from "./FeaturedAuthor";
import { FeaturedBook } from "./FeaturedBook";
import { InsightCards } from "./InsightCards";
import { GenreBarChart } from "../charts/GenreBarChart";
import { AuthorBarChart } from "../charts/AuthorBarChart";

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
      <div className="flex flex-col gap-3 p-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonCard key={i} className="h-20" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <SkeletonCard className="h-40" />
          <SkeletonCard className="h-40" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <SkeletonCard className="h-48" />
          <SkeletonCard className="h-48" />
        </div>
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} className="h-20" />
          ))}
        </div>
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

  return (
    <div className="flex flex-col gap-4 p-5">
      <HeroStats stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <FeaturedAuthor stats={stats} />
        <FeaturedBook stats={stats} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <GenreBarChart data={stats.genreBreakdown} height={200} />
        <AuthorBarChart data={stats.authorBreakdown} height={200} />
      </div>

      <InsightCards stats={stats} />
    </div>
  );
}
