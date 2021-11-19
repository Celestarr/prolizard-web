/* eslint-disable react/jsx-props-no-spreading */

import {
  Alert,
  Box,
  Button,
  Collapse,
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
                label="Issue Date"
                value={values.issueDate}
                onBlur={() => {
                  setFieldTouched("issueDate", true);
                }}
                onChange={(newValue) => {
                  setFieldValue("issueDate", newValue);
                }}
                error={!!(touched.issueDate && errors.issueDate)}
                helperText={touched.issueDate && errors.issueDate ? errors.issueDate : null}
                id="issue-date-picker"
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
        <Grid container spacing={3}>
          {records.map((record) => (
            <Grid
              container
              item
              md={12}
              spacing={2}
              key={record.id}
            >
              <Grid item md>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: "bold" }}
                >
                  {record.title}
                </Typography>
                <Typography variant="body2">
                  Offered by
                  {" "}
                  {record.issuer}
                </Typography>
                {record.issue_date && (
                  <Typography variant="caption">
                    {moment(record.issue_date).format("MMMM YYYY")}
                  </Typography>
                )}
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
                <Grid container item md="auto" spacing={1}>
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
              )}
            </Grid>
          ))}
        </Grid>
      )}
    </GenericSection>
  );
};

export default CertificationSection;
