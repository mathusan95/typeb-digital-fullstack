import { create } from "zustand";
import type { Todo } from "shared";

type TodoState = {
  todos: Todo[];
  hasMore: boolean;
  isLoading: boolean;
  errorMessage: string | null;
  setInitialPage: (items: Todo[], hasMore: boolean) => void;
  appendPage: (items: Todo[], hasMore: boolean) => void;
  addTodo: (todo: Todo) => void;
  replaceTodo: (todo: Todo) => void;
  removeTodo: (id: string) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (errorMessage: string | null) => void;
};

export const useTodoStore = create<TodoState>((set) => ({
  todos: [],
  hasMore: false,
  isLoading: true,
  errorMessage: null,
  setInitialPage: (items, hasMore) =>
    set({ todos: items, hasMore, errorMessage: null }),
  appendPage: (items, hasMore) =>
    set((state) => ({ todos: [...state.todos, ...items], hasMore })),
  addTodo: (todo) =>
    set((state) => ({ todos: [todo, ...state.todos], errorMessage: null })),
  replaceTodo: (todo) =>
    set((state) => ({
      todos: state.todos.map((item) => (item.id === todo.id ? todo : item)),
      errorMessage: null,
    })),
  removeTodo: (id) =>
    set((state) => ({
      todos: state.todos.filter((todo) => todo.id !== id),
      errorMessage: null,
    })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (errorMessage) => set({ errorMessage }),
}));
