import {
  Alert,
  Box,
  Button,
  ButtonPropsColorOverrides,
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
import { TypedUseMutation } from "@reduxjs/toolkit/query/react";
import { GenericResponse, ModelInstance, ModelInstanceFieldValue } from "app/services/api";
import { Formik, FormikHelpers } from "formik";
import { Moment } from "moment";
import React, {
  JSX,
  useEffect,
  useRef,
  useState,
} from "react";
import * as Yup from "yup";

type ChildrenFunction = (props: {
  setCurrentRecord: (record: any) => void;
  setCurrentRemoveRecord: (record: any) => void;
}) => React.ReactNode;

interface GenericSectionProps {
  children: ChildrenFunction;
  createMutation: TypedUseMutation<ModelInstance, Partial<ModelInstance>, any>;
  deleteMutation: TypedUseMutation<GenericResponse, number, any>;
  formContent: any;
  formSchema: Yup.Schema;
  getFormInitialValues: (_addMode: any, _currentRecord: any) => any;
  isModifiable: boolean;
  modifyButtonColor: "inherit" | "primary" | "secondary" | "success" | "error" | "info" | "warning";
  modifyButtonTitle: string;
  nothingToShow: boolean;
  sectionTitle: string;
  sectionScope: string;
  transformPayload: (_values: any) => any;
  updateMutation: TypedUseMutation<ModelInstance, Partial<ModelInstance>, any>;
}

type FormFieldValue = Moment | ModelInstanceFieldValue | undefined;

type FormValues = {
  [key: string]: FormFieldValue;
};

export default function GenericSection({
  children,
  createMutation,
  deleteMutation,
  formContent,
  formSchema,
  getFormInitialValues,
  isModifiable,
  modifyButtonColor,
  modifyButtonTitle,
  nothingToShow,
  sectionTitle,
  sectionScope,
  transformPayload,
  updateMutation,
}: GenericSectionProps) {
  const theme = useTheme();
  const [createItem] = createMutation();
  const [deleteItem] = deleteMutation();
  const [updateItem] = updateMutation();
  const [currentRecord, setCurrentRecord] = useState(null);
  const [currentRemoveRecord, setCurrentRemoveRecord] = useState(null);
  const [isDialogLocked, setIsDialogLocked] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isRemoveDialogLocked, setIsRemoveDialogLocked] = useState(false);
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [error, setError] = useState({ message: null, show: false });
  const [alertBoxMargin, setAlertBoxMargin] = useState(0);
  const dialogContentRef = useRef<HTMLDivElement | null>(null);
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

  const handleEditDialogSubmit = (values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
    setIsDialogLocked(true);
    handleErrorAlertClose();

    const payload = transformPayload(values);

    if (currentRecord) {
      createItem(payload)
        .then((res) => {
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
      updateItem(payload)
        .then((res) => {
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

    deleteItem((currentRemoveRecord as unknown as { id: number }).id)
      .then(() => {
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
          sx={{ paddingBottom: 3 }}
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
            onEntered={handleAlertCollapseEnter}
            onExited={handleAlertCollapseExit}
            sx={{
              mb: alertBoxMargin,
              width: "100%",
            }}
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
        disableRestoreFocus
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
}
