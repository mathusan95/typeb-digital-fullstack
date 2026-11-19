import { useEffect, useState } from "react";
import { Button } from "../../components/Button";
import type { Todo } from "../../store/useTodoStore";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal";
import { EditTodoModal } from "./EditTodoModal";

export function ListTodo() {
  const [todosState, setTodosState] = useState<Todo[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  // sample data from todo.json
  useEffect(() => {
    fetch("/todo.json")
      .then((res) => res.json())
      .then((data) => setTodosState(data));
  }, [setTodosState]);

  const deleting = todosState.find((todo) => todo.id === deletingId) ?? null;
  const editing = todosState.find((todo) => todo.id === editingId) ?? null;

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
      <ul>
        {todosState.map((todo) => (
          <li key={todo.id} className="todo-row">
            <span className={todo.done ? "todo-done" : undefined}>
              {todo.title} - {todo.description} -{" "}
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
