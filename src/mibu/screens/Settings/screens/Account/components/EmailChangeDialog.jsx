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
  email: Yup.string()
    .email("Invalid email address.")
    .required("Provide an email address.")
    .max(30, "Too long! Provide less than or equal to 254 characters."),
});

const EmailChangeDialog = ({
  alertBoxMargin,
  email,
  error,
  isOpen,
  onAlertClose,
  onAlertCollapseEnter,
  onAlertCollapseExit,
  onClose,
  onSubmit,
}) => (
  <Dialog
    aria-labelledby="email-change-dialog"
    fullWidth
    maxWidth="sm"
    onClose={onClose}
    open={isOpen}
  >
    <Formik
      enableReinitialize
      initialValues={{
        email,
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
          <DialogTitle id="email-change-dialog">Change Email Address</DialogTitle>

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
              Enter new email.
            </DialogContentText>

            <TextField
              autoFocus
              disabled={isSubmitting}
              error={!!(touched.email && errors.email)}
              fullWidth
              helperText={touched.email && errors.email ? errors.email : null}
              id="email"
              label="Email Address"
              margin="normal"
              name="email"
              onBlur={handleBlur}
              onChange={handleChange}
              type="text"
              value={values.email}
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

export default EmailChangeDialog;
