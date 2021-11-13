/* eslint-disable react/jsx-props-no-spreading */
import {
  Alert,
  DatePicker, Timeline,
  TimelineContent,
  TimelineItem,
} from "@mui/lab";
import {
  Box,
  Button,
  Collapse,
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
                clearable
                fullWidth
                error={!!(touched.publicationDate && errors.publicationDate)}
                format="YYYY-MM-DD"
                helperText={(
                  touched.publicationDate && errors.publicationDate
                    ? errors.publicationDate
                    : null
                  )}
                id="publication-date-picker"
                inputVariant="outlined"
                KeyboardButtonProps={{
                  "aria-label": "change publication date",
                }}
                label="Publication Date"
                margin="normal"
                onBlur={() => {
                  setFieldTouched("publicationDate", true);
                }}
                onChange={(date) => {
                  setFieldValue("publicationDate", date);
                }}
                placeholder="YYYY-MM-DD"
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
                      Published by
                      {" "}
                      {record.publisher}
                      {record.publication_date && (
                        <>
                          {" ꞏ "}
                          {moment(record.publication_date).format("YYYY")}
                        </>
                      )}
                    </Typography>
                    {record.url && (
                      <Link
                        color="primary"
                        href={record.url}
                        target="_blank"
                        variant="body2"
                      >
                        View Publication
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

export default PublicationSection;
