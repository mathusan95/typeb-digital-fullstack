import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Button } from "../../components/Button";
import { Loading } from "../../components/Loading";
import { useToast } from "../../components/Toast";
import { useTodoStore } from "../../store/useTodoStore";
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
  const todos = useTodoStore((state) => state.todos);
  const hasMore = useTodoStore((state) => state.hasMore);
  const isLoading = useTodoStore((state) => state.isLoading);
  const errorMessage = useTodoStore((state) => state.errorMessage);
  const setInitialPage = useTodoStore((state) => state.setInitialPage);
  const appendPage = useTodoStore((state) => state.appendPage);
  const addTodoToStore = useTodoStore((state) => state.addTodo);
  const replaceTodo = useTodoStore((state) => state.replaceTodo);
  const removeTodo = useTodoStore((state) => state.removeTodo);
  const setLoading = useTodoStore((state) => state.setLoading);
  const setError = useTodoStore((state) => state.setError);

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const toast = useToast();

  async function loadTodos() {
    setError(null);
    try {
      const page = await fetchTodos(0, PAGE_SIZE);
      setInitialPage(page.items, page.hasMore);
    } catch (error: unknown) {
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;

    fetchTodos(0, PAGE_SIZE)
      .then((page) => {
        if (!cancelled) {
          setInitialPage(page.items, page.hasMore);
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setError(getErrorMessage(error));
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [setError, setInitialPage, setLoading]);

  const deleting = todos.find((todo) => todo.id === deletingId) ?? null;
  const editing = todos.find((todo) => todo.id === editingId) ?? null;

  async function loadMore() {
    try {
      const skip = useTodoStore.getState().todos.length;
      const page = await fetchTodos(skip, PAGE_SIZE);
      appendPage(page.items, page.hasMore);
    } catch (error: unknown) {
      setError(getErrorMessage(error));
    }
  }

  async function deleteTodo(id: string) {
    try {
      await deleteTodoApi(id);
      removeTodo(id);
      toast.show("Todo deleted");
    } catch (error: unknown) {
      setError(getErrorMessage(error));
      throw error;
    }
  }

  async function setTodoDone(id: string) {
    setBusyId(id);
    try {
      const updated = await toggleTodoDone(id);
      replaceTodo(updated);
    } catch (error: unknown) {
      setError(getErrorMessage(error));
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
      replaceTodo(updated);
      toast.show("Todo updated");
    } catch (error: unknown) {
      setError(getErrorMessage(error));
      throw error;
    }
  }

  async function addTodo(title: string, description: string | null) {
    try {
      const created = await createTodo(title, description);
      addTodoToStore(created);
      toast.show("Todo created");
    } catch (error: unknown) {
      setError(getErrorMessage(error));
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
              setLoading(true);
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
          dataLength={todos.length}
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
            {todos.map((todo) => (
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
