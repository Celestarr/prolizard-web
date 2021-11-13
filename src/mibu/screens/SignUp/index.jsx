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
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { Formik } from "formik";
import routes from "mibu/constants/routes";
import APIService from "mibu/services/api";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link as RouterLink } from "react-router-dom";
import * as Yup from "yup";

const Schema = Yup.object().shape({
  agree: Yup.boolean()
    .oneOf([true], "You must agree to the terms"),
  firstName: Yup.string()
    .required("First name is required"),
  lastName: Yup.string()
    .required("Last name is required"),
  email: Yup.string()
    .email("Invalid email")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Minimum length is 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match")
    .required("Password confirmation is required"),
});

const SignUpScreen = () => {
  const [error, setError] = useState({ message: null, show: false });
  const [success, setSuccess] = useState({ message: null, show: false });
  const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(false);
  const [isPasswordShown, setIsPasswordShown] = useState(false);

  const handleErrorAlertClose = () => {
    setError({ ...error, show: false });
  };

  const handleSuccessAlertClose = () => {
    setSuccess({ ...error, show: false });
  };

  const handleFormSubmit = async (values, { resetForm, setSubmitting }) => {
    handleErrorAlertClose();
    handleSuccessAlertClose();

    try {
      const res = await APIService.Auth.signUp({
        agree: values.agree,
        email: values.email,
        first_name: values.firstName,
        last_name: values.lastName,
        password: values.password,
        confirm_password: values.confirmPassword,
      });

      setSuccess({
        message: res.message,
        show: true,
      });
      setSubmitting(false);
      resetForm();
    } catch (err) {
      setError({ message: err.message, show: true });
      setSubmitting(false);
    }
  };

  const handleConfirmPasswordVisibilityToggle = () => {
    setIsConfirmPasswordShown(!isConfirmPasswordShown);
  };

  const handlePasswordVisibilityToggle = () => {
    setIsPasswordShown(!isPasswordShown);
  };

  const handlePasswordMouseDown = (event) => {
    event.preventDefault();
  };

  return (
    <Box alignItems="center">
      <Helmet title="Sign Up" />

      <Avatar>
        <LockOutlinedIcon />
      </Avatar>

      <Typography
        component="h1"
        gutterBottom={error.show || success.show}
        variant="h5"
      >
        Sign up
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

      <Collapse
        component={Box}
        in={success.show}
        mb={0.5}
        width="100%"
      >
        <Alert
          onClose={handleSuccessAlertClose}
          severity="success"
        >
          {success.message}
        </Alert>
      </Collapse>

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={{
          agree: false,
          confirmPassword: "",
          email: "",
          firstName: "",
          lastName: "",
          password: "",
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
            <Grid container spacing={4}>
              <Grid item md={6}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="firstName"
                  label="First name"
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
              <Grid item md={6}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="lastName"
                  label="Last name"
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
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
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
              autoComplete="new-password"
              value={values.password}
              error={!!(touched.password && errors.password)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handlePasswordVisibilityToggle}
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
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type={isConfirmPasswordShown ? "text" : "password"}
              id="confirmPassword"
              autoComplete="new-password"
              value={values.confirmPassword}
              error={!!(touched.confirmPassword && errors.confirmPassword)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={handleConfirmPasswordVisibilityToggle}
                      onMouseDown={handlePasswordMouseDown}
                      edge="end"
                    >
                      {isConfirmPasswordShown ? <VisibilityIcon /> : <VisibilityOffIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
                onBlur: handleBlur,
                onChange: handleChange,
              }}
              helperText={
                touched.confirmPassword && errors.confirmPassword
                  ? errors.confirmPassword
                  : null
              }
            />
            <FormControl error={!!(touched.agree && errors.agree)}>
              <FormControlLabel
                control={(
                  <Checkbox
                    id="agree"
                    value="agree"
                    color="primary"
                    checked={values.agree}
                    onChange={(event) => {
                      setFieldValue("agree", event.target.checked);
                    }}
                  />
                )}
                label="I agree to the terms."
              />
              {(touched.agree && errors.agree) && (
                <FormHelperText>{errors.agree}</FormHelperText>
              )}
            </FormControl>
            <Box mb={2} mt={1}>
              <LoadingButton
                color="primary"
                fullWidth
                loading={isSubmitting}
                type="submit"
                variant="contained"
              >
                Sign up
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
                  Already have an account?
                </Typography>
                {" "}
                <Link
                  variant="body2"
                  component={RouterLink}
                  to={routes.SIGN_IN}
                >
                  Sign in
                </Link>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default SignUpScreen;
