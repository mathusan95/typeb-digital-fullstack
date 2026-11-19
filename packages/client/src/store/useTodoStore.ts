import { create } from "zustand";

export type Todo = {
  id: string;
  title: string;
  description: string | null;
  done: boolean;
  createdAt: string;
  updatedAt: string;
};

type TodoState = {
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
};

export const useTodoStore = create<TodoState>((set) => ({
  todos: [],
  setTodos: (todos) => set({ todos }),
}));
