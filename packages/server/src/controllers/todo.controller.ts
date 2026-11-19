import type { Request, Response } from "express";
import { TodoModel } from "../models/todo.js";

function toTodoResponse(todo: {
  _id: { toString: () => string };
  title: string;
  description: string | null;
  done: boolean;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: todo._id.toString(),
    title: todo.title,
    description: todo.description,
    done: todo.done,
    createdAt: todo.createdAt,
    updatedAt: todo.updatedAt,
  };
}

export async function listTodos(_req: Request, res: Response): Promise<void> {
  // list the todo by latest created
  const todos = await TodoModel.find().sort({ createdAt: -1 });
  res.json(todos.map(toTodoResponse));
}
