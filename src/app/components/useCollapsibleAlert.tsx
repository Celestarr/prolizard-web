import { Alert, Box, Collapse } from "@mui/material";
import React, { useCallback, useState } from "react";

interface ErrorState {
  message: string | null;
  show: boolean;
}

function useCollapsibleAlert() {
  const [error, setError] = useState<ErrorState>({ message: null, show: false });
  const [alertBoxMargin, setAlertBoxMargin] = useState<number>(0);

  const handleAlertCollapseEnter = useCallback(() => {
    setAlertBoxMargin(2);
  }, []);

  const handleAlertCollapseExit = useCallback(() => {
    setAlertBoxMargin(0);
  }, []);

  const handleErrorAlertClose = useCallback(() => {
    setError((prev) => ({ ...prev, show: false }));
    setAlertBoxMargin(0);
  }, []);

  const setErrorMessage = useCallback((message: string) => {
    setError({ message, show: true });
  }, []);

  const clearError = useCallback(() => {
    setError({ message: null, show: false });
  }, []);

  function ErrorComponent() {
    return (
      <Collapse
        component={Box}
        in={error.show}
        onEntered={handleAlertCollapseEnter}
        onExited={handleAlertCollapseExit}
        sx={{
          mb: alertBoxMargin,
          width: "100%",
        }}
      >
        <Alert onClose={handleErrorAlertClose} severity="error">
          {error.message}
        </Alert>
      </Collapse>
    );
  }

  return { ErrorComponent, setErrorMessage, clearError };
}

export default useCollapsibleAlert;
