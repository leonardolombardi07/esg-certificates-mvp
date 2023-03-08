import type { ModalProps } from "semantic-ui-react";
import { Button, Modal } from "semantic-ui-react";

interface ConfirmProps extends ModalProps {
  header: string;
  message?: string;
  cancelButton: string;
  confirmButton: string;
  onConfirm: (
    event: React.MouseEvent<HTMLButtonElement>,
    data: ConfirmProps
  ) => void;
  onCancel: (
    event: React.MouseEvent<HTMLButtonElement>,
    data: ConfirmProps
  ) => void;
}

function Confirm(props: ConfirmProps) {
  const {
    header,
    message,
    cancelButton,
    confirmButton,
    onCancel,
    onConfirm,
    ...rest
  } = props;

  return (
    <Modal size="large" closeOnEscape closeOnDimmerClick {...rest}>
      <Modal.Header>{header}</Modal.Header>
      {message && (
        <Modal.Content>
          <p>{message}</p>
        </Modal.Content>
      )}
      <Modal.Actions>
        <Button
          size="large"
          onClick={(event) => onCancel(event, props)}
          negative
        >
          {cancelButton}
        </Button>

        <Button
          size="large"
          type="submit"
          onClick={(event) => onConfirm(event, props)}
          positive
        >
          {confirmButton}
        </Button>
      </Modal.Actions>
    </Modal>
  );
}

export { Confirm };
