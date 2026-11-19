import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Button } from "../../components/Button";
import { Loading } from "../../components/Loading";
import { useToast } from "../../components/Toast";
import type { Todo } from "shared";
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
  const [hasMore, setHasMore] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const toast = useToast();

  async function loadTodos() {
    setErrorMessage(null);
    try {
      const page = await fetchTodos(0, PAGE_SIZE);
      setTodosState(page.items);
      setHasMore(page.hasMore);
    } catch (error: unknown) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;

    fetchTodos(0, PAGE_SIZE)
      .then((page) => {
        if (!cancelled) {
          setTodosState(page.items);
          setHasMore(page.hasMore);
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

  async function loadMore() {
    try {
      const page = await fetchTodos(todosState.length, PAGE_SIZE);
      setTodosState((todos) => [...todos, ...page.items]);
      setHasMore(page.hasMore);
    } catch (error: unknown) {
      setErrorMessage(getErrorMessage(error));
    }
  }

  async function deleteTodo(id: string) {
    try {
      await deleteTodoApi(id);
      setTodosState((todos) => todos.filter((todo) => todo.id !== id));
      setErrorMessage(null);
      toast.show("Todo deleted");
    } catch (error: unknown) {
      setErrorMessage(getErrorMessage(error));
      throw error;
    }
  }

  async function setTodoDone(id: string) {
    setBusyId(id);
    try {
      const updated = await toggleTodoDone(id);
      setTodosState((todos) =>
        todos.map((todo) => (todo.id === id ? updated : todo)),
      );
      setErrorMessage(null);
    } catch (error: unknown) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setBusyId(null);
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
      toast.show("Todo updated");
    } catch (error: unknown) {
      setErrorMessage(getErrorMessage(error));
      throw error;
    }
  }

  async function addTodo(title: string, description: string | null) {
    try {
      const created = await createTodo(title, description);
      setTodosState((todos) => [created, ...todos]);
      setErrorMessage(null);
      toast.show("Todo created");
    } catch (error: unknown) {
      setErrorMessage(getErrorMessage(error));
      throw error;
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
      {isLoading ? (
        <div className="loading-block">
          <Loading label="Loading todos…" />
        </div>
      ) : null}
      <div id="todo-scroll" className="todo-list">
        <InfiniteScroll
          dataLength={todosState.length}
          next={() => void loadMore()}
          hasMore={hasMore}
          loader={
            <div className="loading-block">
              <Loading label="Loading more…" />
            </div>
          }
          endMessage={<p>No more todos</p>}
          scrollableTarget="todo-scroll"
        >
          <ul>
            {todosState.map((todo) => (
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
                      loading={busyId === todo.id}
                      disabled={busyId !== null && busyId !== todo.id}
                      onClick={() => void setTodoDone(todo.id)}
                    />
                  ) : (
                    <Button
                      icon="✓"
                      aria-label="Mark done"
                      loading={busyId === todo.id}
                      disabled={busyId !== null && busyId !== todo.id}
                      onClick={() => void setTodoDone(todo.id)}
                    />
                  )}
                  <Button
                    icon="✎"
                    aria-label="Edit"
                    disabled={busyId === todo.id}
                    onClick={() => setEditingId(todo.id)}
                  />
                  <Button
                    icon="✕"
                    aria-label="Delete"
                    className="btn-danger"
                    disabled={busyId === todo.id}
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
          onSave={(title, description) => addTodo(title, description)}
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
