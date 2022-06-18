/* eslint-disable react/jsx-props-no-spreading */

import {
  Alert,
  Box,
  Button,
  Collapse,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import DatePicker from "busan/components/DatePicker";
import APIService from "busan/services/api";
import isEmpty from "busan/utils/isEmpty";
import moment from "moment";
import React from "react";
import * as Yup from "yup";

import GenericSection from "./GenericSection";

const Schema = Yup.object({
  description: Yup.string().notRequired(),
  publicationDate: Yup.date().nullable(),
  publisher: Yup.string().required("Publisher is required."),
  title: Yup.string().required("Title is required."),
  url: Yup.string().notRequired(),
});

const defaultInitialValues = {
  description: "",
  publicationDate: null,
  publisher: "",
  title: "",
  url: "",
};

const PublicationSection = ({
  isEditable,
  syncCurrentUserData,
  records,
}) => {
  const nothingToShow = !records.length;

  const transformPayload = (values) => {
    const payload = {
      description: !isEmpty(values.description) ? values.description : null,
      publication_date: values.publicationDate ? values.publicationDate.format("YYYY-MM-DD") : null,
      publisher: values.publisher,
      title: values.title,
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
      sectionTitle="Publication"
      createSvc={APIService.User.createPublication}
      deleteSvc={APIService.User.deletePublication}
      updateSvc={APIService.User.updatePublication}
      syncCurrentUserData={syncCurrentUserData}
      formSchema={Schema}
      sectionScope="publications"
      transformPayload={transformPayload}
      getFormInitialValues={(addMode, currentRecord) => (
        addMode ? defaultInitialValues
          : ({
            description: currentRecord.description || "",
            publicationDate: currentRecord.publication_date
              ? moment(currentRecord.publication_date)
              : null,
            publisher: currentRecord.publisher,
            title: currentRecord.title,
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
                fullWidth
                id="url"
                label="Publication URL"
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
              md={12}
            >
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="publisher"
                label="Publisher"
                name="publisher"
                value={values.publisher}
                error={!!(touched.publisher && errors.publisher)}
                InputProps={{
                  onBlur: handleBlur,
                  onChange: handleChange,
                }}
                helperText={touched.publisher && errors.publisher ? errors.publisher : null}
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
                error={!!(touched.publicationDate && errors.publicationDate)}
                helperText={(
                  touched.publicationDate && errors.publicationDate
                    ? errors.publicationDate
                    : null
                  )}
                id="publication-date-picker"
                label="Publication Date"
                onBlur={() => {
                  setFieldTouched("publicationDate", true);
                }}
                onChange={(date) => {
                  setFieldValue("publicationDate", date);
                }}
                value={values.publicationDate}
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
                        {record.title}
                      </Link>
                    ) : record.title}
                  </Typography>
                  <Typography variant="body2">
                    Published by
                    {" "}
                    {record.publisher}
                  </Typography>
                  {record.publication_date && (
                    <Typography variant="caption">
                      {moment(record.publication_date).format("MMMM YYYY")}
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

export default PublicationSection;
