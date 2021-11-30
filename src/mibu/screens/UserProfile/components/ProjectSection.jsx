/* eslint-disable react/jsx-props-no-spreading */

import {
  Alert,
  Box,
  Button,
  Checkbox,
  Collapse,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import DatePicker from "mibu/components/DatePicker";
import APIService from "mibu/services/api";
import isEmpty from "mibu/utils/isEmpty";
import moment from "moment";
import React from "react";
import * as Yup from "yup";

import GenericSection from "./GenericSection";

const Schema = Yup.object({
  description: Yup.string().notRequired(),
  endDate: Yup.date()
    .test(
      "endDateRequiredTest",
      "End date is required as you are not working on this project currently.",
      function endDateRequiredTest(value) {
        const { isOngoing } = this.parent;
        if (!isOngoing && !value) {
          return false;
        }
        return true;
      },
    )
    .test(
      "endDateSanityTest",
      "End date cannot be before start date.",
      function endDateSanityTest(value) {
        const { startDate } = this.parent;
        if (startDate && value) {
          return startDate < value;
        }
        return true;
      },
    )
    .nullable(),
  isOngoing: Yup.boolean(),
  name: Yup.string().required("Project name is required"),
  startDate: Yup.date()
    .required("Start date is required.")
    .typeError("Invalid date."),
  url: Yup.string().notRequired(),
});

const defaultInitialValues = {
  description: "",
  endDate: null,
  isOngoing: false,
  name: "",
  startDate: null,
  url: "",
};

const ProjectSection = ({
  isEditable,
  syncCurrentUserData,
  records,
}) => {
  const nothingToShow = !records.length;

  const transformPayload = (values) => {
    const payload = {
      description: !isEmpty(values.description) ? values.description : null,
      end_date: !isEmpty(values.endDate) ? values.endDate.format("YYYY-MM-DD") : null,
      is_ongoing: values.isOngoing,
      name: values.name,
      start_date: values.startDate.format("YYYY-MM-DD"),
      url: !isEmpty(values.url) ? values.url : null,
    };

    return payload;
  };

  return (
    <GenericSection
      isModifiable={isEditable}
      modifyButtonColor="primary"
      modifyButtonTitle="Add"
      nothingToShow={nothingToShow}
      sectionTitle="Project"
      createSvc={APIService.User.createProject}
      deleteSvc={APIService.User.deleteProject}
      updateSvc={APIService.User.updateProject}
      syncCurrentUserData={syncCurrentUserData}
      formSchema={Schema}
      sectionScope="projects"
      transformPayload={transformPayload}
      getFormInitialValues={(addMode, currentRecord) => (
        addMode ? defaultInitialValues
          : ({
            description: currentRecord.description || "",
            endDate: currentRecord.end_date ? moment(currentRecord.end_date) : null,
            isOngoing: currentRecord.is_ongoing,
            name: currentRecord.name,
            startDate: moment(currentRecord.start_date),
            url: currentRecord.url || "",
          })
      )}
      formContent={({
        alertBoxMargin,
        error,
        errors,
        handleAlertCollapseEnter,
        handleAlertCollapseExit,
        handleErrorAlertClose,
        handleBlur,
        handleChange,
        setFieldTouched,
        setFieldValue,
        touched,
        values,
      }) => (
        <>
          <Grid
            container
            spacing={4}
          >
            <Grid
              item
              md={12}
            >
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

              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="name"
                label="Name"
                name="name"
                autoFocus
                value={values.name}
                error={!!(touched.name && errors.name)}
                InputProps={{
                  onBlur: handleBlur,
                  onChange: handleChange,
                }}
                helperText={touched.name && errors.name ? errors.name : null}
              />
            </Grid>
          </Grid>
          <Grid
            container
            spacing={4}
          >
            <Grid
              item
              md={12}
            >
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="url"
                label="Project URL"
                name="url"
                value={values.url}
                error={!!(touched.url && errors.url)}
                InputProps={{
                  onBlur: handleBlur,
                  onChange: handleChange,
                }}
                helperText={touched.url && errors.url ? errors.url : null}
              />
            </Grid>
          </Grid>
          <Grid
            container
            spacing={4}
          >
            <Grid
              item
              md={6}
            >
              <DatePicker
                error={!!(touched.startDate && errors.startDate)}
                helperText={touched.startDate && errors.startDate ? errors.startDate : null}
                id="start-date-picker"
                label="Start Date"
                onBlur={() => {
                  setFieldTouched("startDate", true);
                }}
                onChange={(date) => {
                  setFieldValue("startDate", date);
                }}
                required
                value={values.startDate}
              />
            </Grid>
            <Grid
              item
              md={6}
            >
              <DatePicker
                error={!!(touched.endDate && errors.endDate)}
                helperText={touched.endDate && errors.endDate ? errors.endDate : null}
                id="end-date-picker"
                label="End Date"
                onBlur={() => {
                  setFieldTouched("endDate", true);
                }}
                onChange={(date) => {
                  setFieldValue("endDate", date);
                  if (date && values.isOngoing) {
                    setFieldValue("isOngoing", false);
                  }
                }}
                value={values.endDate}
              />
            </Grid>
          </Grid>
          <Grid
            container
            spacing={4}
          >
            <Grid
              item
              md={12}
            >
              <FormControl
                error={!!(touched.isOngoing && errors.isOngoing)}
                fullWidth
                margin="normal"
              >
                <FormControlLabel
                  control={(
                    <Checkbox
                      id="isOngoing"
                      color="primary"
                      checked={values.isOngoing}
                      onChange={(event) => {
                        setFieldValue("isOngoing", event.target.checked);
                        if (event.target.checked && values.endDate) {
                          setFieldValue("endDate", null);
                        }
                      }}
                      value="isOngoing"
                    />
                  )}
                  label="I currently work on this project."
                />
                {(touched.isOngoing && errors.isOngoing) && (
                  <FormHelperText>{errors.isOngoing}</FormHelperText>
                )}
              </FormControl>
            </Grid>
          </Grid>
          <Grid
            container
            spacing={4}
          >
            <Grid
              item
              md={12}
            >
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="description"
                label="Description"
                multiline
                name="description"
                value={values.description}
                error={!!(touched.description && errors.description)}
                InputProps={{
                  onBlur: handleBlur,
                  onChange: handleChange,
                }}
                helperText={(
                  touched.description && errors.description
                    ? errors.description
                    : null
                )}
                rows={4}
              />
            </Grid>
          </Grid>
        </>
      )}
    >
      {({
        setCurrentRemoveRecord,
        setCurrentRecord,
      }) => (
        <Grid container spacing={3}>
          {records.map((record) => (
            <Grid
              item
              md={12}
              key={record.id}
            >
              <Grid container spacing={2}>
                <Grid item md>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: "bold" }}
                  >
                    {record.url ? (
                      <Link
                        color="inherit"
                        href={record.url}
                        sx={{ textDecoration: "none" }}
                        target="_blank"
                      >
                        {record.name}
                      </Link>
                    ) : record.name}
                  </Typography>
                  <Typography variant="caption">
                    {moment(record.start_date).format("MMMM YYYY")}
                    {" — "}
                    {record.end_date ? moment(record.end_date).format("MMMM YYYY") : "Present"}
                    {" ("}
                    {(record.end_date
                      ? moment(record.start_date).from(record.end_date, true)
                      : moment(record.start_date).fromNow(true)
                    )}
                    {")"}
                  </Typography>
                  {record.description && (
                    <Typography
                      variant="body1"
                      sx={{ paddingTop: 2, whiteSpace: "pre-line" }}
                    >
                      {record.description}
                    </Typography>
                  )}
                </Grid>
                {isEditable && (
                  <Grid item md="auto">
                    <Grid container spacing={1}>
                      <Grid item md>
                        <Button
                          onClick={() => {
                            setCurrentRecord(record);
                          }}
                          size="small"
                          variant="outlined"
                        >
                          Edit
                        </Button>
                      </Grid>
                      <Grid item md>
                        <Button
                          onClick={() => {
                            setCurrentRemoveRecord(record);
                          }}
                          size="small"
                          variant="outlined"
                          color="error"
                        >
                          Remove
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                )}
              </Grid>
            </Grid>
          ))}
        </Grid>
      )}
    </GenericSection>
  );
};

export default ProjectSection;
