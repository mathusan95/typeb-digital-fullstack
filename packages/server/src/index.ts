import cors from "cors";
import "dotenv/config";
import express from "express";
import { connectDb, isDbConnected } from "./db.js";
import todoRoutes from "./routes/todo.routes.js";

const app = express();
const port = Number(process.env.PORT ?? 3001);
const mongoUri = process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/todo";

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    db: isDbConnected() ? "connected" : "disconnected",
  });
});

app.use("/api/todos", todoRoutes);

async function start(): Promise<void> {
  await connectDb(mongoUri);
  console.log("Connected to MongoDB");

  app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
  });
}

start().catch((error: unknown) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
