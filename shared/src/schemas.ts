import { z } from "zod";

export const BookSchema = z.object({
  id: z.string(),
  title: z.string(),
  author: z.string(),
  genre: z.string(),
  pages: z.number().int().positive(),
  estimatedWords: z.number().int().positive(),
  rating: z.number().min(0).max(5).nullable(),
  dateFinished: z.string().datetime().nullable(),
  coverUrl: z.string().url().nullable(),
  description: z.string().nullable(),
  publishedYear: z.number().int().nullable(),
  isbn: z.string().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const CreateBookSchema = z.object({
  title: z.string().min(1),
  author: z.string().min(1),
  genre: z.string().min(1),
  pages: z.number().int().positive(),
  rating: z.number().min(0).max(5).nullable().optional(),
  dateFinished: z.string().datetime().nullable().optional(),
  coverUrl: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  publishedYear: z.number().int().nullable().optional(),
  isbn: z.string().nullable().optional(),
});

export const UpdateBookSchema = CreateBookSchema.partial();

export const BookSearchResultSchema = z.object({
  externalId: z.string(),
  title: z.string(),
  author: z.string(),
  genre: z.string(),
  pages: z.number().int().nullable(),
  coverUrl: z.string().nullable(),
  description: z.string().nullable(),
  publishedYear: z.number().int().nullable(),
  isbn: z.string().nullable(),
  source: z.enum(["openlibrary", "googlebooks"]),
});

export const GenreBreakdownItemSchema = z.object({
  genre: z.string(),
  count: z.number(),
  pages: z.number(),
  percentage: z.number(),
});

export const AuthorBreakdownItemSchema = z.object({
  author: z.string(),
  count: z.number(),
  pages: z.number(),
});

export const TimelineItemSchema = z.object({
  month: z.string(),
  booksCompleted: z.number(),
  pagesRead: z.number(),
});

export const StatsSchema = z.object({
  totalBooks: z.number(),
  totalPages: z.number(),
  estimatedWords: z.number(),
  topAuthor: z
    .object({
      name: z.string(),
      bookCount: z.number(),
      percentage: z.number(),
    })
    .nullable(),
  topGenre: z
    .object({
      name: z.string(),
      bookCount: z.number(),
      percentage: z.number(),
    })
    .nullable(),
  averageRating: z.number().nullable(),
  averagePages: z.number().nullable(),
  longestBook: BookSchema.nullable(),
  shortestBook: BookSchema.nullable(),
  mostRecentBook: BookSchema.nullable(),
  highestRatedBook: BookSchema.nullable(),
  genreBreakdown: z.array(GenreBreakdownItemSchema),
  authorBreakdown: z.array(AuthorBreakdownItemSchema),
  readingTimeline: z.array(TimelineItemSchema),
  diversityScore: z.number(),
  genresExplored: z.number(),
});

export type Book = z.infer<typeof BookSchema>;
export type CreateBook = z.infer<typeof CreateBookSchema>;
export type UpdateBook = z.infer<typeof UpdateBookSchema>;
export type BookSearchResult = z.infer<typeof BookSearchResultSchema>;
export type Stats = z.infer<typeof StatsSchema>;
export type GenreBreakdownItem = z.infer<typeof GenreBreakdownItemSchema>;
export type AuthorBreakdownItem = z.infer<typeof AuthorBreakdownItemSchema>;
export type TimelineItem = z.infer<typeof TimelineItemSchema>;
