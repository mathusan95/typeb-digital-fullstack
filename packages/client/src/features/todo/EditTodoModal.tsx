import { FormEvent, useState } from "react";
import { Button } from "../../components/Button";
import { Modal } from "../../components/Modal";
import type { Todo } from "../../store/useTodoStore";

type EditTodoModalProps = {
  todo: Todo;
  onSave: (title: string, description: string | null) => void;
  onClose: () => void;
};

export function EditTodoModal({ todo, onSave, onClose }: EditTodoModalProps) {
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description ?? "");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSave(title.trim(), description.trim() || null);
    onClose();
  }

  return (
    <Modal title="Edit todo" onClose={onClose}>
      <form className="modal-form" onSubmit={handleSubmit}>
        <label>
          Title
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />
        </label>
        <label>
          Description
          <input
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </label>
        <div className="todo-actions">
          <Button type="submit" className="btn-primary">
            Save
          </Button>
          <Button className="btn-muted" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}
