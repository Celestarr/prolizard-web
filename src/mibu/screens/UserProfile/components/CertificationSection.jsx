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
  Collapse,
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
  description: Yup.string().notRequired(),
  issueDate: Yup.date().nullable(),
  issuer: Yup.string().required("Issuer is required"),
  title: Yup.string().required("Title is required"),
});

const defaultInitialValues = {
  description: "",
  issueDate: null,
  issuer: "",
  title: "",
};

const CertificationSection = ({
  isEditable,
  syncCurrentUserData,
  records,
}) => {
  const nothingToShow = !records.length;

  const transformPayload = (values) => {
    const payload = {
      description: !isEmpty(values.description) ? values.description : null,
      issue_date: !isEmpty(values.issueDate) ? values.issueDate.format("YYYY-MM-DD") : null,
      issuer: values.issuer,
      title: values.title,
    };

    return payload;
  };

  return (
    <GenericSection
      isModifiable={isEditable}
      modifyButtonColor="primary"
      modifyButtonTitle="Add"
      nothingToShow={nothingToShow}
      sectionTitle="Certification"
      createSvc={APIService.User.createCertification}
      deleteSvc={APIService.User.deleteCertification}
      updateSvc={APIService.User.updateCertification}
      syncCurrentUserData={syncCurrentUserData}
      formSchema={Schema}
      sectionScope="certifications"
      transformPayload={transformPayload}
      getFormInitialValues={(addMode, currentRecord) => (
        addMode ? defaultInitialValues
          : ({
            description: currentRecord.description || "",
            issueDate: currentRecord.issue_date ? moment(currentRecord.issue_date) : null,
            issuer: currentRecord.issuer,
            title: currentRecord.title,
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
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="title"
                label="Title"
                name="title"
                autoFocus
                value={values.title}
                error={!!(touched.title && errors.title)}
                InputProps={{
                  onBlur: handleBlur,
                  onChange: handleChange,
                }}
                helperText={touched.title && errors.title ? errors.title : null}
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
                id="issuer"
                label="Issuer"
                name="issuer"
                value={values.issuer}
                error={!!(touched.issuer && errors.issuer)}
                InputProps={{
                  onBlur: handleBlur,
                  onChange: handleChange,
                }}
                helperText={touched.issuer && errors.issuer ? errors.issuer : null}
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
              <DatePicker
                // inputFormat=""
                clearable
                label="Issue Date"
                value={values.issueDate}
                onChange={(newValue) => {
                  setFieldValue("issueDate", newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    onBlur={() => {
                      setFieldTouched("issueDate", true);
                    }}
                    fullWidth
                    margin="normal"
                    placeholder="YYYY-MM-DD"
                    error={!!(touched.issueDate && errors.issueDate)}
                    helperText={touched.issueDate && errors.issueDate ? errors.issueDate : null}
                    id="issue-date-picker"
                  />
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
                      {record.title}
                    </Typography>
                    <Typography
                      color="textSecondary"
                      variant="body2"
                    >
                      Offered by
                      {" "}
                      {record.issuer}
                      {record.issue_date && (
                        <>
                          {" ꞏ "}
                          {moment(record.issue_date).format("YYYY")}
                        </>
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

export default CertificationSection;
