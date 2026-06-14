import type { Book, Stats, BookSearchResult, CreateBook, UpdateBook } from "../../../shared/src/schemas";

const BASE = "/api";

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

export const api = {
  books: {
    list: () => request<Book[]>("/books"),
    get: (id: string) => request<Book>(`/books/${id}`),
    create: (data: CreateBook) =>
      request<Book>("/books", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: UpdateBook) =>
      request<Book>(`/books/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) => request<void>(`/books/${id}`, { method: "DELETE" }),
  },
  stats: {
    get: () => request<Stats>("/stats"),
  },
  search: {
    query: (q: string) => request<BookSearchResult[]>(`/search?q=${encodeURIComponent(q)}`),
  },
};
