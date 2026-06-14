import "dotenv/config";
import fs from "fs";
import path from "path";
import { PrismaClient } from "../generated/prisma/client";

const prisma = new PrismaClient();

const WORDS_PER_PAGE = 275;

const OUT_DIR = path.resolve(__dirname, "../../../client/public/data");

function serializeBook(book: any) {
  return {
    ...book,
    dateFinished: book.dateFinished ? book.dateFinished.toISOString() : null,
    createdAt: book.createdAt.toISOString(),
    updatedAt: book.updatedAt.toISOString(),
  };
}

async function computeStats(books: any[]) {
  const totalBooks = books.length;

  if (totalBooks === 0) {
    return {
      totalBooks: 0, totalPages: 0, estimatedWords: 0,
      topAuthor: null, topGenre: null, averageRating: null,
      averagePages: null, longestBook: null, shortestBook: null,
      mostRecentBook: null, highestRatedBook: null,
      genreBreakdown: [], authorBreakdown: [], readingTimeline: [],
      diversityScore: 0, genresExplored: 0,
    };
  }

  const totalPages = books.reduce((s, b) => s + b.pages, 0);
  const estimatedWords = books.reduce((s, b) => s + b.estimatedWords, 0);

  const authorMap = new Map<string, { count: number; pages: number }>();
  for (const b of books) {
    const e = authorMap.get(b.author);
    e ? (e.count++, (e.pages += b.pages)) : authorMap.set(b.author, { count: 1, pages: b.pages });
  }
  const authorBreakdown = Array.from(authorMap.entries())
    .map(([author, d]) => ({ author, ...d }))
    .sort((a, b) => b.count - a.count);

  const genreMap = new Map<string, { count: number; pages: number }>();
  for (const b of books) {
    const e = genreMap.get(b.genre);
    e ? (e.count++, (e.pages += b.pages)) : genreMap.set(b.genre, { count: 1, pages: b.pages });
  }
  const genreBreakdown = Array.from(genreMap.entries())
    .map(([genre, d]) => ({ genre, ...d, percentage: Math.round((d.count / totalBooks) * 100) }))
    .sort((a, b) => b.count - a.count);

  const topAuthorData = authorBreakdown[0];
  const topAuthor = topAuthorData
    ? { name: topAuthorData.author, bookCount: topAuthorData.count, percentage: Math.round((topAuthorData.count / totalBooks) * 100) }
    : null;

  const topGenreData = genreBreakdown[0];
  const topGenre = topGenreData
    ? { name: topGenreData.genre, bookCount: topGenreData.count, percentage: topGenreData.percentage }
    : null;

  const ratedBooks = books.filter((b) => b.rating != null);
  const averageRating = ratedBooks.length > 0
    ? Math.round((ratedBooks.reduce((s, b) => s + b.rating, 0) / ratedBooks.length) * 10) / 10
    : null;

  const averagePages = Math.round(totalPages / totalBooks);

  const sortedByPages = [...books].sort((a, b) => b.pages - a.pages);
  const longestBook = sortedByPages[0] ? serializeBook(sortedByPages[0]) : null;
  const shortestBook = sortedByPages[sortedByPages.length - 1] ? serializeBook(sortedByPages[sortedByPages.length - 1]) : null;

  const booksWithDate = books.filter((b) => b.dateFinished != null);
  const mostRecentBook = booksWithDate.length > 0
    ? serializeBook([...booksWithDate].sort((a, b) => b.dateFinished.getTime() - a.dateFinished.getTime())[0])
    : null;
  const highestRatedBook = ratedBooks.length > 0
    ? serializeBook([...ratedBooks].sort((a, b) => b.rating - a.rating)[0])
    : null;

  const timelineMap = new Map<string, { booksCompleted: number; pagesRead: number }>();
  for (const b of booksWithDate) {
    const key = `${b.dateFinished.getFullYear()}-${String(b.dateFinished.getMonth() + 1).padStart(2, "0")}`;
    const e = timelineMap.get(key);
    e ? (e.booksCompleted++, (e.pagesRead += b.pages)) : timelineMap.set(key, { booksCompleted: 1, pagesRead: b.pages });
  }
  const readingTimeline = Array.from(timelineMap.entries())
    .map(([month, d]) => ({ month, ...d }))
    .sort((a, b) => a.month.localeCompare(b.month));

  const genresExplored = genreMap.size;
  const diversityScore = Math.min(100, Math.round((genresExplored / Math.max(1, totalBooks)) * 10 * 20));

  return {
    totalBooks, totalPages, estimatedWords,
    topAuthor, topGenre, averageRating, averagePages,
    longestBook, shortestBook, mostRecentBook, highestRatedBook,
    genreBreakdown, authorBreakdown, readingTimeline,
    diversityScore, genresExplored,
  };
}

async function main() {
  console.log("Reading books from database...");
  const rawBooks = await prisma.book.findMany({ orderBy: { createdAt: "desc" } });
  const books = rawBooks.map(serializeBook);

  console.log(`Found ${books.length} books. Computing stats...`);
  const stats = await computeStats(rawBooks);

  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
  }

  const booksPath = path.join(OUT_DIR, "books.json");
  const statsPath = path.join(OUT_DIR, "stats.json");

  fs.writeFileSync(booksPath, JSON.stringify(books, null, 2));
  fs.writeFileSync(statsPath, JSON.stringify(stats, null, 2));

  console.log(`Exported:`);
  console.log(`  ${booksPath}`);
  console.log(`  ${statsPath}`);
  console.log(`Done. Run "npm run build" in the client to build for deployment.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
