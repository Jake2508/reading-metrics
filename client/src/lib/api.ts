import type { Book, Stats, BookSearchResult, CreateBook, UpdateBook } from "../../../shared/src/schemas";

const BASE = "/api";
const STATIC = import.meta.env.VITE_STATIC_MODE === "true";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error ?? `HTTP ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

async function staticFetch<T>(file: string): Promise<T> {
  const res = await fetch(`/data/${file}`);
  if (!res.ok) throw new Error(`Failed to load ${file}`);
  return res.json();
}

export const api = {
  books: {
    list: () =>
      STATIC
        ? staticFetch<Book[]>("books.json")
        : request<Book[]>("/books"),

    get: (id: string) =>
      STATIC
        ? staticFetch<Book[]>("books.json").then((books) => {
            const book = books.find((b) => b.id === id);
            if (!book) throw new Error("Book not found");
            return book;
          })
        : request<Book>(`/books/${id}`),

    create: (data: CreateBook) =>
      request<Book>("/books", { method: "POST", body: JSON.stringify(data) }),

    update: (id: string, data: UpdateBook) =>
      request<Book>(`/books/${id}`, { method: "PUT", body: JSON.stringify(data) }),

    delete: (id: string) =>
      request<void>(`/books/${id}`, { method: "DELETE" }),
  },

  stats: {
    get: () =>
      STATIC
        ? staticFetch<Stats>("stats.json")
        : request<Stats>("/stats"),
  },

  search: {
    query: (q: string) =>
      request<BookSearchResult[]>(`/search?q=${encodeURIComponent(q)}`),
  },
};
