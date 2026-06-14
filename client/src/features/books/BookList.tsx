import { useState, useRef, useEffect } from "react";
import { useBooks } from "./hooks/useBooks";
import { BookCover } from "../../components/ui/BookCover";
import { Badge } from "../../components/ui/Badge";
import type { Book } from "../../../../shared/src/schemas";

function applyFilter(books: Book[], filter: string): Book[] {
  if (!filter || filter === "all") return books;
  if (filter.startsWith("genre:")) return books.filter((b) => b.genre === filter.slice(6));
  if (filter === "rating:5") return books.filter((b) => b.rating != null && b.rating === 5);
  if (filter === "rating:4+") return books.filter((b) => b.rating != null && b.rating >= 4);
  if (filter === "rating:3+") return books.filter((b) => b.rating != null && b.rating >= 3);
  if (filter === "rating:unrated") return books.filter((b) => !b.rating);
  if (filter === "size:short") return books.filter((b) => b.pages < 200);
  if (filter === "size:medium") return books.filter((b) => b.pages >= 200 && b.pages < 400);
  if (filter === "size:long") return books.filter((b) => b.pages >= 400 && b.pages < 600);
  if (filter === "size:epic") return books.filter((b) => b.pages >= 600);
  return books;
}

type OptionGroup = {
  label: string;
  options: { value: string; label: string }[];
};

function FilterDropdown({
  value,
  onChange,
  groups,
  allLabel,
}: {
  value: string;
  onChange: (v: string) => void;
  groups: OptionGroup[];
  allLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, []);

  const currentLabel =
    value === "all"
      ? allLabel
      : groups.flatMap((g) => g.options).find((o) => o.value === value)?.label ?? allLabel;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="border-2 border-black px-3 py-1.5 text-sm font-black bg-white flex items-center gap-2 hover:-translate-y-0.5 transition-transform"
        style={{ boxShadow: "3px 3px 0 #000" }}
      >
        <span>{currentLabel}</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 150ms" }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-1 z-50 bg-white border-2 border-black min-w-44"
          style={{ boxShadow: "4px 4px 0 #000" }}
        >
          <button
            onClick={() => { onChange("all"); setOpen(false); }}
            className={`w-full text-left px-4 py-2 text-sm font-bold border-b-2 border-black hover:bg-[#FFEB3B] transition-colors ${value === "all" ? "bg-[#FFEB3B]" : ""}`}
          >
            {allLabel}
          </button>

          {groups.map((group) => (
            <div key={group.label}>
              <div className="px-4 py-1.5 text-xs font-black uppercase tracking-widest text-black/40 bg-black/5 border-b border-black/20">
                {group.label}
              </div>
              {group.options.map((opt, i) => (
                <button
                  key={opt.value}
                  onClick={() => { onChange(opt.value); setOpen(false); }}
                  className={`w-full text-left px-4 py-2 text-sm font-bold hover:bg-[#FFEB3B] transition-colors ${value === opt.value ? "bg-[#FFEB3B]" : ""} ${i < group.options.length - 1 ? "border-b border-black/10" : "border-b-2 border-black"}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

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
  const [filter, setFilter] = useState("all");

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

  const genres = [...new Set(books.map((b) => b.genre))].sort();
  const filtered = applyFilter(books, filter);

  const filterGroups: OptionGroup[] = [
    {
      label: "Genre",
      options: genres.map((g) => ({ value: `genre:${g}`, label: g })),
    },
    {
      label: "Rating",
      options: [
        { value: "rating:5", label: "5 Stars" },
        { value: "rating:4+", label: "4+ Stars" },
        { value: "rating:3+", label: "3+ Stars" },
        { value: "rating:unrated", label: "Unrated" },
      ],
    },
    {
      label: "Size",
      options: [
        { value: "size:short", label: "Short  (<200 pages)" },
        { value: "size:medium", label: "Medium  (200–400)" },
        { value: "size:long", label: "Long  (400–600)" },
        { value: "size:epic", label: "Epic  (600+)" },
      ],
    },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
        <h1 className="text-2xl font-black">My Library</h1>
        <div className="flex items-center gap-3">
          <FilterDropdown
            value={filter}
            onChange={setFilter}
            groups={filterGroups}
            allLabel="All Books"
          />
          <div className="border-2 border-black px-3 py-1.5 bg-[#FFEB3B]"
            style={{ boxShadow: "2px 2px 0 #000" }}>
            <span className="text-sm font-black">
              {filtered.length}{filter !== "all" ? `/${books.length}` : ""} Books
            </span>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="border-2 border-black p-6 bg-white text-center"
          style={{ boxShadow: "3px 3px 0 #000" }}>
          <p className="font-black text-black/60">No books match this filter.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((book) => (
            <BookRow key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
}
