import {
  Alert,
  Box,
  Button,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { TypedUseQuery } from "@reduxjs/toolkit/query/react";
import { FormFieldConfig, ModelConfig } from "app/services/api";
import { Field, Form, Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import * as Yup from "yup";

import DatePicker from "./DatePicker";

const createYupSchema = (config: ModelConfig) => {
  const schema: any = {};

  config.fields.forEach((field) => {
    if (field.type === "email") {
      schema[field.name] = Yup.string().email("Invalid email address");

      if (field.required) {
        schema[field.name] = schema[field.name].required(`${field.verbose_name} is required`);
      }
    } else if (field.type === "integer") {
      schema[field.name] = Yup.number().integer();

      if (field.required) {
        schema[field.name] = schema[field.name].required(`${field.verbose_name} is required`);
      }

      if (field.max_length) {
        schema[field.name] = schema[field.name].max(
          field.max_length,
          `${field.verbose_name} must be at most ${field.max_length}`,
        );
      }

      if (field.min_length) {
        schema[field.name] = schema[field.name].min(
          field.min_length,
          `${field.verbose_name} must be at least ${field.min_length}`,
        );
      }
    } else if (field.type === "string") {
      schema[field.name] = Yup.string();

      if (field.required) {
        schema[field.name] = schema[field.name].required(`${field.verbose_name} is required`);
      }

      if (field.max_length) {
        schema[field.name] = schema[field.name].max(
          field.max_length,
          `${field.verbose_name} must be at most ${field.max_length} characters`,
        );
      }

      if (field.min_length) {
        schema[field.name] = schema[field.name].min(
          field.min_length,
          `${field.verbose_name} must be at least ${field.min_length} characters`,
        );
      }
    }
    // Add more field types as needed
  });

  return Yup.object().shape(schema);
};

type FormValues = {
  [key: string]: string | null;
};

interface DynamicFormProps {
  getModelConfigQuery: TypedUseQuery<ModelConfig, void, any>;
  instanceValues?: FormValues;
  isOpen: boolean;
  onClose: () => void;
}

export default function DynamicForm({
  getModelConfigQuery,
  instanceValues,
  isOpen,
  onClose,
}: DynamicFormProps) {
  const theme = useTheme();
  const {
    data,
    error: loadingError,
    isLoading,
  } = getModelConfigQuery();
  const [isDialogLocked, setIsDialogLocked] = useState(false);
  const [error, setError] = useState({ message: null, show: false });
  const [alertBoxMargin, setAlertBoxMargin] = useState(0);
  const dialogContentRef = useRef(null);
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  if (!data || isLoading) {
    return <div>Loading...</div>;
  }

  if (loadingError) {
    return <div>ERR</div>;
  }

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

  const handleDialogClose = () => {
    if (!isDialogLocked) {
      handleErrorAlertClose();
      onClose();
    }
  };

  const initialValues: FormValues = instanceValues || data.fields.reduce((acc, field) => {
    acc[field.name] = field.type === "string" ? "" : null;
    return acc;
  }, {} as FormValues);

  const validationSchema = createYupSchema(data);

  return (
    <Dialog
      aria-labelledby="edit-dialog"
      disableRestoreFocus
      fullScreen={fullScreen}
      fullWidth
      maxWidth="sm"
      onClose={handleDialogClose}
      open={isOpen}
    >
      <Formik
        enableReinitialize
        initialValues={initialValues}
        onSubmit={(values, { setSubmitting }) => {
          // Handle form submission
          console.log(values);
          setSubmitting(false);
        }}
        validationSchema={validationSchema}
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
          <Form onSubmit={handleSubmit}>
            <DialogTitle
              id={`${!instanceValues ? "add" : "edit"}-dialog`}
            >
              {!instanceValues ? "Add" : "Edit"}
              {" "}
              {data.verbose_name}
            </DialogTitle>
            <DialogContent ref={dialogContentRef}>
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
              {data.layout.map((row, rowIndex) => (
                <Grid
                  container
                  spacing={2}
                  key={row.row}
                >
                  {row.fields.map((fieldName, fieldIndex) => {
                    const field = data.fields.find((f) => f.name === fieldName) as FormFieldConfig;

                    return (
                      <Grid
                        item
                        xs={12}
                        sm={row.sizes[fieldIndex]}
                        key={fieldName}
                      >
                        {field.type === "date" && (
                          <DatePicker
                            error={!!(touched[field.name] && errors[field.name])}
                            helperText={touched[field.name] && errors[field.name] ? errors[field.name] : null}
                            id={`${field.name}-date-picker`}
                            label={field.verbose_name}
                            name={field.name}
                            onBlur={() => {
                              setFieldTouched(field.name, true);
                            }}
                            onChange={(newValue: any) => {
                              setFieldValue(field.name, newValue);
                            }}
                            required={field.required}
                            value={values[field.name]}
                          />
                        )}
                        {field.type === "string" && (
                          <TextField
                            autoFocus={row.row === 1 && !fieldIndex}
                            error={!!(touched[field.name] && errors[field.name])}
                            fullWidth
                            helperText={touched[field.name] && errors[field.name] ? errors[field.name] : null}
                            id={field.name}
                            InputProps={{
                              onBlur: handleBlur,
                              onChange: handleChange,
                            }}
                            label={field.verbose_name}
                            margin="normal"
                            name={field.name}
                            required={field.required}
                            value={values[field.name]}
                            variant="outlined"
                          />
                        )}
                      </Grid>
                    );
                  })}
                </Grid>
              ))}
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleDialogClose}
              >
                Cancel
              </Button>
              <Button
                color="primary"
                disabled={isSubmitting}
                type="submit"
              >
                Submit
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
}
