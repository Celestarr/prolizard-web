import {
  LockOutlined as LockOutlinedIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from "@mui/icons-material";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Alert,
  Avatar,
  Box,
  Checkbox,
  Collapse,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { Formik } from "formik";
import { onRetrieveMetadataSuccess } from "mibu/actions/meta";
import { onRetrieveUserDataSuccess } from "mibu/actions/user";
import routes from "mibu/constants/routes";
import APIService from "mibu/services/api";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useDispatch } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
import * as Yup from "yup";

const Schema = Yup.object({
  email: Yup.string().email().required("Email address is required"),
  password: Yup.string().required("Password is required"),
});

const SignInScreen = () => {
  const dispatch = useDispatch();
  const [error, setError] = useState({ message: null, show: false });
  const [isPasswordShown, setIsPasswordShown] = useState(false);

  const handleErrorAlertClose = () => {
    setError({ ...error, show: false });
  };

  const handleFormSubmit = async (values, { setSubmitting }) => {
    handleErrorAlertClose();

    try {
      await APIService.Auth.signIn(values);

      const data = await Promise.all([
        APIService.User.retrieveUserProfile("me"),
        APIService.Common.retrieveMetadata(),
      ]);

      dispatch(onRetrieveUserDataSuccess("me", data[0]));
      dispatch(onRetrieveMetadataSuccess(data[1]));
      // setSubmitting(false);
    } catch (err) {
      setError({ message: err.message, show: true });
      setSubmitting(false);
    }
  };

  const handleShowPasswordClick = () => {
    setIsPasswordShown(!isPasswordShown);
  };

  const handlePasswordMouseDown = (event) => {
    event.preventDefault();
  };

  return (
    <Box sx={{ alignItems: "center" }}>
      <Helmet title="Sign In" />
      <Avatar>
        <LockOutlinedIcon />
      </Avatar>

      <Typography
        component="h1"
        gutterBottom={error.show}
        variant="h5"
      >
        Sign in
      </Typography>

      <Collapse
        component={Box}
        in={error.show}
        mb={0.5}
        width="100%"
      >
        <Alert
          onClose={handleErrorAlertClose}
          severity="error"
        >
          {error.message}
        </Alert>
      </Collapse>

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={{
          email: "",
          password: "",
          remember: false,
        }}
        validationSchema={Schema}
      >
        {({
          handleBlur,
          handleChange,
          handleSubmit,
          values,
          touched,
          errors,
          isSubmitting,
          setFieldValue,
        }) => (
          <form onSubmit={handleSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={values.email}
              error={!!(touched.email && errors.email)}
              InputProps={{
                onBlur: handleBlur,
                onChange: handleChange,
              }}
              helperText={touched.email && errors.email ? errors.email : null}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={isPasswordShown ? "text" : "password"}
              id="password"
              autoComplete="current-password"
              value={values.password}
              error={!!(touched.password && errors.password)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleShowPasswordClick}
                      onMouseDown={handlePasswordMouseDown}
                      edge="end"
                    >
                      {isPasswordShown ? <VisibilityIcon /> : <VisibilityOffIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
                onBlur: handleBlur,
                onChange: handleChange,
              }}
              helperText={touched.password && errors.password ? errors.password : null}
            />
            <FormControlLabel
              control={(
                <Checkbox
                  id="remember"
                  value="remember"
                  color="primary"
                  checked={values.remember}
                  onChange={(event) => {
                    setFieldValue("remember", event.target.checked);
                  }}
                />
              )}
              label="Remember me"
            />
            <Box mb={2} mt={1}>
              <LoadingButton
                color="primary"
                fullWidth
                loading={isSubmitting}
                type="submit"
                variant="contained"
              >
                Sign in
              </LoadingButton>
            </Box>
            <Grid container>
              <Grid item xs>
                <Link
                  variant="body2"
                  component={RouterLink}
                  to={routes.FORGOT_PASSWORD}
                >
                  Forgot password
                </Link>
              </Grid>
              <Grid item>
                <Typography
                  component="span"
                  variant="body2"
                >
                  Don&apos;t have an account?
                </Typography>
                {" "}
                <Link
                  variant="body2"
                  component={RouterLink}
                  to={routes.SIGN_UP}
                >
                  Sign up
                </Link>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default SignInScreen;
