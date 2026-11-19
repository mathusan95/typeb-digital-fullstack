import type { Todo } from "../../store/useTodoStore";

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return "Something went wrong.";
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(path, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...init?.headers,
      },
    });
  } catch {
    throw new Error("Network error. Check that the server is running.");
  }

  if (res.status === 204) {
    return undefined as T;
  }

  if (!res.ok) {
    throw new Error(`Request failed (${res.status}).`);
  }

  return (await res.json()) as T;
}

export function fetchTodos() {
  return request<Todo[]>("/api/todos");
}

export function createTodo(title: string, description: string | null) {
  return request<Todo>("/api/todos", {
    method: "POST",
    body: JSON.stringify({ title, description }),
  });
}

export function updateTodoApi(
  id: string,
  title: string,
  description: string | null,
) {
  return request<Todo>(`/api/todos/${id}`, {
    method: "PUT",
    body: JSON.stringify({ title, description }),
  });
}

export function toggleTodoDone(id: string) {
  return request<Todo>(`/api/todos/${id}/done`, { method: "PATCH" });
}

export function deleteTodoApi(id: string) {
  return request<void>(`/api/todos/${id}`, { method: "DELETE" });
}
