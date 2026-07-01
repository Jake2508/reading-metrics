import { Router, Request, Response } from "express";
import { searchBooks } from "../services/searchService";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const q = req.query.q as string;
  if (!q || q.trim().length < 2) {
    return res.status(400).json({ error: "Query must be at least 2 characters" });
  }
  const rawLimit = parseInt(req.query.limit as string, 10);
  const limit = isNaN(rawLimit) ? 40 : Math.min(40, Math.max(1, rawLimit));
  try {
    const results = await searchBooks(q.trim(), limit);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: "Search failed" });
  }
});

export default router;
