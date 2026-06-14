import "dotenv/config";
import express from "express";
import cors from "cors";
import booksRouter from "./routes/books";
import statsRouter from "./routes/stats";
import searchRouter from "./routes/search";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/books", booksRouter);
app.use("/api/stats", statsRouter);
app.use("/api/search", searchRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
