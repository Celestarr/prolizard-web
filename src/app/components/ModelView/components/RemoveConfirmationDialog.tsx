import { LoadingButton } from "@mui/lab";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";

interface RemoveConfirmationDialogProps {
  modelName: string;
  selectedCount: number;
  isOpen: boolean;
  onConfirm: () => Promise<any>;
  onClose: () => void;
}

export default function RemoveConfirmationDialog({
  modelName,
  selectedCount,
  isOpen,
  onConfirm,
  onClose,
}: RemoveConfirmationDialogProps) {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

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
      aria-labelledby="remove-confirmation-dialog-title"
      aria-describedby="remove-confirmation-dialog-description"
      fullScreen={fullScreen}
      fullWidth
      maxWidth="sm"
      open={isOpen}
      onClose={onClose}
    >
      <DialogTitle id="remove-confirmation-dialog-title">
        {`Remove ${modelName}`}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="remove-confirmation-dialog-description">
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
