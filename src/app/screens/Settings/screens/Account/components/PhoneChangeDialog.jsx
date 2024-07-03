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
  phone: Yup.string()
    // .required('Provide a phone number.')
    .max(50, "Too long! Provide less than or equal to 50 characters.")
    .notRequired(),
});

function PhoneChangeDialog({
  alertBoxMargin,
  error,
  isOpen,
  onAlertClose,
  onAlertCollapseEnter,
  onAlertCollapseExit,
  onClose,
  onSubmit,
  phone,
}) {
  return (
    <Dialog
      aria-labelledby="phone-change-dialog"
      disableRestoreFocus
      fullWidth
      maxWidth="sm"
      onClose={onClose}
      open={isOpen}
    >
      <Formik
        enableReinitialize
        initialValues={{
          phone,
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
            <DialogTitle id="phone-change-dialog">Change Phone Number</DialogTitle>

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
                Enter new phone number.
              </DialogContentText>

              <TextField
                autoFocus
                disabled={isSubmitting}
                error={!!(touched.phone && errors.phone)}
                fullWidth
                helperText={touched.phone && errors.phone ? errors.phone : null}
                id="phone"
                label="Phone"
                margin="normal"
                name="phone"
                onBlur={handleBlur}
                onChange={handleChange}
                type="text"
                value={values.phone}
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

export default PhoneChangeDialog;
