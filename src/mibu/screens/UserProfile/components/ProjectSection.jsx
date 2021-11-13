/* eslint-disable react/jsx-props-no-spreading */
import {
  DatePicker,
  Timeline,
  TimelineContent,
  TimelineItem,
} from "@mui/lab";
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
                clearable
                fullWidth
                error={!!(touched.startDate && errors.startDate)}
                format="YYYY-MM-DD"
                helperText={touched.startDate && errors.startDate ? errors.startDate : null}
                id="start-date-picker"
                inputVariant="outlined"
                KeyboardButtonProps={{
                  "aria-label": "change start date",
                }}
                label="Start Date"
                margin="normal"
                onBlur={() => {
                  setFieldTouched("startDate", true);
                }}
                onChange={(date) => {
                  setFieldValue("startDate", date);
                }}
                placeholder="YYYY-MM-DD"
                required
                value={values.startDate}
              />
            </Grid>
            <Grid
              item
              md={6}
            >
              <DatePicker
                clearable
                fullWidth
                error={!!(touched.endDate && errors.endDate)}
                format="YYYY-MM-DD"
                helperText={touched.endDate && errors.endDate ? errors.endDate : null}
                id="end-date-picker"
                inputVariant="outlined"
                KeyboardButtonProps={{
                  "aria-label": "change end date",
                }}
                label="End Date"
                margin="normal"
                onBlur={() => {
                  setFieldTouched("endDate", true);
                }}
                onChange={(date) => {
                  setFieldValue("endDate", date);
                  if (date && values.isOngoing) {
                    setFieldValue("isOngoing", false);
                  }
                }}
                placeholder="YYYY-MM-DD"
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
        <Timeline>
          {records.map((record) => (
            <TimelineItem
              key={record.id}
            >
              <TimelineContent>
                <Box
                  alignItems="center"
                  display="flex"
                  flexDirection="row"
                >
                  <Box flex="1">
                    <Typography
                      variant="body1"
                    >
                      {record.name}
                    </Typography>
                    <Typography
                      color="textSecondary"
                      variant="body2"
                    >
                      {moment(record.start_date).format("MMMM YYYY")}
                      {" — "}
                      {(record.end_date
                        ? moment(record.end_date).format("MMMM YYYY")
                        : "Present"
                      )}
                    </Typography>
                    {record.url && (
                      <Link
                        color="primary"
                        href={record.url}
                        target="_blank"
                        variant="body2"
                      >
                        View Project
                      </Link>
                    )}
                  </Box>
                  {isEditable && (
                    <Box ml="auto">
                      <Button
                        onClick={() => {
                          setCurrentRemoveRecord(record);
                        }}
                      >
                        Remove
                      </Button>
                      <Button
                        onClick={() => {
                          setCurrentRecord(record);
                        }}
                      >
                        Edit
                      </Button>
                    </Box>
                  )}
                </Box>
                {record.description && (
                  <Box mt={2} whiteSpace="pre-wrap">
                    {record.description}
                  </Box>
                )}
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      )}
    </GenericSection>
  );
};

export default ProjectSection;
