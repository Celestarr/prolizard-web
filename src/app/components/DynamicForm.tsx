import {
  Alert,
  Autocomplete,
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
import {
  TypedUseMutation,
  TypedUseQuery,
} from "@reduxjs/toolkit/query/react";
import {
  FormFieldConfig,
  ModelConfig,
  ModelInstance,
  ModelInstanceFieldValue,
} from "app/services/api";
import {
  Field,
  Form,
  Formik,
  FormikHelpers,
} from "formik";
import moment, { Moment } from "moment";
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
    } else if (field.type === "string" || field.type === "text") {
      if (field.choices) {
        schema[field.name] = Yup.object().shape({
          value: Yup.string().required(`${field.verbose_name} is required`),
          label: Yup.string().required(),
        });
      } else {
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
    }
    // Add more field types as needed
  });

  return Yup.object().shape(schema);
};

interface AutocompleteValue {
  label: string;
  value: string;
}

type FormFieldValue = AutocompleteValue | Moment | ModelInstanceFieldValue | undefined;

type FormValues = {
  [key: string]: FormFieldValue;
};

function transformFormValuesForSubmission(values: FormValues): ModelInstance {
  return Object.entries(values).reduce((acc, [key, value]) => {
    if (typeof value === "number") {
      acc[key] = value;
    } else if (typeof value === "string") {
      acc[key] = value;
    } else if (value === undefined || value === null) {
      acc[key] = null;
    } else if (moment.isMoment(value)) {
      acc[key] = value.format("YYYY-MM-DD");
    } else if (typeof value === "object" && "value" in value) {
      acc[key] = (value as AutocompleteValue).value as string;
    } else {
      // Handle any other cases or throw an error
      console.warn(`Unexpected value type for key ${key}:`, value);
      acc[key] = null;
    }
    return acc;
  }, {} as ModelInstance);
}

function transformInstanceValuesForForm(
  values: ModelInstance | null | undefined,
  modelConfig: ModelConfig,
): FormValues | null | undefined {
  if (!values) {
    return values;
  }

  return Object.entries(values).reduce((acc, [key, value]) => {
    if (key === "id") {
      acc[key] = value as number;

      return acc;
    }

    const field = modelConfig.fields.find((f) => f.name === key) as FormFieldConfig;

    switch (field.type) {
      case "date":
        acc[key] = value ? moment(value) : null;
        break;
      case "email":
        acc[key] = (value || "") as string;
        break;
      case "integer":
        acc[key] = value as number;
        break;
      case "string":
      case "text":
        if (field.choices) {
          const choice = field.choices.find((x) => x[0] === value);
          acc[key] = value && choice
            ? { label: choice[1], value: choice[0] }
            : null;
        } else {
          acc[key] = (value || "") as string;
        }
        break;
      default:
        console.warn(`Unexpected value type for key ${key}:`, value);
        acc[key] = null;
    }

    return acc;
  }, {} as FormValues);
}

interface DynamicFormProps {
  createModelInstance: TypedUseMutation<ModelInstance, Partial<ModelInstance>, any>;
  getModelConfig: TypedUseQuery<ModelConfig, void, any>;
  instanceValues?: ModelInstance | null;
  isOpen: boolean;
  onClose: () => void;
  updateModelInstance: TypedUseMutation<ModelInstance, Partial<ModelInstance>, any>;
}

function getFieldInitialValue(field: FormFieldConfig) {
  if (field.type === "string" || field.type === "text") {
    if (field.choices) {
      return null;
    }

    return "";
  }

  return null;
}

export default function DynamicForm({
  createModelInstance,
  getModelConfig,
  instanceValues,
  isOpen,
  onClose,
  updateModelInstance,
}: DynamicFormProps) {
  const theme = useTheme();
  const {
    data,
    error: loadingError,
    isLoading,
  } = getModelConfig();
  const [createItem] = createModelInstance();
  const [updateItem] = updateModelInstance();
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

  const resetDialog = () => {
    setIsDialogLocked(false);
    setError({ message: null, show: false });
    setAlertBoxMargin(0);
  };

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

  const handleFormSubmit = (values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
    setIsDialogLocked(true);

    const transformedValues = transformFormValuesForSubmission(values);

    const mutation = transformedValues.id ? updateItem : createItem;

    mutation(transformedValues)
      .then(({ error: err }) => {
        if (err) {
          throw err;
        } else {
          resetDialog();
          onClose();
        }
      })
      .catch((err) => {
        setError({ message: err.message, show: true });
        setIsDialogLocked(false);
        setSubmitting(false);
      });
  };

  const initialValues: FormValues = (
    transformInstanceValuesForForm(instanceValues, data)
    || data.fields.reduce((acc, field) => {
      acc[field.name] = getFieldInitialValue(field);
      return acc;
    }, {} as FormValues)
  ) as FormValues;

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
        onSubmit={handleFormSubmit}
        validateOnChange={false}
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
                        {((
                          field.type === "string"
                          || field.type === "text"
                        ) && typeof field.choices === "undefined") && (
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
                            multiline={field.type === "text"}
                            name={field.name}
                            required={field.required}
                            rows={field.type === "text" ? 4 : undefined}
                            value={values[field.name]}
                            variant="outlined"
                          />
                        )}
                        {(field.type === "string" && typeof field.choices !== "undefined") && (
                          <Autocomplete
                            autoFocus={row.row === 1 && !fieldIndex}
                            disablePortal
                            fullWidth
                            isOptionEqualToValue={(opt, val) => {
                              if (!val) {
                                return false;
                              }

                              return (opt as AutocompleteValue).value === (val as AutocompleteValue).value;
                            }}
                            onBlur={handleBlur}
                            onChange={(_, value) => {
                              setFieldValue(field.name, value);
                            }}
                            options={field.choices.map((choice) => ({
                              label: choice[1],
                              value: choice[0],
                            }))}
                            renderInput={(params) => (
                              <TextField
                                // eslint-disable-next-line react/jsx-props-no-spreading
                                {...params}
                                id={field.name}
                                error={!!(touched[field.name] && errors[field.name])}
                                helperText={touched[field.name] && errors[field.name] ? errors[field.name] : null}
                                label={field.verbose_name}
                                margin="normal"
                                name={field.name}
                                required={field.required}
                                variant="outlined"
                              />
                            )}
                            value={values[field.name]}
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
