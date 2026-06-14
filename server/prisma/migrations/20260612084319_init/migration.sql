-- CreateTable
CREATE TABLE "Book" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "genre" TEXT NOT NULL,
    "pages" INTEGER NOT NULL,
    "estimatedWords" INTEGER NOT NULL,
    "rating" REAL,
    "dateFinished" DATETIME,
    "coverUrl" TEXT,
    "description" TEXT,
    "publishedYear" INTEGER,
    "isbn" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
