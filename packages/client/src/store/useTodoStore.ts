import { create } from "zustand";
import type { Todo } from "shared";

type TodoState = {
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
};

export const useTodoStore = create<TodoState>((set) => ({
  todos: [],
  setTodos: (todos) => set({ todos }),
}));
