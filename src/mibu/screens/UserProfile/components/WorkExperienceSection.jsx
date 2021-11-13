/* eslint-disable react/jsx-props-no-spreading */
import {
  Autocomplete,
  DatePicker,
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
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
  TextField,
  Typography,
} from "@mui/material";
import APIService from "mibu/services/api";
import isEmpty from "mibu/utils/isEmpty";
import makeChoiceMap from "mibu/utils/makeChoiceMap";
import moment from "moment";
import React from "react";
import * as Yup from "yup";

import GenericSection from "./GenericSection";

const Schema = Yup.object({
  company: Yup.string().required("Company name is required."),
  description: Yup.string().notRequired(),
  endDate: Yup.date()
    .test(
      "endDateRequiredTest",
      "Leaving date is required as you are not working here currently.",
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
      "Leaving date cannot be before joining date.",
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
  jobTitle: Yup.string().required("Job title is required."),
  location: Yup.string().notRequired(),
  startDate: Yup.date()
    .required("Joining date is required.")
    .typeError("Invalid date"),
  toe: Yup.mixed().notOneOf([null], "Employment type is required."),
});

const defaultInitialValues = {
  company: "",
  description: "",
  endDate: null,
  isOngoing: false,
  jobTitle: "",
  location: "",
  startDate: null,
  toe: null,
};

const WorkExperienceSection = ({
  isEditable,
  employmentTypeChoices,
  syncCurrentUserData,
  records,
}) => {
  const nothingToShow = !records.length;
  const employmentTypeChoiceValues = employmentTypeChoices.map((x) => x.id);
  const employmentTypeChoiceValueLabelMap = makeChoiceMap(employmentTypeChoices, "id", "name");

  const transformPayload = (values) => {
    const payload = {
      company: values.company,
      description: !isEmpty(values.description) ? values.description : null,
      end_date: !isEmpty(values.endDate) ? values.endDate.format("YYYY-MM-DD") : null,
      is_ongoing: values.isOngoing,
      job_title: values.jobTitle,
      location: !isEmpty(values.location) ? values.location : null,
      start_date: values.startDate.format("YYYY-MM-DD"),
      employment_type: values.toe,
    };

    return payload;
  };

  return (
    <GenericSection
      isModifiable={isEditable}
      modifyButtonColor="primary"
      modifyButtonTitle="Add"
      nothingToShow={nothingToShow}
      sectionTitle="Work Experience"
      createSvc={APIService.User.createWorkExperience}
      deleteSvc={APIService.User.deleteWorkExperience}
      updateSvc={APIService.User.updateWorkExperience}
      syncCurrentUserData={syncCurrentUserData}
      formSchema={Schema}
      sectionScope="workExperiences"
      transformPayload={transformPayload}
      getFormInitialValues={(addMode, currentRecord) => (
        addMode ? defaultInitialValues
          : ({
            company: currentRecord.company,
            description: currentRecord.description || "",
            endDate: currentRecord.end_date ? moment(currentRecord.end_date) : null,
            isOngoing: currentRecord.is_ongoing,
            jobTitle: currentRecord.job_title,
            location: currentRecord.location || "",
            startDate: moment(currentRecord.start_date),
            toe: currentRecord.employment_type.id,
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
                id="jobTitle"
                label="Job Title"
                name="jobTitle"
                autoFocus
                value={values.jobTitle}
                error={!!(touched.jobTitle && errors.jobTitle)}
                InputProps={{
                  onBlur: handleBlur,
                  onChange: handleChange,
                }}
                helperText={touched.jobTitle && errors.jobTitle ? errors.jobTitle : null}
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
                required
                fullWidth
                id="company"
                label="Company"
                name="company"
                value={values.company}
                error={!!(touched.company && errors.company)}
                InputProps={{
                  onBlur: handleBlur,
                  onChange: handleChange,
                }}
                helperText={touched.company && errors.company ? errors.company : null}
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
                id="location"
                label="Location"
                name="location"
                value={values.location}
                error={!!(touched.location && errors.location)}
                InputProps={{
                  onBlur: handleBlur,
                  onChange: handleChange,
                }}
                helperText={touched.location && errors.location ? errors.location : null}
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
                fullWidth
                margin="normal"
              >
                <Autocomplete
                  fullWidth
                  id="employment-type-combo-box"
                  options={employmentTypeChoiceValues}
                  getOptionLabel={(option) => employmentTypeChoiceValueLabelMap[option]}
                  // onBlur={(event) => {
                  //   const { value } = event.target;
                  //   if (employmentTypeChoiceValues.includes(value)) {
                  //     setFieldValue('toe', value);
                  //   }
                  // }}
                  onChange={(_, value) => {
                    setFieldValue("toe", value);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      error={!!(touched.toe && errors.toe)}
                      helperText={touched.toe && errors.toe ? errors.toe : null}
                      label="Type of Employment"
                      required
                      variant="outlined"
                    />
                  )}
                  value={values.toe}
                />
              </FormControl>
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
                  "aria-label": "change joining date",
                }}
                label="Joining Date"
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
                  "aria-label": "change leaving date",
                }}
                label="Leaving Date"
                margin="normal"
                onBlur={() => {
                  setFieldTouched("startDate", true);
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
                  label="I currently work here."
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
              <TimelineSeparator>
                <TimelineDot
                  color={record.is_ongoing ? "primary" : "grey"}
                />
                <TimelineConnector />
              </TimelineSeparator>
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
                      {record.job_title}
                    </Typography>
                    <Typography
                      variant="body2"
                    >
                      {record.company}
                    </Typography>
                    <Typography
                      color="textSecondary"
                      variant="body2"
                    >
                      {record.employment_type.label}
                      {" ꞏ "}
                      {record.location && (
                        <>
                          {record.location}
                          {" ꞏ "}
                        </>
                      )}
                      {moment(record.start_date).format("MMMM YYYY")}
                      {" — "}
                      {(record.end_date
                        ? moment(record.end_date).format("MMMM YYYY")
                        : "Present"
                      )}
                    </Typography>
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

export default WorkExperienceSection;
