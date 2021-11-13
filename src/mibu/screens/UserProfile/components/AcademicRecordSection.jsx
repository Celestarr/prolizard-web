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
  degree: Yup.string().required("Degree is required"),
  description: Yup.string().notRequired(),
  endDate: Yup.date()
    .test(
      "endDateRequiredTest",
      "Leaving date is required as you are not studying here currently.",
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
  fieldOfStudy: Yup.string().notRequired(),
  grade: Yup.string().notRequired(),
  isOngoing: Yup.boolean(),
  location: Yup.string().notRequired(),
  school: Yup.string().required("School is required."),
  startDate: Yup.date()
    .required("Joining date is required.")
    .typeError("Invalid date."),
});

const defaultInitialValues = {
  degree: "",
  description: "",
  endDate: null,
  fieldOfStudy: "",
  grade: "",
  isOngoing: false,
  location: "",
  school: "",
  startDate: null,
};

const AcademicRecordSection = ({
  isEditable,
  syncCurrentUserData,
  records,
}) => {
  const nothingToShow = !records.length;

  const transformPayload = (values) => {
    const payload = {
      degree: values.degree,
      description: !isEmpty(values.description) ? values.description : null,
      end_date: !isEmpty(values.endDate) ? values.endDate.format("YYYY-MM-DD") : null,
      field_of_study: !isEmpty(values.fieldOfStudy) ? values.fieldOfStudy : null,
      grade: !isEmpty(values.grade) ? values.grade : null,
      is_ongoing: values.isOngoing,
      location: !isEmpty(values.location) ? values.location : null,
      school: values.school,
      start_date: values.startDate.format("YYYY-MM-DD"),
    };

    return payload;
  };

  return (
    <GenericSection
      isModifiable={isEditable}
      modifyButtonColor="primary"
      modifyButtonTitle="Add"
      nothingToShow={nothingToShow}
      sectionTitle="Education"
      createSvc={APIService.User.createAcademicRecord}
      deleteSvc={APIService.User.deleteAcademicRecord}
      updateSvc={APIService.User.updateAcademicRecord}
      syncCurrentUserData={syncCurrentUserData}
      formSchema={Schema}
      sectionScope="academicRecords"
      transformPayload={transformPayload}
      getFormInitialValues={(addMode, currentRecord) => (
        addMode ? defaultInitialValues
          : ({
            degree: currentRecord.degree,
            description: currentRecord.description || "",
            endDate: currentRecord.end_date ? moment(currentRecord.end_date) : null,
            fieldOfStudy: currentRecord.field_of_study || "",
            grade: currentRecord.grade || "",
            isOngoing: currentRecord.is_ongoing,
            location: currentRecord.location || "",
            school: currentRecord.school,
            startDate: moment(currentRecord.start_date),
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
        setFieldValue,
        setFieldTouched,
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
                autoFocus
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="degree"
                label="Degree"
                name="degree"
                value={values.degree}
                error={!!(touched.degree && errors.degree)}
                InputProps={{
                  onBlur: handleBlur,
                  onChange: handleChange,
                }}
                helperText={touched.degree && errors.degree ? errors.degree : null}
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
                id="fieldOfStudy"
                label="Field of Study"
                name="fieldOfStudy"
                value={values.fieldOfStudy}
                error={!!(touched.fieldOfStudy && errors.fieldOfStudy)}
                InputProps={{
                  onBlur: handleBlur,
                  onChange: handleChange,
                }}
                helperText={(
                  touched.fieldOfStudy && errors.fieldOfStudy
                    ? errors.fieldOfStudy
                    : null
                )}
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
                id="school"
                label="School"
                name="school"
                value={values.school}
                error={!!(touched.school && errors.school)}
                InputProps={{
                  onBlur: handleBlur,
                  onChange: handleChange,
                }}
                helperText={touched.school && errors.school ? errors.school : null}
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
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="grade"
                label="Grade"
                name="grade"
                value={values.grade}
                error={!!(touched.grade && errors.grade)}
                InputProps={{
                  onBlur: handleBlur,
                  onChange: handleChange,
                }}
                helperText={touched.grade && errors.grade ? errors.grade : null}
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
                helperText={(
                  touched.endDate && errors.endDate
                    ? errors.endDate
                    : "or Expected"
                )}
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
                  label="I currently study here."
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
        setCurrentRecord,
        setCurrentRemoveRecord,
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
                      {record.degree}
                      {record.field_of_study && (
                        <>
                          {`, ${record.field_of_study}`}
                        </>
                      )}
                    </Typography>
                    <Typography
                      variant="body2"
                    >
                      {record.school}
                    </Typography>
                    <Typography
                      color="textSecondary"
                      variant="body2"
                    >
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

export default AcademicRecordSection;
