import type { Request, Response } from "express";
import { TodoModel } from "../models/todo.js";
import type {
  CreateTodoInput,
  UpdateTodoInput,
} from "../validators/todo.validators.js";

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
  const todos = await TodoModel.find().sort({ createdAt: -1 });
  res.json(todos.map(toTodoResponse));
}

export async function createTodo(
  req: Request<unknown, unknown, CreateTodoInput>,
  res: Response,
): Promise<void> {
  const todo = await TodoModel.create({
    title: req.body.title,
    description: req.body.description ?? null,
  });
  res.status(201).json(toTodoResponse(todo));
}

export async function updateTodo(
  req: Request<{ id: string }, unknown, UpdateTodoInput>,
  res: Response,
): Promise<void> {
  const todo = await TodoModel.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      description: req.body.description ?? null,
    },
    { new: true, runValidators: true },
  );

  if (!todo) {
    res.status(404).json({ error: "Todo not found" });
    return;
  }

  res.json(toTodoResponse(todo));
}

export async function toggleTodoDone(
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> {
  const todo = await TodoModel.findById(req.params.id);

  if (!todo) {
    res.status(404).json({ error: "Todo not found" });
    return;
  }

  todo.done = !todo.done;
  await todo.save();
  res.json(toTodoResponse(todo));
}

export async function deleteTodo(
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> {
  const todo = await TodoModel.findByIdAndDelete(req.params.id);

  if (!todo) {
    res.status(404).json({ error: "Todo not found" });
    return;
  }

  res.status(204).send();
}
