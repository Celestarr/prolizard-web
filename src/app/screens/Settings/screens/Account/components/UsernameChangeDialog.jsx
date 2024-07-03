import {
  Alert,
  Box,
  Button,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import { Formik } from "formik";
import React from "react";
import * as Yup from "yup";

const ValidationSchema = Yup.object({
  username: Yup.string()
    .required("Username is required.")
    .matches(/^[A-Z0-9_]+$/i, "Only digits (0-9), letters (a-z) and underscore (_) allowed.")
    .min(3, "Too short! Provide more than or equal to 3 characters.")
    .max(30, "Too long! Provide less than or equal to 30 characters."),
});

function UsernameChangeDialog({
  alertBoxMargin,
  error,
  isOpen,
  onAlertClose,
  onAlertCollapseEnter,
  onAlertCollapseExit,
  onClose,
  onSubmit,
  username,
}) {
  return (
    <Dialog
      aria-labelledby="username-change-dialog"
      disableRestoreFocus
      fullWidth
      maxWidth="sm"
      onClose={onClose}
      open={isOpen}
    >
      <Formik
        enableReinitialize
        initialValues={{
          username,
        }}
        onSubmit={onSubmit}
        validationSchema={ValidationSchema}
      >
        {({
          dirty,
          errors,
          handleBlur,
          handleChange,
          handleSubmit,
          isSubmitting,
          touched,
          values,
        }) => (
          <form className="mui-dialog-form" onSubmit={handleSubmit}>
            <DialogTitle id="username-change-dialog">Change Username</DialogTitle>

            <DialogContent>
              <Collapse
                component={Box}
                in={error.show}
                mb={alertBoxMargin}
                onEntered={onAlertCollapseEnter}
                onExited={onAlertCollapseExit}
                width="100%"
              >
                <Alert
                  onClose={onAlertClose}
                  severity="error"
                >
                  {error.message}
                </Alert>
              </Collapse>

              <DialogContentText>
                Enter new username.
              </DialogContentText>

              <TextField
                autoFocus
                disabled={isSubmitting}
                error={!!(touched.username && errors.username)}
                fullWidth
                helperText={touched.username && errors.username ? errors.username : null}
                id="username"
                label="Username"
                margin="normal"
                name="username"
                onBlur={handleBlur}
                onChange={handleChange}
                type="text"
                value={values.username}
              />
            </DialogContent>
            <DialogActions>
              <Button
                disabled={isSubmitting}
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                color="primary"
                disabled={isSubmitting || !dirty}
                type="submit"
              >
                Change
              </Button>
            </DialogActions>
          </form>
        )}
      </Formik>
    </Dialog>
  );
}

export default UsernameChangeDialog;
