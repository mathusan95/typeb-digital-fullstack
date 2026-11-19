import { FormEvent, useState } from "react";
import { Button } from "../../components/Button";
import { Modal } from "../../components/Modal";

type AddTodoModalProps = {
  onSave: (title: string, description: string | null) => Promise<void>;
  onClose: () => void;
};

export function AddTodoModal({ onSave, onClose }: AddTodoModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    try {
      await onSave(title.trim(), description.trim() || null);
      onClose();
    } catch {
      setSaving(false);
    }
  }

  return (
    <Modal title="Add todo" onClose={saving ? () => undefined : onClose}>
      <form
        className="modal-form"
        onSubmit={(event) => void handleSubmit(event)}
      >
        <label>
          Title
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
            disabled={saving}
          />
        </label>
        <label>
          Description
          <input
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            disabled={saving}
          />
        </label>
        <div className="todo-actions">
          <Button type="submit" className="btn-primary" loading={saving}>
            Add
          </Button>
          <Button className="btn-muted" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}
