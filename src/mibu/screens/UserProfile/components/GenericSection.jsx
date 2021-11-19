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
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";

const GenericSection = ({
  children,
  isModifiable,
  modifyButtonColor,
  modifyButtonTitle,
  nothingToShow,
  sectionTitle,
  createSvc,
  deleteSvc,
  updateSvc,
  syncCurrentUserData,
  formSchema,
  getFormInitialValues,
  formContent,
  sectionScope,
  transformPayload,
}) => {
  const theme = useTheme();
  const [currentRecord, setCurrentRecord] = useState(null);
  const [currentRemoveRecord, setCurrentRemoveRecord] = useState(null);
  const [isDialogLocked, setIsDialogLocked] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isRemoveDialogLocked, setIsRemoveDialogLocked] = useState(false);
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [error, setError] = useState({ message: null, show: false });
  const [alertBoxMargin, setAlertBoxMargin] = useState(0);
  const dialogContentRef = useRef(null);
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (currentRecord) {
      // Open edit dialog only after setting record
      setIsEditDialogOpen(true);
    }
  }, [currentRecord]);

  useEffect(() => {
    if (currentRemoveRecord) {
      // Open remove dialog only after setting record
      setIsRemoveDialogOpen(true);
    }
  }, [currentRemoveRecord]);

  const addMode = !currentRecord;

  const handleAlertCollapseEnter = () => {
    setAlertBoxMargin(2);
  };

  const handleAlertCollapseExit = () => {
    setAlertBoxMargin(0);
  };

  const handleErrorAlertClose = () => {
    setError({ ...error, show: false });
    setAlertBoxMargin(0);
  };

  const handleEditDialogClose = () => {
    if (!isDialogLocked) {
      handleErrorAlertClose();
      setCurrentRecord(null);
      setIsEditDialogOpen(false);
    }
  };

  const handleEditDialogOpen = () => {
    setIsEditDialogOpen(true);
  };

  const handleEditDialogSubmit = (values, { setSubmitting }) => {
    setIsDialogLocked(true);
    handleErrorAlertClose();

    const payload = transformPayload(values);

    if (currentRecord) {
      updateSvc(currentRecord.id, payload)
        .then((res) => {
          syncCurrentUserData(`${sectionScope}.update`, res);
          setSubmitting(false);
          setIsDialogLocked(false);
          setIsEditDialogOpen(false);
          setCurrentRecord(null);
        })
        .catch((err) => {
          setError({ message: err.message, show: true });
          if (dialogContentRef.current) {
            dialogContentRef.current.scrollTo({
              top: 0,
              behavior: "smooth",
            });
          }
          setSubmitting(false);
          setIsDialogLocked(false);
        });
    } else {
      createSvc(payload)
        .then((res) => {
          syncCurrentUserData(`${sectionScope}.create`, res);
          setSubmitting(false);
          setIsDialogLocked(false);
          setIsEditDialogOpen(false);
          setCurrentRecord(null);
        })
        .catch((err) => {
          setError({ message: err.message, show: true });
          if (dialogContentRef.current) {
            dialogContentRef.current.scrollTo({
              top: 0,
              behavior: "smooth",
            });
          }
          setSubmitting(false);
          setIsDialogLocked(false);
        });
    }
  };

  const handleRemoveDialogClose = () => {
    if (!isRemoveDialogLocked) {
      handleErrorAlertClose();
      setCurrentRemoveRecord(null);
      setIsRemoveDialogOpen(false);
    }
  };

  const handleRemove = () => {
    handleErrorAlertClose();
    setIsRemoveDialogLocked(true);
    setIsRemoving(true);

    deleteSvc(currentRemoveRecord.id)
      .then(() => {
        syncCurrentUserData(`${sectionScope}.delete`, currentRemoveRecord.id);
        setIsRemoving(false);
        setIsRemoveDialogLocked(false);
        setIsRemoveDialogOpen(false);
        setCurrentRemoveRecord(null);
      })
      .catch((err) => {
        setError({ message: err.message, show: true });
        setIsRemoving(false);
        setIsRemoveDialogLocked(false);
      });
  };

  return (
    <>
      <Box>
        <Box
          alignItems="center"
          display="flex"
          flexDirection="row"
          flexWrap="nowrap"
          sx={{ paddingBottom: 2 }}
        >
          <Box
            flexGrow={1}
          >
            <Typography color={theme.palette.primary.main} variant="h6">
              {sectionTitle}
            </Typography>
          </Box>
          {isModifiable && (
            <Box>
              <Button
                color={modifyButtonColor || "default"}
                variant="contained"
                size="small"
                onClick={handleEditDialogOpen}
              >
                {modifyButtonTitle}
              </Button>
            </Box>
          )}
        </Box>
        {nothingToShow && (
          <Typography color="textSecondary" variant="body1">
            Nothing to show.
          </Typography>
        )}
        {!nothingToShow && (
          <>
            {children({ setCurrentRecord, setCurrentRemoveRecord })}
          </>
        )}
      </Box>

      <Dialog
        aria-describedby="remove-dialog-description"
        aria-labelledby="remove-dialog"
        fullScreen={fullScreen}
        fullWidth
        maxWidth="sm"
        onClose={handleRemoveDialogClose}
        open={isRemoveDialogOpen}
      >
        <DialogTitle id="remove-dialog">
          Remove
          {" "}
          {sectionTitle}
        </DialogTitle>
        <DialogContent>
          <Collapse
            component={Box}
            in={error.show}
            mb={alertBoxMargin}
            onEntered={handleAlertCollapseEnter}
            onExited={handleAlertCollapseExit}
            width="100%"
          >
            <Alert
              onClose={handleErrorAlertClose}
              severity="error"
            >
              {error.message}
            </Alert>
          </Collapse>

          <DialogContentText id="remove-dialog-description">
            Do you really want to remove this information?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRemoveDialogClose}>
            Cancel
          </Button>
          <Button
            disabled={isRemoving}
            onClick={handleRemove}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        aria-labelledby="edit-dialog"
        fullScreen={fullScreen}
        fullWidth
        maxWidth="sm"
        onClose={handleEditDialogClose}
        open={isEditDialogOpen}
      >
        <Formik
          enableReinitialize
          initialValues={getFormInitialValues(addMode, currentRecord)}
          onSubmit={handleEditDialogSubmit}
          validationSchema={formSchema}
        >
          {({
            errors,
            handleBlur,
            handleChange,
            handleSubmit,
            isSubmitting,
            setFieldValue,
            setFieldTouched,
            touched,
            values,
          }) => (
            <form className="mui-dialog-form" onSubmit={handleSubmit}>
              <DialogTitle id={`${addMode ? "add" : "edit"}-dialog`}>
                {addMode ? "Add" : "Edit"}
                {" "}
                {sectionTitle}
              </DialogTitle>
              <DialogContent ref={dialogContentRef}>
                {formContent({
                  alertBoxMargin,
                  error,
                  errors,
                  handleAlertCollapseEnter,
                  handleAlertCollapseExit,
                  handleErrorAlertClose,
                  handleBlur,
                  handleChange,
                  handleSubmit,
                  isSubmitting,
                  setFieldValue,
                  setFieldTouched,
                  touched,
                  values,
                })}
              </DialogContent>
              <DialogActions>
                <Button onClick={handleEditDialogClose}>
                  Cancel
                </Button>
                <Button color="primary" disabled={isSubmitting} type="submit">
                  Submit
                </Button>
              </DialogActions>
            </form>
          )}
        </Formik>
      </Dialog>
    </>
  );
};

export default GenericSection;
