import { SchoolOutlined as SchoolIcon } from "@mui/icons-material";
import {
  Alert,
  Avatar,
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
import DatePicker from "mibu/components/DatePicker";
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
                helperText={(
                  touched.endDate && errors.endDate
                    ? errors.endDate
                    : "or Expected"
                )}
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
        <Grid container spacing={3}>
          {records.map((record) => (
            <Grid
              item
              md={12}
              key={record.id}
            >
              <Grid container spacing={2}>
                <Grid item md={1}>
                  <Avatar>
                    <SchoolIcon />
                  </Avatar>
                </Grid>
                <Grid item md>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: "bold" }}
                  >
                    {record.school}
                  </Typography>
                  <Typography variant="body2">
                    {record.degree}
                    {record.field_of_study ? (
                      <>
                        {", "}
                        {record.field_of_study}
                      </>
                    ) : null}
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

export default AcademicRecordSection;
