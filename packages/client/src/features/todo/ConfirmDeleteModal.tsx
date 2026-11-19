import { useState } from "react";
import { Button } from "../../components/Button";
import { Modal } from "../../components/Modal";
import type { Todo } from "shared";

type ConfirmDeleteModalProps = {
  todo: Todo;
  onConfirm: () => Promise<void>;
  onClose: () => void;
};

export function ConfirmDeleteModal({
  todo,
  onConfirm,
  onClose,
}: ConfirmDeleteModalProps) {
  const [saving, setSaving] = useState(false);

  async function handleConfirm() {
    setSaving(true);
    try {
      await onConfirm();
      onClose();
    } catch {
      setSaving(false);
    }
  }

  return (
    <Modal title="Delete todo" onClose={saving ? () => undefined : onClose}>
      <p>Delete “{todo.title}”? This cannot be undone.</p>
      <div className="todo-actions">
        <Button
          className="btn-danger"
          loading={saving}
          onClick={() => void handleConfirm()}
        >
          Delete
        </Button>
        <Button className="btn-muted" onClick={onClose} disabled={saving}>
          Cancel
        </Button>
      </div>
    </Modal>
  );
}
