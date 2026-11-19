import "dotenv/config";
import mongoose from "mongoose";
import { connectDb } from "../db.js";
import { TodoModel } from "../models/todo.js";

const COUNT = 50;
const mongoUri = process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/todo";

async function seed(): Promise<void> {
  await connectDb(mongoUri);
  await TodoModel.deleteMany({});

  const now = Date.now();
  const todos = Array.from({ length: COUNT }, (_, index) => {
    const n = index + 1;
    return {
      title: `Todo ${n}`,
      description: `Description ${n}`,
      done: n % 3 === 0,
      createdAt: new Date(now - index * 1000),
      updatedAt: new Date(now - index * 1000),
    };
  });

  await TodoModel.insertMany(todos);
  const count = await TodoModel.countDocuments();
  console.log(`Seeded ${count} todos (Todo 1 … Todo ${COUNT})`);
}

seed()
  .catch((error: unknown) => {
    console.error("Seed failed", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
