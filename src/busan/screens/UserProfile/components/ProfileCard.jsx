/* eslint-disable react/jsx-props-no-spreading */

import LoadingButton from "@mui/lab/LoadingButton";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Collapse,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  Paper,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import AsyncAutocomplete from "busan/components/AsyncAutocomplete";
import DatePicker from "busan/components/DatePicker";
import DummyAvatarImage from "busan/images/dummy-avatar.png";
import APIService from "busan/services/api";
import cssImportantSuffixer from "busan/utils/cssImportantSuffixer";
import getHighestEducationObject from "busan/utils/getHighestEducationObject";
import getPreviousExperienceObject from "busan/utils/getPreviousExperienceObject";
import isEmpty from "busan/utils/isEmpty";
import makeLocationString from "busan/utils/makeLocationString";
import makeUserHeadline from "busan/utils/makeUserHeadline";
import transformObject from "busan/utils/transformObject";
import { saveAs } from "file-saver";
import { Formik } from "formik";
import snakeCase from "lodash/snakeCase";
import moment from "moment";
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import * as Yup from "yup";

const Schema = Yup.object({
  dob: Yup.date().nullable(),
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
});

const ProfileCard = ({
  editOnMount,
  enqueueSnackbar,
  isEditable,
  syncCurrentUserData,
  user,
}) => {
  const [initialValues, setInitialValues] = useState(null);
  const [userFullName, setUserFullName] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [username, setUserUsername] = useState(null);
  const [userHeadline, setUserHeadline] = useState(null);
  const [userPreviousExperience, setUserPreviousExperience] = useState(null);
  const [userEducationHighlight, setUserEducationHighlight] = useState(null);
  const [, setUserAbout] = useState(null);
  const [isDialogLocked, setIsDialogLocked] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [resumeDownloadProgress, setResumeDownloadProgress] = useState(null);
  const [error, setError] = useState({ message: null, show: false });
  const [alertBoxMargin, setAlertBoxMargin] = useState(0);
  const dialogContentRef = useRef(null);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    setInitialValues({
      about: user.about || "",
      address: user.address || "",
      country: user.country ? user.country.id : null,
      dob: user.dob ? moment(user.dob) : null,
      firstName: user.first_name,
      gender: user.gender ? user.gender.id : null,
      lastName: user.last_name,
    });

    setUserUsername(user.username);
    setUserAbout(user.about);
    setUserFullName(`${user.first_name} ${user.last_name}`);
    setUserLocation(makeLocationString(user.address, user.country ? user.country.name : null));
    setUserHeadline(makeUserHeadline(user));
    setUserPreviousExperience(getPreviousExperienceObject(user.work_experiences));
    setUserEducationHighlight(getHighestEducationObject(user.academic_records));
  }, [user]);

  const portfolioUrl = "//www.google.com"; // new URL(username, AppConfig.PORTFOLIO_HOST).href;

  const isResumeDownloading = resumeDownloadProgress !== null;

  const handleAlertCollapseEnter = () => {
    setAlertBoxMargin(2);
  };

  const handleAlertCollapseExit = () => {
    setAlertBoxMargin(0);
  };

  const handleErrorAlertClose = () => {
    setError({ ...error, show: false });
    setAlertBoxMargin(0);
  };

  const handleEditDialogClose = () => {
    if (!isDialogLocked) {
      handleErrorAlertClose();
      setIsEditDialogOpen(false);
    }
  };

  const handleEditDialogOpen = () => {
    setIsEditDialogOpen(true);
  };

  const handleEditDialogSubmit = useCallback((values, { setSubmitting }) => {
    setIsDialogLocked(true);
    handleErrorAlertClose();

    const payload = {};

    [
      "about",
      "address",
      "country",
      "firstName",
      "gender",
      "lastName",
    ].forEach((fieldName) => {
      const snaked = snakeCase(fieldName);
      if (initialValues[fieldName] !== values[fieldName]) {
        payload[snaked] = !isEmpty(values[fieldName]) ? values[fieldName] : null;
      }
    });

    if (initialValues.dob !== values.dob) {
      payload.date_of_birth = !isEmpty(values.dob) ? values.dob.format("YYYY-MM-DD") : null;
    }

    APIService.User.updateCurrentUserProfile(payload)
      .then((res) => {
        syncCurrentUserData("profile", transformObject(res, {
          includeKeys: Object.keys(payload),
        }));
        setSubmitting(false);
        setIsDialogLocked(false);
        setIsEditDialogOpen(false);
      })
      .catch((err) => {
        setError({ message: err.message, show: true });
        if (dialogContentRef.current) {
          dialogContentRef.current.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }
        setSubmitting(false);
        setIsDialogLocked(false);
      });
  }, [initialValues]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleResumeDownloadClick = () => {
    setResumeDownloadProgress(0);

    APIService.User.retrieveUserResume(username, setResumeDownloadProgress)
      .then((res) => {
        const filename = `${userFullName}_resume`
          .replace(/([^a-zA-Z0-9-_]+)/gi, "_");
        saveAs(res, `${filename}.pdf`);
        setResumeDownloadProgress(null);
      })
      .catch(() => {
        enqueueSnackbar("Could not download résumé. Try again.", {
          variant: "error",
        });
        setResumeDownloadProgress(null);
      });
  };

  useEffect(() => {
    if (editOnMount) {
      handleEditDialogOpen();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) {
    return null;
  }

  return (
    <>
      <Grid
        item
        md={12}
        sx={{
          backgroundColor: theme.palette.primary[theme.palette.mode],
          paddingTop: cssImportantSuffixer(theme.spacing(12)),
        }}
      >
        <Container
          sx={{
            paddingBottom: 4,
            paddingTop: 6,
            position: "relative",
          }}
        >
          <Avatar
            src={DummyAvatarImage}
            sx={{
              border: 4,
              borderColor: theme.palette.background.default,
              bottom: theme.spacing(-6.25),
              width: theme.spacing(22),
              height: theme.spacing(22),
              position: "absolute",
              zIndex: 1,
            }}
            variant="rounded"
          />
          <Grid container sx={{ paddingLeft: 25 }}>
            <Grid
              item
              md={4}
              sx={{
                color: theme.palette.primary.contrastText,
              }}
            >
              <Typography variant="h6" component="div">
                {userFullName}
              </Typography>

              {userHeadline && (
                <Typography variant="body1" component="div">
                  {userHeadline}
                </Typography>
              )}

              {userLocation && (
                <Typography variant="subtitle2" component="div">
                  {userLocation}
                </Typography>
              )}
            </Grid>
            <Grid item md={8}>
              <Paper sx={{ paddingX: 2, paddingY: 1 }}>
                <Grid container>
                  <Grid item md={5}>
                    <Typography variant="subtitle2" component="div" color="primary">
                      Previous
                    </Typography>
                    <Typography variant="body1" component="div">
                      {userPreviousExperience && (
                        `${userPreviousExperience.job_title} at ${userPreviousExperience.company}`
                      )}
                      {!userPreviousExperience && "-"}
                    </Typography>
                  </Grid>
                  <Grid
                    alignItems="center"
                    container
                    item
                    justifyContent="center"
                    md={2}
                    spacing={0}
                  >
                    <Divider
                      orientation="vertical"
                      sx={{
                        borderColor: theme.palette.primary[theme.palette.mode],
                        borderWidth: 1,
                        height: "60%",
                      }}
                    />
                  </Grid>
                  <Grid item md={5}>
                    <Typography variant="subtitle2" component="div" color="primary">
                      Education
                    </Typography>
                    <Typography variant="body1" component="div">
                      {userEducationHighlight && (
                        `${userEducationHighlight.degree} from ${userEducationHighlight.school}`
                      )}
                      {!userEducationHighlight && "-"}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Grid>
      <Grid
        item
        md={12}
        sx={{
          backgroundColor: theme.palette.background.paper,
          boxShadow: theme.shadows[1],
          paddingTop: cssImportantSuffixer("0px"),
        }}
      >
        <Container
          sx={{
            paddingBottom: 2,
            paddingTop: 2,
          }}
        >
          <Grid
            container
            spacing={2}
            sx={{ paddingLeft: 25 }}
          >
            {isEditable && (
              <Grid item>
                <Button
                  color="primary"
                  onClick={handleEditDialogOpen}
                  variant="contained"
                  size="small"
                >
                  Edit Profile
                </Button>
              </Grid>
            )}
            <Grid item>
              <Button
                color="primary"
                href={portfolioUrl}
                target="_blank"
                variant={isEditable ? "outlined" : "contained"}
                size="small"
              >
                View portfolio
              </Button>
            </Grid>
            <Grid item>
              <LoadingButton
                color="primary"
                loading={isResumeDownloading}
                onClick={handleResumeDownloadClick}
                variant="outlined"
                size="small"
              >
                Download résumé
              </LoadingButton>
            </Grid>
          </Grid>
        </Container>
      </Grid>

      <Dialog
        aria-labelledby="edit-profile-dialog"
        fullScreen={fullScreen}
        fullWidth
        maxWidth="sm"
        onClose={handleEditDialogClose}
        open={isEditDialogOpen}
      >
        <Formik
          enableReinitialize
          initialValues={initialValues}
          onSubmit={handleEditDialogSubmit}
          validationSchema={Schema}
        >
          {({
            errors,
            handleBlur,
            handleChange,
            handleSubmit,
            isSubmitting,
            setFieldTouched,
            setFieldValue,
            touched,
            values,
          }) => (
            <form className="mui-dialog-form" onSubmit={handleSubmit}>
              <DialogTitle id="edit-profile-dialog">Edit Profile</DialogTitle>
              <DialogContent ref={dialogContentRef}>
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
                <Grid
                  container
                  spacing={4}
                >
                  <Grid
                    item
                    md={6}
                  >
                    <TextField
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      id="firstName"
                      label="First Name"
                      name="firstName"
                      autoComplete="given-name"
                      autoFocus
                      value={values.firstName}
                      error={!!(touched.firstName && errors.firstName)}
                      InputProps={{
                        onBlur: handleBlur,
                        onChange: handleChange,
                      }}
                      helperText={touched.firstName && errors.firstName ? errors.firstName : null}
                    />
                  </Grid>
                  <Grid
                    item
                    md={6}
                  >
                    <TextField
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      id="lastName"
                      label="Last Name"
                      name="lastName"
                      autoComplete="family-name"
                      value={values.lastName}
                      error={!!(touched.lastName && errors.lastName)}
                      InputProps={{
                        onBlur: handleBlur,
                        onChange: handleChange,
                      }}
                      helperText={touched.lastName && errors.lastName ? errors.lastName : null}
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
                    <FormControl fullWidth margin="normal">
                      <AsyncAutocomplete
                        fullWidth
                        id="gender-combo-box"
                        fetchOptions={APIService.Common.retrieveGenders}
                        // onBlur={(event) => {
                        //   const { value } = event.target;
                        //   if (genderChoiceValues.includes(value)) {
                        //     setFieldValue('gender', value);
                        //   }
                        // }}
                        onChange={(_, value) => {
                          setFieldValue("gender", value);
                        }}
                        label="Gender"
                        value={values.gender}
                      />
                    </FormControl>
                  </Grid>
                  <Grid
                    item
                    md={6}
                  >
                    <DatePicker
                      id="dob-picker"
                      label="Date of Birth"
                      error={!!(touched.dob && errors.dob)}
                      helperText={touched.dob && errors.dob ? errors.dob : null}
                      onBlur={() => {
                        setFieldTouched("dob", true);
                      }}
                      onChange={(date) => {
                        setFieldValue("dob", date);
                      }}
                      value={values.dob}
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
                    <TextField
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      id="address"
                      label="Address"
                      name="address"
                      autoComplete="street-address"
                      value={values.address}
                      error={!!(touched.address && errors.address)}
                      InputProps={{
                        onBlur: handleBlur,
                        onChange: handleChange,
                      }}
                      helperText={touched.address && errors.address ? errors.address : null}
                    />
                  </Grid>
                  <Grid
                    item
                    md={6}
                  >
                    <FormControl fullWidth margin="normal">
                      <AsyncAutocomplete
                        fullWidth
                        inputId="country-combo-box"
                        fetchOptions={APIService.Common.retrieveCountries}
                        // onBlur={(event) => {
                        //   const { value } = event.target;
                        //   // if (countryChoiceValues.includes(value)) {
                        //   setFieldValue('country', value);
                        //   // }
                        // }}
                        onChange={(_, value) => {
                          setFieldValue("country", value);
                        }}
                        label="Country"
                        value={values.country}
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
                    md={12}
                  >
                    <TextField
                      autoComplete="off"
                      error={!!(touched.about && errors.about)}
                      fullWidth
                      helperText={touched.about && errors.about ? errors.about : null}
                      id="about"
                      InputProps={{
                        onBlur: handleBlur,
                        onChange: handleChange,
                      }}
                      label="Professional Summary"
                      margin="normal"
                      multiline
                      name="about"
                      rows={4}
                      value={values.about}
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleEditDialogClose}>
                  Cancel
                </Button>
                <Button color="primary" disabled={isSubmitting} type="submit">
                  Submit
                </Button>
              </DialogActions>
            </form>
          )}
        </Formik>
      </Dialog>
    </>
  );
};

export default ProfileCard;
