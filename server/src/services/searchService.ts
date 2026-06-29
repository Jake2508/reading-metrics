import type { BookSearchResult } from "../../../shared/src/schemas";

function normalizeGenre(subjects: string[]): string {
  if (!subjects || subjects.length === 0) return "Unknown";
  const lower = subjects.map((s) => s.toLowerCase());
  if (lower.some((s) => s.includes("fantasy"))) return "Fantasy";
  if (lower.some((s) => s.includes("science fiction") || s.includes("sci-fi"))) return "Science Fiction";
  if (lower.some((s) => s.includes("mystery") || s.includes("thriller"))) return "Mystery & Thriller";
  if (lower.some((s) => s.includes("history") || s.includes("historical"))) return "History";
  if (lower.some((s) => s.includes("biography") || s.includes("memoir"))) return "Memoir";
  if (lower.some((s) => s.includes("self-help") || s.includes("self help") || s.includes("personal development"))) return "Self-Help";
  if (lower.some((s) => s.includes("business") || s.includes("economics"))) return "Business";
  if (lower.some((s) => s.includes("psychology"))) return "Psychology";
  if (lower.some((s) => s.includes("technology") || s.includes("computer") || s.includes("programming"))) return "Technology";
  if (lower.some((s) => s.includes("romance"))) return "Romance";
  if (lower.some((s) => s.includes("horror"))) return "Horror";
  if (lower.some((s) => s.includes("philosophy"))) return "Philosophy";
  if (lower.some((s) => s.includes("science"))) return "Science";
  return subjects[0].split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ").slice(0, 30);
}

async function searchOpenLibrary(query: string): Promise<BookSearchResult[]> {
  const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=40&fields=key,title,author_name,number_of_pages_median,cover_i,subject,first_publish_year,isbn`;
  const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
  if (!res.ok) throw new Error("Open Library request failed");
  const data = await res.json() as any;

  return (data.docs ?? []).slice(0, 40).map((doc: any): BookSearchResult => ({
    externalId: doc.key ?? "",
    title: doc.title ?? "Unknown Title",
    author: Array.isArray(doc.author_name) ? doc.author_name[0] : "Unknown Author",
    genre: normalizeGenre(doc.subject ?? []),
    pages: doc.number_of_pages_median ?? null,
    coverUrl: doc.cover_i ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg` : null,
    description: null,
    publishedYear: doc.first_publish_year ?? null,
    isbn: Array.isArray(doc.isbn) ? doc.isbn[0] : null,
    source: "openlibrary",
  }));
}

async function searchGoogleBooks(query: string): Promise<BookSearchResult[]> {
  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=40`;
  const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
  if (!res.ok) throw new Error("Google Books request failed");
  const data = await res.json() as any;

  return (data.items ?? []).slice(0, 40).map((item: any): BookSearchResult => {
    const info = item.volumeInfo ?? {};
    return {
      externalId: item.id ?? "",
      title: info.title ?? "Unknown Title",
      author: Array.isArray(info.authors) ? info.authors[0] : "Unknown Author",
      genre: normalizeGenre(info.categories ?? []),
      pages: info.pageCount ?? null,
      coverUrl: info.imageLinks?.thumbnail ?? info.imageLinks?.smallThumbnail ?? null,
      description: info.description ? info.description.slice(0, 500) : null,
      publishedYear: info.publishedDate ? parseInt(info.publishedDate.slice(0, 4), 10) : null,
      isbn: Array.isArray(info.industryIdentifiers)
        ? (info.industryIdentifiers.find((id: any) => id.type === "ISBN_13")?.identifier ?? null)
        : null,
      source: "googlebooks",
    };
  });
}

export async function searchBooks(query: string): Promise<BookSearchResult[]> {
  try {
    const results = await searchOpenLibrary(query);
    if (results.length > 0) return results;
  } catch (_) {}

  try {
    return await searchGoogleBooks(query);
  } catch (_) {}

  return [];
}
