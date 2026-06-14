import { Router, Request, Response } from "express";
import { z } from "zod";
import prisma from "../prisma/client";
import { CreateBookSchema, UpdateBookSchema } from "../../../shared/src/schemas";

const router = Router();

const WORDS_PER_PAGE = 275;

function serializeBook(book: any) {
  return {
    ...book,
    dateFinished: book.dateFinished ? book.dateFinished.toISOString() : null,
    createdAt: book.createdAt.toISOString(),
    updatedAt: book.updatedAt.toISOString(),
  };
}

router.get("/", async (_req: Request, res: Response) => {
  try {
    const books = await prisma.book.findMany({ orderBy: { createdAt: "desc" } });
    res.json(books.map(serializeBook));
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch books" });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const book = await prisma.book.findUnique({ where: { id: req.params.id } });
    if (!book) return res.status(404).json({ error: "Book not found" });
    res.json(serializeBook(book));
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch book" });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const data = CreateBookSchema.parse(req.body);
    const book = await prisma.book.create({
      data: {
        ...data,
        estimatedWords: data.pages * WORDS_PER_PAGE,
        rating: data.rating ?? null,
        dateFinished: data.dateFinished ? new Date(data.dateFinished) : null,
        coverUrl: data.coverUrl ?? null,
        description: data.description ?? null,
        publishedYear: data.publishedYear ?? null,
        isbn: data.isbn ?? null,
      },
    });
    res.status(201).json(serializeBook(book));
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: "Validation failed", details: err.errors });
    }
    res.status(500).json({ error: "Failed to create book" });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  try {
    const data = UpdateBookSchema.parse(req.body);
    const updateData: any = { ...data };
    if (data.pages !== undefined) {
      updateData.estimatedWords = data.pages * WORDS_PER_PAGE;
    }
    if (data.dateFinished !== undefined) {
      updateData.dateFinished = data.dateFinished ? new Date(data.dateFinished) : null;
    }
    const book = await prisma.book.update({
      where: { id: req.params.id },
      data: updateData,
    });
    res.json(serializeBook(book));
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: "Validation failed", details: err.errors });
    }
    res.status(500).json({ error: "Failed to update book" });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    await prisma.book.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: "Failed to delete book" });
  }
});

export default router;
