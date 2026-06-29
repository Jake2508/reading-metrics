import { useState } from "react";
import { useSearch } from "./hooks/useSearch";
import { BookForm } from "./BookForm";
import { useCreateBook, useBooks, useUpdateBook, useDeleteBook } from "../books/hooks/useBooks";
import { BookCover } from "../../components/ui/BookCover";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Input } from "../../components/ui/Input";
import type { BookSearchResult, Book } from "../../../../shared/src/schemas";

function isDuplicateBook(
  candidate: { title?: string; author?: string; isbn?: string | null },
  books: Book[]
): Book | undefined {
  const norm = (s: string) => s.trim().toLowerCase();
  return books.find((b) => {
    if (
      candidate.isbn &&
      b.isbn &&
      candidate.isbn.replace(/[-\s]/g, "") === b.isbn.replace(/[-\s]/g, "")
    )
      return true;
    return (
      norm(b.title) === norm(candidate.title ?? "") &&
      norm(b.author) === norm(candidate.author ?? "")
    );
  });
}

type AdminView =
  | { type: "search" }
  | { type: "form-new"; prefill?: Partial<BookSearchResult> }
  | { type: "form-edit"; book: Book }
  | { type: "library" };

export function AdminPanel() {
  const [view, setView] = useState<AdminView>({ type: "search" });
  const [searchQuery, setSearchQuery] = useState("");
  const [activeQuery, setActiveQuery] = useState("");
  const [searchLimit, setSearchLimit] = useState(10);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const { data: searchResults, isLoading: searchLoading } = useSearch(activeQuery, searchLimit);
  const { data: books } = useBooks();
  const createBook = useCreateBook();
  const updateBook = useUpdateBook();
  const deleteBook = useDeleteBook();

  const formNewDuplicate =
    view.type === "form-new" && view.prefill
      ? isDuplicateBook(view.prefill, books ?? [])
      : undefined;

  const handleSearch = () => {
    if (searchQuery.trim().length >= 2) {
      setActiveQuery(searchQuery.trim());
    }
  };

  const handleSelectResult = (result: BookSearchResult) => {
    setView({ type: "form-new", prefill: result });
  };

  const handleCreateSubmit = async (data: any) => {
    const payload = {
      title: data.title,
      author: data.author,
      genre: data.genre,
      pages: Number(data.pages),
      rating: data.rating !== "" && data.rating != null ? Number(data.rating) : null,
      dateFinished: data.dateFinished ? new Date(data.dateFinished).toISOString() : null,
      coverUrl: data.coverUrl || null,
      description: data.description || null,
      publishedYear: data.publishedYear !== "" && data.publishedYear != null ? Number(data.publishedYear) : null,
      isbn: data.isbn || null,
    };
    await createBook.mutateAsync(payload);
    setView({ type: "library" });
  };

  const handleUpdateSubmit = async (data: any, bookId: string) => {
    const payload = {
      title: data.title,
      author: data.author,
      genre: data.genre,
      pages: Number(data.pages),
      rating: data.rating !== "" && data.rating != null ? Number(data.rating) : null,
      dateFinished: data.dateFinished ? new Date(data.dateFinished).toISOString() : null,
      coverUrl: data.coverUrl || null,
      description: data.description || null,
      publishedYear: data.publishedYear !== "" && data.publishedYear != null ? Number(data.publishedYear) : null,
      isbn: data.isbn || null,
    };
    await updateBook.mutateAsync({ id: bookId, data: payload });
    setView({ type: "library" });
  };

  const handleDelete = async (id: string) => {
    try {
      setDeleteError(null);
      await deleteBook.mutateAsync(id);
      setDeleteConfirmId(null);
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Delete failed");
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black">Admin</h1>
        <div className="flex gap-2">
          <Button
            variant={view.type === "search" || view.type === "form-new" ? "primary" : "secondary"}
            size="sm"
            onClick={() => setView({ type: "search" })}
          >
            + Add Book
          </Button>
          <Button
            variant={view.type === "library" || view.type === "form-edit" ? "primary" : "secondary"}
            size="sm"
            onClick={() => setView({ type: "library" })}
          >
            Manage Library
          </Button>
        </div>
      </div>

      {view.type === "search" && (
        <div className="flex flex-col gap-5">
          <div
            className="border-3 border-black bg-[#FFEB3B] p-5"
            style={{ borderWidth: "3px", boxShadow: "4px 4px 0 #000" }}
          >
            <h2 className="font-black text-lg mb-3">Search for a Book</h2>
            <div className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Book title or author..."
                className="flex-1 border-2 border-black px-3 py-2 text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-black"
              />
              <div className="flex flex-col justify-center items-center">
                <label className="text-[10px] font-black uppercase tracking-wide leading-none mb-1">Results</label>
                <input
                  type="number"
                  min={1}
                  max={40}
                  value={searchLimit}
                  onChange={(e) => {
                    const v = Math.min(40, Math.max(1, parseInt(e.target.value, 10) || 1));
                    setSearchLimit(v);
                  }}
                  className="w-14 border-2 border-black px-2 py-2 text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-black text-center"
                />
              </div>
              <Button onClick={handleSearch} variant="secondary" disabled={searchQuery.trim().length < 2}>
                Search
              </Button>
            </div>
            <p className="text-xs font-semibold text-black/60 mt-2">
              Searches Open Library and Google Books. You can edit all fields before saving.
            </p>
          </div>

          {searchLoading && (
            <div className="flex flex-col gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="border-2 border-black h-20 animate-pulse bg-gray-100"
                  style={{ boxShadow: "3px 3px 0 #000" }} />
              ))}
            </div>
          )}

          {searchResults && !searchLoading && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold">{searchResults.length} results</p>
                <Button size="sm" variant="ghost" onClick={() => setView({ type: "form-new" })}>
                  Add manually
                </Button>
              </div>
              {searchResults.length === 0 && (
                <div className="border-2 border-black p-4 bg-white text-center"
                  style={{ boxShadow: "3px 3px 0 #000" }}>
                  <p className="font-bold text-black/60">No results found.</p>
                  <Button size="sm" variant="ghost" className="mt-2" onClick={() => setView({ type: "form-new" })}>
                    Add manually
                  </Button>
                </div>
              )}
              {searchResults.map((result) => {
                const alreadyAdded = isDuplicateBook(result, books ?? []);
                return (
                  <div
                    key={result.externalId}
                    className="border-2 border-black bg-white p-3 flex gap-3 items-start cursor-pointer hover:-translate-y-0.5 transition-transform"
                    style={{ boxShadow: "3px 3px 0 #000" }}
                    onClick={() => handleSelectResult(result)}
                  >
                    <BookCover
                      coverUrl={result.coverUrl}
                      title={result.title}
                      author={result.author}
                      className="w-10 h-14 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-sm leading-tight">{result.title}</p>
                      <p className="text-xs font-bold text-black/60 mt-0.5">{result.author}</p>
                      <div className="flex gap-1.5 mt-1 flex-wrap">
                        <Badge color="black">{result.genre}</Badge>
                        {result.pages && <Badge color="yellow">{result.pages}pp</Badge>}
                        {result.publishedYear && <span className="text-xs font-semibold text-black/40">{result.publishedYear}</span>}
                        {alreadyAdded && (
                          <span className="text-xs font-black text-[#FF5252] border-2 border-[#FF5252] px-1.5 py-0.5 leading-none">
                            In library
                          </span>
                        )}
                      </div>
                    </div>
                    <Button size="sm" variant="primary" onClick={(e) => { e.stopPropagation(); handleSelectResult(result); }}>
                      Select
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {view.type === "form-new" && (
        <div
          className="border-3 border-black bg-white p-5"
          style={{ borderWidth: "3px", boxShadow: "4px 4px 0 #000" }}
        >
          <h2 className="font-black text-lg mb-4">
            {view.prefill ? "Review & Edit Book" : "Add Book Manually"}
          </h2>
          {formNewDuplicate && (
            <div className="border-2 border-[#FF5252] bg-[#FF5252]/10 p-3 mb-4">
              <p className="font-black text-sm text-[#FF5252]">Already in your library</p>
              <p className="text-xs font-semibold text-black/70 mt-0.5">
                "{formNewDuplicate.title}" by {formNewDuplicate.author} has already been added.
              </p>
            </div>
          )}
          <BookForm
            prefill={view.prefill}
            onSubmit={handleCreateSubmit}
            onCancel={() => setView({ type: "search" })}
            isSubmitting={createBook.isPending}
          />
          {createBook.isError && (
            <p className="text-[#FF5252] text-sm font-bold mt-2">{createBook.error.message}</p>
          )}
        </div>
      )}

      {view.type === "library" && (
        <div className="flex flex-col gap-3">
          {deleteError && (
            <div className="border-2 border-[#FF5252] bg-[#FF5252]/10 p-3">
              <p className="font-bold text-sm text-[#FF5252]">Delete failed: {deleteError}</p>
              <p className="text-xs font-semibold text-black/60 mt-1">Make sure the backend server is running on port 3002.</p>
            </div>
          )}
          {!books?.length && (
            <div className="border-2 border-black p-6 bg-[#FFEB3B] text-center"
              style={{ boxShadow: "3px 3px 0 #000" }}>
              <p className="font-black">No books yet. Add some!</p>
            </div>
          )}
          {books?.map((book) => (
            <div key={book.id}
              className="border-3 border-black bg-white p-4 flex gap-3 items-start"
              style={{ borderWidth: "3px", boxShadow: "4px 4px 0 #000" }}
            >
              <BookCover coverUrl={book.coverUrl} title={book.title} author={book.author} className="w-12 h-18 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-black text-sm leading-tight">{book.title}</p>
                <p className="text-xs font-bold text-black/60">{book.author}</p>
                <div className="flex gap-1 mt-1">
                  <Badge color="black">{book.genre}</Badge>
                  {book.rating && <Badge color="yellow">{book.rating}/5</Badge>}
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Button size="sm" variant="secondary" onClick={() => setView({ type: "form-edit", book })}>
                  Edit
                </Button>
                {deleteConfirmId === book.id ? (
                  <div className="flex gap-1">
                    <Button size="sm" variant="danger" onClick={() => handleDelete(book.id)} disabled={deleteBook.isPending}>
                      Confirm
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setDeleteConfirmId(null)}>
                      No
                    </Button>
                  </div>
                ) : (
                  <Button size="sm" variant="ghost" onClick={() => setDeleteConfirmId(book.id)}>
                    Delete
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {view.type === "form-edit" && (
        <div
          className="border-3 border-black bg-white p-5"
          style={{ borderWidth: "3px", boxShadow: "4px 4px 0 #000" }}
        >
          <h2 className="font-black text-lg mb-4">Edit Book</h2>
          <BookForm
            existingBook={view.book}
            onSubmit={(data) => handleUpdateSubmit(data, view.book.id)}
            onCancel={() => setView({ type: "library" })}
            isSubmitting={updateBook.isPending}
          />
          {updateBook.isError && (
            <p className="text-[#FF5252] text-sm font-bold mt-2">{updateBook.error.message}</p>
          )}
        </div>
      )}
    </div>
  );
}
