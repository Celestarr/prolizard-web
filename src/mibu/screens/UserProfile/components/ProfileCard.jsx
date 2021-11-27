/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-props-no-spreading */

// import { LocationOn } from "@mui/icons-material";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Alert,
  // AlertTitle,
  Autocomplete,
  Avatar,
  Box,
  Button,
  Collapse,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  // Paper,
  TextField,
  Typography,
  // Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { saveAs } from "file-saver";
import { Formik } from "formik";
import snakeCase from "lodash/snakeCase";
import DatePicker from "mibu/components/DatePicker";
import DummyAvatarImage from "mibu/images/dummy-avatar.png";
import APIService from "mibu/services/api";
import cssImportantSuffixer from "mibu/utils/cssImportantSuffixer";
import isEmpty from "mibu/utils/isEmpty";
import makeChoiceMap from "mibu/utils/makeChoiceMap";
import makeLocationString from "mibu/utils/makeLocationString";
import transformObject from "mibu/utils/transformObject";
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
  countryChoices,
  editOnMount,
  enqueueSnackbar,
  genderChoices,
  isEditable,
  syncCurrentUserData,
  user,
}) => {
  const [initialValues, setInitialValues] = useState(null);
  const [userFullName, setUserFullName] = useState(null);
  const [, setUserLocation] = useState(null);
  const [username, setUserUsername] = useState(null);
  const [, setUserHeadline] = useState(null);
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
    const {
      about,
      address,
      country,
      date_of_birth: dob,
      first_name: firstName,
      gender,
      headline,
      last_name: lastName,
      username: currentUsername,
    } = user;

    setInitialValues({
      about: about || "",
      address: address || "",
      country: country ? country.id : null,
      dob: dob ? moment(dob) : null,
      firstName,
      gender: gender ? gender.id : null,
      headline: headline || "",
      lastName,
    });

    setUserUsername(currentUsername);
    setUserAbout(about);
    setUserFullName(`${firstName} ${lastName}`);
    setUserLocation(makeLocationString(address, country ? country.label : null));
    setUserHeadline(headline);
  }, [user]);

  const countryChoiceValues = countryChoices.map((x) => x.id);
  const countryChoiceValueLabelMap = makeChoiceMap(countryChoices, "id", "name");
  const genderChoiceValues = genderChoices.map((x) => x.id);
  const genderChoiceValueLabelMap = makeChoiceMap(genderChoices, "id", "name");

  const portfolioUrl = "//www.google.com"; // new URL(username, AppConfig.PORTFOLIO_HOST).href;

  // const isAboutEmpty = isEmpty(about);
  // const isAddressEmpty = isEmpty(address);
  // const isCountryEmpty = isEmpty(country);
  // const isDobEmpty = isEmpty(dob);
  // const isGenderEmpty = isEmpty(gender);

  // const nothingToShow = isAboutEmpty
  //   && isAddressEmpty
  //   && isCountryEmpty
  //   && isDobEmpty
  //   && isGenderEmpty;

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
      "headline",
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
  }, [initialValues]);

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
  }, []);

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
            paddingTop: 12,
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
            <Grid item md={4}>
              <Typography variant="h5" component="div">
                {userFullName}
              </Typography>
            </Grid>
            <Grid item md={8}>
              <Grid container>
                <Grid item md={6}>&nbsp;</Grid>
                <Grid item md={6}>&nbsp;</Grid>
              </Grid>
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
      {/* <Paper>
        <Box>
          <Typography
            variant="h5"
          >
            {userFullName}
          </Typography>

          {userHeadline && (
            <Typography variant="body1">
              {userHeadline}
            </Typography>
          )}

          {userLocation && (
            <Box
              alignItems="center"
              display="flex"
              flexDirection="row"
              mt={0.5}
            >
              <LocationOn
                color="disabled"
                fontSize="inherit"
              />
              <Typography
                color="textSecondary"
                component="span"
                variant="body2"
              >
                {userLocation}
              </Typography>
            </Box>
          )}
          {userAbout && (
            <Grid
              container
              spacing={2}
            >
              <Grid item xs={12}>
                <Alert
                  severity="info"
                  variant="outlined"
                >
                  <AlertTitle>Professional Summary</AlertTitle>
                  {userAbout}
                </Alert>
              </Grid>
            </Grid>
          )}
        </Box>
      </Paper> */}

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
                    md={12}
                  >
                    <TextField
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      id="headline"
                      label="Headline"
                      name="headline"
                      autoComplete="off"
                      value={values.headline}
                      error={!!(touched.headline && errors.headline)}
                      InputProps={{
                        onBlur: handleBlur,
                        onChange: handleChange,
                      }}
                      helperText={touched.headline && errors.headline ? errors.headline : null}
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
                      <Autocomplete
                        fullWidth
                        id="gender-combo-box"
                        options={genderChoiceValues}
                        getOptionLabel={(option) => genderChoiceValueLabelMap[option]}
                        // onBlur={(event) => {
                        //   const { value } = event.target;
                        //   if (genderChoiceValues.includes(value)) {
                        //     setFieldValue('gender', value);
                        //   }
                        // }}
                        onChange={(_, value) => {
                          setFieldValue("gender", value);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Gender"
                            variant="outlined"
                          />
                        )}
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
                      <Autocomplete
                        fullWidth
                        id="country-combo-box"
                        options={countryChoiceValues}
                        getOptionLabel={(option) => countryChoiceValueLabelMap[option]}
                        // onBlur={(event) => {
                        //   const { value } = event.target;
                        //   // if (countryChoiceValues.includes(value)) {
                        //   setFieldValue('country', value);
                        //   // }
                        // }}
                        onChange={(_, value) => {
                          setFieldValue("country", value);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            autoComplete="nope"
                            label="Country"
                            variant="outlined"
                          />
                        )}
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
