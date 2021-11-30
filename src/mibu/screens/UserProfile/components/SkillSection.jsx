/* eslint-disable react/jsx-props-no-spreading */

import {
  Alert,
  Autocomplete,
  Box,
  Chip,
  Collapse,
  FormControl,
  Grid,
  TextField,
} from "@mui/material";
import APIService from "mibu/services/api";
import makeChoiceMap from "mibu/utils/makeChoiceMap";
import React from "react";
import * as Yup from "yup";

import GenericSection from "./GenericSection";

const Schema = Yup.object({
  name: Yup.string().required("Skill name is required"),
  proficiency: Yup.string().required("Proficiency level is required"),
});

const defaultInitialValues = {
  name: "",
  proficiency: null,
};

const SkillSection = ({
  isEditable,
  skillProficiencyLevelChoices,
  syncCurrentUserData,
  records,
}) => {
  const nothingToShow = !records.length;
  const skillProficiencyLevelChoiceValues = skillProficiencyLevelChoices.map((x) => x.id);
  const skillProficiencyLevelChoiceValueLabelMap = makeChoiceMap(
    skillProficiencyLevelChoices,
    "id",
    "name",
  );

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
      sectionTitle="Skill"
      createSvc={APIService.User.createSkill}
      deleteSvc={APIService.User.deleteSkill}
      updateSvc={APIService.User.updateSkill}
      syncCurrentUserData={syncCurrentUserData}
      formSchema={Schema}
      sectionScope="skills"
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
                label="Name of Skill"
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
                <Autocomplete
                  fullWidth
                  id="employment-type-combo-box"
                  options={skillProficiencyLevelChoiceValues}
                  getOptionLabel={(option) => (
                    skillProficiencyLevelChoiceValueLabelMap[option]
                  )}
                  // onBlur={(event) => {
                  //   const { value } = event.target;
                  //   if (skillProficiencyLevelChoiceLabels.includes(value)) {
                  //     setFieldValue('proficiency', value);
                  //   }
                  // }}
                  onChange={(_, value) => {
                    setFieldValue("proficiency", value);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      error={!!(touched.proficiency && errors.proficiency)}
                      helperText={(
                        touched.proficiency && errors.proficiency
                          ? errors.proficiency
                          : null
                      )}
                      label="Proficiency"
                      required
                      variant="outlined"
                    />
                  )}
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
        <Grid
          container
          spacing={1}
        >
          {records.map((record) => (
            <Grid key={record.id} item>
              <Chip
                label={record.name}
                onClick={() => {
                  setCurrentRecord(record);
                }}
                onDelete={() => {
                  setCurrentRemoveRecord(record);
                }}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </GenericSection>
  );
};

export default SkillSection;
