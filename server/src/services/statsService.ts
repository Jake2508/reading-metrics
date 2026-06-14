import prisma from "../prisma/client";
import type { Stats, GenreBreakdownItem, AuthorBreakdownItem, TimelineItem } from "../../../shared/src/schemas";

function serializeBook(book: any): any {
  return {
    ...book,
    dateFinished: book.dateFinished ? book.dateFinished.toISOString() : null,
    createdAt: book.createdAt.toISOString(),
    updatedAt: book.updatedAt.toISOString(),
  };
}

export async function computeStats(): Promise<Stats> {
  const books = await prisma.book.findMany({ orderBy: { createdAt: "asc" } });

  const totalBooks = books.length;

  if (totalBooks === 0) {
    return {
      totalBooks: 0,
      totalPages: 0,
      estimatedWords: 0,
      topAuthor: null,
      topGenre: null,
      averageRating: null,
      averagePages: null,
      longestBook: null,
      shortestBook: null,
      mostRecentBook: null,
      highestRatedBook: null,
      genreBreakdown: [],
      authorBreakdown: [],
      readingTimeline: [],
      diversityScore: 0,
      genresExplored: 0,
    };
  }

  const totalPages = books.reduce((sum, b) => sum + b.pages, 0);
  const estimatedWords = books.reduce((sum, b) => sum + b.estimatedWords, 0);

  // Author breakdown
  const authorMap = new Map<string, { count: number; pages: number }>();
  for (const book of books) {
    const existing = authorMap.get(book.author);
    if (existing) {
      existing.count++;
      existing.pages += book.pages;
    } else {
      authorMap.set(book.author, { count: 1, pages: book.pages });
    }
  }
  const authorBreakdown: AuthorBreakdownItem[] = Array.from(authorMap.entries())
    .map(([author, data]) => ({ author, ...data }))
    .sort((a, b) => b.count - a.count);

  const topAuthorData = authorBreakdown[0];
  const topAuthor = topAuthorData
    ? {
        name: topAuthorData.author,
        bookCount: topAuthorData.count,
        percentage: Math.round((topAuthorData.count / totalBooks) * 100),
      }
    : null;

  // Genre breakdown
  const genreMap = new Map<string, { count: number; pages: number }>();
  for (const book of books) {
    const existing = genreMap.get(book.genre);
    if (existing) {
      existing.count++;
      existing.pages += book.pages;
    } else {
      genreMap.set(book.genre, { count: 1, pages: book.pages });
    }
  }
  const genreBreakdown: GenreBreakdownItem[] = Array.from(genreMap.entries())
    .map(([genre, data]) => ({
      genre,
      ...data,
      percentage: Math.round((data.count / totalBooks) * 100),
    }))
    .sort((a, b) => b.count - a.count);

  const topGenreData = genreBreakdown[0];
  const topGenre = topGenreData
    ? {
        name: topGenreData.genre,
        bookCount: topGenreData.count,
        percentage: topGenreData.percentage,
      }
    : null;

  // Ratings
  const ratedBooks = books.filter((b) => b.rating != null);
  const averageRating =
    ratedBooks.length > 0
      ? Math.round((ratedBooks.reduce((sum, b) => sum + b.rating!, 0) / ratedBooks.length) * 10) / 10
      : null;

  const averagePages = Math.round(totalPages / totalBooks);

  // Special books
  const sortedByPages = [...books].sort((a, b) => b.pages - a.pages);
  const longestBook = sortedByPages[0] ? serializeBook(sortedByPages[0]) : null;
  const shortestBook = sortedByPages[sortedByPages.length - 1] ? serializeBook(sortedByPages[sortedByPages.length - 1]) : null;

  const booksWithDate = books.filter((b) => b.dateFinished != null);
  const mostRecentBook =
    booksWithDate.length > 0
      ? serializeBook([...booksWithDate].sort((a, b) => b.dateFinished!.getTime() - a.dateFinished!.getTime())[0])
      : null;

  const highestRatedBook =
    ratedBooks.length > 0
      ? serializeBook([...ratedBooks].sort((a, b) => b.rating! - a.rating!)[0])
      : null;

  // Reading timeline (books with dateFinished)
  const timelineMap = new Map<string, { booksCompleted: number; pagesRead: number }>();
  for (const book of booksWithDate) {
    const d = book.dateFinished!;
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const existing = timelineMap.get(key);
    if (existing) {
      existing.booksCompleted++;
      existing.pagesRead += book.pages;
    } else {
      timelineMap.set(key, { booksCompleted: 1, pagesRead: book.pages });
    }
  }
  const readingTimeline: TimelineItem[] = Array.from(timelineMap.entries())
    .map(([month, data]) => ({ month, ...data }))
    .sort((a, b) => a.month.localeCompare(b.month));

  // Diversity score: based on number of genres relative to total books
  const genresExplored = genreMap.size;
  const diversityScore = Math.min(100, Math.round((genresExplored / Math.max(1, totalBooks)) * 10 * 20));

  return {
    totalBooks,
    totalPages,
    estimatedWords,
    topAuthor,
    topGenre,
    averageRating,
    averagePages,
    longestBook,
    shortestBook,
    mostRecentBook,
    highestRatedBook,
    genreBreakdown,
    authorBreakdown,
    readingTimeline,
    diversityScore,
    genresExplored,
  };
}
