import {
  Alert,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Typography,
} from "@mui/material";
import { Formik } from "formik";
import React from "react";
import * as Yup from "yup";

const ValidationSchema = Yup.object({
  template: Yup.string()
    .required("You must select a template."),
});

function ResumeTemplateChangeDialog({
  alertBoxMargin,
  error,
  isOpen,
  onAlertClose,
  onAlertCollapseEnter,
  onAlertCollapseExit,
  onClose,
  onSubmit,
  template,
  templates,
}) {
  return (
    <Dialog
      aria-labelledby="resume-template-change-dialog"
      disableRestoreFocus
      fullWidth
      maxWidth="sm"
      onClose={onClose}
      open={isOpen}
    >
      <Formik
        enableReinitialize
        initialValues={{
          template: template.id,
        }}
        onSubmit={onSubmit}
        validationSchema={ValidationSchema}
      >
        {({
          dirty,
          // errors,
          handleSubmit,
          isSubmitting,
          setFieldValue,
          // touched,
          // values,
        }) => (
          <form className="mui-dialog-form" onSubmit={handleSubmit}>
            <DialogTitle
              id="resume-template-change-dialog"
            >
              Change Résumé Template
            </DialogTitle>

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
                Select a template.
              </DialogContentText>

              <Grid
                container
                spacing={2}
              >
                {templates.map((item) => (
                  <Grid
                    item
                    key={item.id}
                    md={3}
                    sm={4}
                  >
                    <Card>
                      <CardActionArea
                        onClick={() => {
                          setFieldValue("template", item.id);
                        }}
                      >
                        <CardContent>
                          <Typography variant="body1">
                            {item.name}
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                ))}
              </Grid>
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

export default ResumeTemplateChangeDialog;
