import { useBooks } from "./hooks/useBooks";
import { BookCover } from "../../components/ui/BookCover";
import { Badge } from "../../components/ui/Badge";
import type { Book } from "../../../../shared/src/schemas";

function BookRow({ book }: { book: Book }) {
  return (
    <div
      className="border-3 border-black bg-white p-4 flex gap-4 items-start hover:-translate-y-0.5 transition-transform"
      style={{ borderWidth: "3px", boxShadow: "4px 4px 0 #000" }}
    >
      <BookCover
        coverUrl={book.coverUrl}
        title={book.title}
        author={book.author}
        className="w-14 h-20 flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <h3 className="font-black text-base text-black leading-tight">{book.title}</h3>
        <p className="text-sm font-bold text-black/60 mt-0.5">{book.author}</p>
        <div className="flex flex-wrap gap-1.5 mt-2">
          <Badge color="black">{book.genre}</Badge>
          {book.rating && <Badge color="yellow">{book.rating}/5</Badge>}
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <div className="text-lg font-black">{book.pages.toLocaleString()}</div>
        <div className="text-xs font-bold text-black/50">pages</div>
        {book.dateFinished && (
          <div className="text-xs font-semibold text-black/40 mt-1">
            {new Date(book.dateFinished).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
          </div>
        )}
      </div>
    </div>
  );
}

export function BookList() {
  const { data: books, isLoading, error } = useBooks();

  if (isLoading) {
    return (
      <div className="p-6 flex flex-col gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="border-3 border-black h-24 animate-pulse bg-gray-100"
            style={{ borderWidth: "3px", boxShadow: "4px 4px 0 #000" }} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="border-3 border-black bg-[#FF5252] p-4 text-white"
          style={{ borderWidth: "3px", boxShadow: "4px 4px 0 #000" }}>
          <p className="font-black">Failed to load books: {error.message}</p>
        </div>
      </div>
    );
  }

  if (!books?.length) {
    return (
      <div className="p-6 flex items-center justify-center min-h-64">
        <div className="border-3 border-black bg-[#FFEB3B] p-8 text-center"
          style={{ borderWidth: "3px", boxShadow: "4px 4px 0 #000" }}>
          <p className="font-black text-xl">No books in your library</p>
          <p className="text-sm font-semibold text-black/60 mt-2">Use Admin to add your first book.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-black">My Library</h1>
        <div className="border-2 border-black px-3 py-1 bg-[#FFEB3B]"
          style={{ boxShadow: "2px 2px 0 #000" }}>
          <span className="text-sm font-black">{books.length} Books</span>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        {books.map((book) => (
          <BookRow key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
}
