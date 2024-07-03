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
import APIService from "app/services/api";
import isEmpty from "app/utils/isEmpty";
import { Formik, FormikHelpers, FormikValues } from "formik";
import moment, { Moment } from "moment";
import React, { useEffect, useRef, useState } from "react";
import { IJobTracker } from "types/apiTypes.ts";
import * as Yup from "yup";

const Schema = Yup.object({
  companyName: Yup.string().required("Required"),
  applicationDate: Yup.date().nullable(),
  applicationDeadline: Yup.date().nullable(),
  interviewRound: Yup.string().notRequired(),
  notes: Yup.string().notRequired(),
  positionTitle: Yup.string().required("Required"),
  status: Yup.string().required("Required"),
});

interface ISchema {
  companyName: string;
  applicationDate: Moment | null;
  applicationDeadline: Moment | null;
  interviewRound: string | null;
  notes: string | null;
  positionTitle: string;
  status: string;
}

const defaultInitialValues = {
  companyName: "",
  applicationDate: null,
  applicationDeadline: null,
  interviewRound: "",
  notes: "",
  positionTitle: "",
  status: "",
};

interface EditDialogProps {
  existingItem: IJobTracker | undefined;
  isOpen: boolean;
  onClose: () => void;
  onEditSuccess: () => void;
}

const transformPayload = (values: ISchema) => ({
  company_name: values.companyName,
  application_date: values.applicationDate ? values.applicationDate.format("YYYY-MM-DD") : null,
  application_deadline: values.applicationDeadline ? values.applicationDeadline.format("YYYY-MM-DD") : null,
  interview_round: !isEmpty(values.interviewRound) ? values.interviewRound : null,
  notes: !isEmpty(values.notes) ? values.notes : null,
  position_title: values.positionTitle,
  status: values.status,
});

export default function EditDialog({
  existingItem,
  isOpen,
  onClose,
  onEditSuccess,
}: EditDialogProps) {
  const theme = useTheme();
  const [isDialogLocked, setIsDialogLocked] = useState(false);
  const [error, setError] = useState({ message: null, show: false });
  const [alertBoxMargin, setAlertBoxMargin] = useState(0);
  const dialogContentRef = useRef<HTMLDivElement | null>(null);
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const addMode = !existingItem;

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
      onClose();
    }
  };

  const handleEditDialogSubmit = (values: ISchema, { setSubmitting }: FormikHelpers<ISchema>) => {
    setIsDialogLocked(true);
    handleErrorAlertClose();

    const payload = transformPayload(values);

    if (addMode) {
      APIService.Career.createJobTracker(payload)
        .then(() => {
          onEditSuccess();
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
      APIService.Career.updateJobTracker(existingItem.id, payload)
        .then(() => {
          onEditSuccess();
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

  return (
    <Dialog
      aria-labelledby="edit-dialog"
      disableRestoreFocus
      fullScreen={fullScreen}
      fullWidth
      maxWidth="sm"
      onClose={handleEditDialogClose}
      open={isOpen}
    >
      <Formik
        enableReinitialize
        initialValues={(
          existingItem === undefined ? defaultInitialValues
            : ({
              companyName: existingItem.company_name,
              applicationDate: existingItem.application_date ? moment(existingItem.application_date) : null,
              applicationDeadline: existingItem.application_deadline
                ? moment(existingItem.application_deadline)
                : null,
              interviewRound: existingItem.interview_round,
              notes: existingItem.notes,
              positionTitle: existingItem.position_title,
              status: existingItem.status,
            })
        )}
        onSubmit={handleEditDialogSubmit}
        validationSchema={Schema}
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
              Job Tracker
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
  );
}
