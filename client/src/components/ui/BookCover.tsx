import { useState } from "react";

interface BookCoverProps {
  coverUrl: string | null;
  title: string;
  author: string;
  className?: string;
}

export function BookCover({ coverUrl, title, author, className = "" }: BookCoverProps) {
  const [failed, setFailed] = useState(false);

  if (coverUrl && !failed) {
    return (
      <img
        src={coverUrl}
        alt={`Cover of ${title}`}
        onError={() => setFailed(true)}
        className={`object-cover border-2 border-black ${className}`}
        style={{ boxShadow: "3px 3px 0 #000" }}
      />
    );
  }

  const initials = title.slice(0, 2).toUpperCase();
  const colors = ["#FFEB3B", "#FF5252", "#2196F3", "#4CAF50", "#FF9800", "#9C27B0"];
  const colorIndex = (title.charCodeAt(0) + author.charCodeAt(0)) % colors.length;
  const bg = colors[colorIndex];

  return (
    <div
      className={`flex flex-col items-center justify-center border-2 border-black ${className}`}
      style={{ backgroundColor: bg, boxShadow: "3px 3px 0 #000" }}
    >
      <span className="text-2xl font-black text-black">{initials}</span>
      <span className="text-xs font-bold text-black/60 mt-1 text-center px-1 leading-tight">
        {author.split(" ").pop()}
      </span>
    </div>
  );
}
