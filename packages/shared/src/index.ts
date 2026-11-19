export type Todo = {
  id: string;
  title: string;
  description: string | null;
  done: boolean;
  createdAt: string;
  updatedAt: string;
};

export type TodoListPage = {
  items: Todo[];
  total: number;
  skip: number;
  limit: number;
  hasMore: boolean;
};

export type TodoWrite = {
  title: string;
  description?: string | null;
};
