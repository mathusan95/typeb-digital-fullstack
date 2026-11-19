import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Button } from "../../components/Button";
import type { Todo } from "../../store/useTodoStore";
import { AddTodoModal } from "./AddTodoModal";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal";
import { EditTodoModal } from "./EditTodoModal";
import {
  createTodo,
  deleteTodoApi,
  fetchTodos,
  getErrorMessage,
  toggleTodoDone,
  updateTodoApi,
} from "./todoApi";

const PAGE_SIZE = 8;

export function ListTodo() {
  const [todosState, setTodosState] = useState<Todo[]>([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function loadTodos() {
    setErrorMessage(null);
    try {
      const todos = await fetchTodos();
      setTodosState(todos);
    } catch (error: unknown) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;

    fetchTodos()
      .then((todos) => {
        if (!cancelled) {
          setTodosState(todos);
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setErrorMessage(getErrorMessage(error));
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const deleting = todosState.find((todo) => todo.id === deletingId) ?? null;
  const editing = todosState.find((todo) => todo.id === editingId) ?? null;
  const visibleTodos = todosState.slice(0, visibleCount);
  const hasMore = visibleCount < todosState.length;

  async function deleteTodo(id: string) {
    try {
      await deleteTodoApi(id);
      setTodosState((todos) => todos.filter((todo) => todo.id !== id));
      setDeletingId(null);
      setErrorMessage(null);
    } catch (error: unknown) {
      setErrorMessage(getErrorMessage(error));
    }
  }

  async function setTodoDone(id: string) {
    try {
      const updated = await toggleTodoDone(id);
      setTodosState((todos) =>
        todos.map((todo) => (todo.id === id ? updated : todo)),
      );
      setErrorMessage(null);
    } catch (error: unknown) {
      setErrorMessage(getErrorMessage(error));
    }
  }

  async function updateTodo(
    id: string,
    title: string,
    description: string | null,
  ) {
    try {
      const updated = await updateTodoApi(id, title, description);
      setTodosState((todos) =>
        todos.map((todo) => (todo.id === id ? updated : todo)),
      );
      setErrorMessage(null);
    } catch (error: unknown) {
      setErrorMessage(getErrorMessage(error));
    }
  }

  async function addTodo(title: string, description: string | null) {
    try {
      const created = await createTodo(title, description);
      setTodosState((todos) => [created, ...todos]);
      setVisibleCount((count) => count + 1);
      setErrorMessage(null);
    } catch (error: unknown) {
      setErrorMessage(getErrorMessage(error));
    }
  }

  return (
    <>
      <header className="todo-header">
        <h1>Todo</h1>
      </header>
      {errorMessage ? (
        <div className="todo-error" role="alert">
          <span>{errorMessage}</span>
          <Button
            onClick={() => {
              setIsLoading(true);
              void loadTodos();
            }}
          >
            Retry
          </Button>
        </div>
      ) : null}
      {isLoading ? <p>Loading todos…</p> : null}
      <div id="todo-scroll" className="todo-list">
        <InfiniteScroll
          dataLength={visibleTodos.length}
          next={() => setVisibleCount((count) => count + PAGE_SIZE)}
          hasMore={hasMore}
          loader={<p>Loading…</p>}
          endMessage={<p>No more todos</p>}
          scrollableTarget="todo-scroll"
        >
          <ul>
            {visibleTodos.map((todo) => (
              <li key={todo.id} className="todo-row">
                <div
                  className={todo.done ? "todo-copy todo-done" : "todo-copy"}
                >
                  <span className="todo-title" title={todo.title}>
                    {todo.title}
                  </span>
                  <span
                    className="todo-description"
                    title={todo.description ?? undefined}
                  >
                    {todo.description ?? "No description"}
                  </span>
                </div>
                <span className="todo-status">
                  {todo.done ? "Done" : "Not Done"}
                </span>
                <div className="todo-actions">
                  {todo.done ? (
                    <Button
                      icon="↺"
                      aria-label="Mark undone"
                      onClick={() => void setTodoDone(todo.id)}
                    />
                  ) : (
                    <Button
                      icon="✓"
                      aria-label="Mark done"
                      onClick={() => void setTodoDone(todo.id)}
                    />
                  )}
                  <Button
                    icon="✎"
                    aria-label="Edit"
                    onClick={() => setEditingId(todo.id)}
                  />
                  <Button
                    icon="✕"
                    aria-label="Delete"
                    className="btn-danger"
                    onClick={() => setDeletingId(todo.id)}
                  />
                </div>
              </li>
            ))}
          </ul>
        </InfiniteScroll>
      </div>
      <div className="todo-footer">
        <Button onClick={() => setIsAdding(true)}>Add todo</Button>
      </div>
      {isAdding ? (
        <AddTodoModal
          onSave={(title, description) => void addTodo(title, description)}
          onClose={() => setIsAdding(false)}
        />
      ) : null}
      {editing ? (
        <EditTodoModal
          key={editing.id}
          todo={editing}
          onSave={(title, description) =>
            updateTodo(editing.id, title, description)
          }
          onClose={() => setEditingId(null)}
        />
      ) : null}
      {deleting ? (
        <ConfirmDeleteModal
          todo={deleting}
          onConfirm={() => deleteTodo(deleting.id)}
          onClose={() => setDeletingId(null)}
        />
      ) : null}
    </>
  );
}
