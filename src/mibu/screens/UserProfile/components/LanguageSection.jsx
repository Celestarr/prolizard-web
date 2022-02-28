/* eslint-disable react/jsx-props-no-spreading */

import {
  Alert,
  Box,
  Chip,
  Collapse,
  FormControl,
  Grid,
  TextField,
  useTheme,
} from "@mui/material";
import AsyncAutocomplete from "mibu/components/AsyncAutocomplete";
import APIService from "mibu/services/api";
import React from "react";
import * as Yup from "yup";

import GenericSection from "./GenericSection";

const Schema = Yup.object({
  name: Yup.string().required("Language name is required"),
  proficiency: Yup.number().required("Proficiency level is required"),
});

const defaultInitialValues = {
  name: "",
  proficiency: null,
};

const LanguageSection = ({
  isEditable,
  syncCurrentUserData,
  records,
}) => {
  const nothingToShow = !records.length;
  const theme = useTheme();

  const transformPayload = (values) => {
    const payload = {
      name: values.name,
      proficiency: values.proficiency,
    };

    return payload;
  };

  return (
    <GenericSection
      isModifiable={isEditable}
      modifyButtonColor="primary"
      modifyButtonTitle="Add"
      nothingToShow={nothingToShow}
      sectionTitle="Language"
      createSvc={APIService.User.createLanguage}
      deleteSvc={APIService.User.deleteLanguage}
      updateSvc={APIService.User.updateLanguage}
      syncCurrentUserData={syncCurrentUserData}
      formSchema={Schema}
      sectionScope="languages"
      transformPayload={transformPayload}
      getFormInitialValues={(addMode, currentRecord) => (
        addMode ? defaultInitialValues
          : ({
            name: currentRecord.name,
            proficiency: currentRecord.proficiency.id,
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
              xs={12}
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
                label="Name of Language"
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
              <FormControl
                fullWidth
                margin="normal"
              >
                <AsyncAutocomplete
                  fetchOptions={APIService.Common.retrieveLanguageProficiencyLevels}
                  error={!!(touched.proficiency && errors.proficiency)}
                  fullWidth
                  helperText={(
                    touched.proficiency && errors.proficiency
                      ? errors.proficiency
                      : null
                  )}
                  inputId="proficiency-combo-box"
                  label="Proficiency"
                  // onBlur={(event) => {
                  //   const { value } = event.target;
                  //   if (languageProficiencyLevelChoiceLabels.includes(value)) {
                  //     setFieldValue('proficiency', value);
                  //   }
                  // }}
                  onChange={(_, value) => {
                    setFieldValue("proficiency", value);
                  }}
                  required
                  value={values.proficiency}
                />
              </FormControl>
            </Grid>
          </Grid>
        </>
      )}
    >
      {({
        setCurrentRemoveRecord,
        setCurrentRecord,
      }) => (
        <Box
          display="flex"
          flexWrap="wrap"
          ml={-1}
          mr={-1}
          mt={2}
        >
          {records.map((record) => (
            <Chip
              key={record.id}
              label={record.name}
              onClick={() => {
                setCurrentRecord(record);
              }}
              sx={{
                marginLeft: theme.spacing(1),
                marginRight: theme.spacing(1),
              }}
              onDelete={() => {
                setCurrentRemoveRecord(record);
              }}
            />
          ))}
        </Box>
      )}
    </GenericSection>
  );
};

export default LanguageSection;
