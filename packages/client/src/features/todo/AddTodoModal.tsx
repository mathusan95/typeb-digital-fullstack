import { FormEvent, useState } from "react";
import { Button } from "../../components/Button";
import { Modal } from "../../components/Modal";

type AddTodoModalProps = {
  onSave: (title: string, description: string | null) => void;
  onClose: () => void;
};

export function AddTodoModal({ onSave, onClose }: AddTodoModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSave(title.trim(), description.trim() || null);
    onClose();
  }

  return (
    <Modal title="Add todo" onClose={onClose}>
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
          <Button type="submit">Add</Button>
          <Button onClick={onClose}>Cancel</Button>
        </div>
      </form>
    </Modal>
  );
}
