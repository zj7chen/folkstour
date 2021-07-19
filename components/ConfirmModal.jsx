import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function ConfirmModal({ show, body, onConfirm, onClose }) {
  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{onConfirm ? "Are you sure?" : "Alert"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{body}</Modal.Body>
      <Modal.Footer>
        {onConfirm ? (
          <>
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={async () => {
                await onConfirm();
                await onClose?.();
              }}
            >
              Confirm
            </Button>
          </>
        ) : (
          <Button variant="secondary" onClick={onClose}>
            OK
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}

export default ConfirmModal;
