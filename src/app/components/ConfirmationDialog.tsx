import { LoadingButton } from "@mui/lab";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import React, { useState } from "react";

interface ConfirmationDialogProps {
  modelName: string;
  selectedCount: number;
  isOpen: boolean;
  onConfirm: () => Promise<any>;
  onClose: () => void;
}

export default function ConfirmationDialog({
  modelName,
  selectedCount,
  isOpen,
  onConfirm,
  onClose,
}: ConfirmationDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = () => {
    setIsLoading(true);

    onConfirm()
      .then(() => {
        setIsLoading(false);

        onClose();
      });
  };

  const getMessage = () => {
    if (selectedCount === 1) {
      return `Do you want to delete this ${modelName}?`;
    } if (selectedCount === 2) {
      return `Do you want to delete these ${modelName}s?`;
    }
    return `Do you want to delete these ${selectedCount} ${modelName}s?`;
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      aria-labelledby="confirmation-dialog-title"
      aria-describedby="confirmation-dialog-description"
    >
      <DialogTitle id="confirmation-dialog-title">
        {`Remove ${modelName}`}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="confirmation-dialog-description">
          {getMessage()}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <LoadingButton
          autoFocus
          color="error"
          loading={isLoading}
          onClick={handleConfirm}
          variant="contained"
        >
          Confirm
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
