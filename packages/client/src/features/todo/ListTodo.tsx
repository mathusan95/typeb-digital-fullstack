import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Button } from "../../components/Button";
import type { Todo } from "../../store/useTodoStore";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal";
import { EditTodoModal } from "./EditTodoModal";

const PAGE_SIZE = 8;

export function ListTodo() {
  const [todosState, setTodosState] = useState<Todo[]>([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  // sample data from todo.json
  useEffect(() => {
    fetch("/todo.json")
      .then((res) => res.json())
      .then((data: Todo[]) => setTodosState(data));
  }, []);

  const deleting = todosState.find((todo) => todo.id === deletingId) ?? null;
  const editing = todosState.find((todo) => todo.id === editingId) ?? null;
  const visibleTodos = todosState.slice(0, visibleCount);
  const hasMore = visibleCount < todosState.length;

  // delete todo
  function deleteTodo(id: string) {
    setTodosState((todos) => todos.filter((todo) => todo.id !== id));
    setDeletingId(null);
  }

  // mark todo as done or not done
  function setTodoDone(id: string, done: boolean) {
    setTodosState((todos) =>
      todos.map((todo) => (todo.id === id ? { ...todo, done } : todo)),
    );
  }

  // update todo title and description
  function updateTodo(id: string, title: string, description: string | null) {
    setTodosState((todos) =>
      todos.map((todo) =>
        todo.id === id ? { ...todo, title, description } : todo,
      ),
    );
  }

  return (
    <>
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
                      onClick={() => setTodoDone(todo.id, false)}
                    />
                  ) : (
                    <Button
                      icon="✓"
                      aria-label="Mark done"
                      onClick={() => setTodoDone(todo.id, true)}
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
