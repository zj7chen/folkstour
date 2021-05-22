import { Button, Modal } from "react-bootstrap";

function ConfirmModal({ show, body, onConfirm, onClose }) {
  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Are you sure?</Modal.Title>
      </Modal.Header>
      <Modal.Body>{body}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={async () => {
            await onConfirm?.();
            await onClose?.();
          }}
        >
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ConfirmModal;
