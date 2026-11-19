import { Button } from "../../components/Button";
import { Modal } from "../../components/Modal";
import type { Todo } from "../../store/useTodoStore";

type ConfirmDeleteModalProps = {
  todo: Todo;
  onConfirm: () => void;
  onClose: () => void;
};

export function ConfirmDeleteModal({
  todo,
  onConfirm,
  onClose,
}: ConfirmDeleteModalProps) {
  return (
    <Modal title="Delete todo" onClose={onClose}>
      <p>Delete “{todo.title}”? This cannot be undone.</p>
      <div className="todo-actions">
        <Button className="btn-danger" onClick={onConfirm}>
          Delete
        </Button>
        <Button onClick={onClose}>Cancel</Button>
      </div>
    </Modal>
  );
}
