import { create } from "zustand";
import { Timestamp } from "mongodb";

export type Todo = {
  id: string;
  title: string;
  description: string | null;
  done: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

type TodoState = {
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
};

export const useTodoStore = create<TodoState>((set) => ({
  todos: [],
  setTodos: (todos) => set({ todos }),
}));
