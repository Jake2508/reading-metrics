import { Router, Request, Response } from "express";
import { computeStats } from "../services/statsService";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  try {
    const stats = await computeStats();
    res.json(stats);
  } catch (err) {
    console.error("Stats error:", err);
    res.status(500).json({ error: "Failed to compute stats" });
  }
});

export default router;
