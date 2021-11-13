import {
  Button,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
} from "@mui/material";
import APIService from "mibu/services/api";
import makeProfileRoute from "mibu/utils/makeProfileRoute";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link as RouterLink } from "react-router-dom";

// import isEmpty from "mibu/utils/isEmpty";
import EmailChangeDialog from "./components/EmailChangeDialog";
import PhoneChangeDialog from "./components/PhoneChangeDialog";
import UsernameChangeDialog from "./components/UsernameChangeDialog";

const View = ({
  syncCurrentUserData,
  user,
}) => {
  const [alertBoxMargin, setAlertBoxMargin] = useState(0);
  const [error, setError] = useState({ message: null, show: false });

  const [isEmailDialogLocked, setIsEmailDialogLocked] = useState(false);
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);

  const [isPhoneDialogLocked, setIsPhoneDialogLocked] = useState(false);
  const [isPhoneDialogOpen, setIsPhoneDialogOpen] = useState(false);

  const [isUsernameDialogLocked, setIsUsernameDialogLocked] = useState(false);
  const [isUsernameDialogOpen, setIsUsernameDialogOpen] = useState(false);

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

  const handleEmailDialogClose = () => {
    if (!isEmailDialogLocked) {
      handleErrorAlertClose();
      setIsEmailDialogOpen(false);
    }
  };
  const handleEmailDialogOpen = () => {
    setIsEmailDialogOpen(true);
  };
  const handleEmailSubmit = (values, { setSubmitting }) => {
    setIsEmailDialogLocked(true);
    handleErrorAlertClose();

    APIService.User.updateCurrentUserProfile(values)
      .then((res) => {
        syncCurrentUserData("profile", res);
        setSubmitting(false);
        setIsEmailDialogLocked(false);
        setIsEmailDialogOpen(false);
      })
      .catch((err) => {
        setError({ message: err.message, show: true });
        setSubmitting(false);
        setIsEmailDialogLocked(false);
      });
  };

  const handlePhoneDialogClose = () => {
    if (!isPhoneDialogLocked) {
      handleErrorAlertClose();
      setIsPhoneDialogOpen(false);
    }
  };
  const handlePhoneDialogOpen = () => {
    setIsPhoneDialogOpen(true);
  };

  // eslint-disable-next-line no-unused-vars
  const handlePhoneSubmit = (values, { setSubmitting }) => {
    setIsPhoneDialogLocked(true);
    handleErrorAlertClose();

    // api.authed.updateCurrentUserData({
    //   phone: !isEmpty(values.phone) ? values.phone : null,
    // })
    //   .then((res) => {
    //     onUpdateUserData(res);
    //     setSubmitting(false);
    //     setIsPhoneDialogLocked(false);
    //     setIsPhoneDialogOpen(false);
    //   })
    //   .catch((err) => {
    //     setError({ message: err.message, show: true });
    //     setSubmitting(false);
    //     setIsPhoneDialogLocked(false);
    //   });
  };

  const handleUsernameDialogClose = () => {
    if (!isUsernameDialogLocked) {
      handleErrorAlertClose();
      setIsUsernameDialogOpen(false);
    }
  };
  const handleUsernameDialogOpen = () => {
    setIsUsernameDialogOpen(true);
  };
  const handleUsernameSubmit = (values, { setSubmitting }) => {
    setIsUsernameDialogLocked(true);
    handleErrorAlertClose();

    APIService.User.updateCurrentUserProfile(values)
      .then((res) => {
        syncCurrentUserData("profile", res);
        setSubmitting(false);
        setIsUsernameDialogLocked(false);
        setIsUsernameDialogOpen(false);
      })
      .catch((err) => {
        setError({ message: err.message, show: true });
        setSubmitting(false);
        setIsUsernameDialogLocked(false);
      });
  };

  const {
    email,
    phone,
    username,
  } = user;

  return (
    <>
      <Helmet title="Account Settings" />

      <EmailChangeDialog
        alertBoxMargin={alertBoxMargin}
        email={email}
        error={error}
        isOpen={isEmailDialogOpen}
        onAlertClose={handleErrorAlertClose}
        onAlertCollapseEnter={handleAlertCollapseEnter}
        onAlertCollapseExit={handleAlertCollapseExit}
        onClose={handleEmailDialogClose}
        onSubmit={handleEmailSubmit}
      />

      <PhoneChangeDialog
        alertBoxMargin={alertBoxMargin}
        error={error}
        isOpen={isPhoneDialogOpen}
        onAlertClose={handleErrorAlertClose}
        onAlertCollapseEnter={handleAlertCollapseEnter}
        onAlertCollapseExit={handleAlertCollapseExit}
        onClose={handlePhoneDialogClose}
        onSubmit={handlePhoneSubmit}
        phone={phone}
      />

      <UsernameChangeDialog
        alertBoxMargin={alertBoxMargin}
        error={error}
        isOpen={isUsernameDialogOpen}
        onAlertClose={handleErrorAlertClose}
        onAlertCollapseEnter={handleAlertCollapseEnter}
        onAlertCollapseExit={handleAlertCollapseExit}
        onClose={handleUsernameDialogClose}
        onSubmit={handleUsernameSubmit}
        username={username}
      />

      <Paper>
        <List>
          <ListItem>
            <ListItemText
              primary="Profile Information"
              secondary="Basic and background information (e.g. name, address, experience)"
            />

            <ListItemSecondaryAction>
              <Button
                component={RouterLink}
                to={`${makeProfileRoute(username)}?edit=true`}
              >
                Edit
              </Button>
            </ListItemSecondaryAction>
          </ListItem>

          <ListItem>
            <ListItemText
              primary="Username"
              secondary={username}
            />

            <ListItemSecondaryAction>
              <Button
                onClick={handleUsernameDialogOpen}
              >
                Change
              </Button>
            </ListItemSecondaryAction>
          </ListItem>

          <ListItem>
            <ListItemText
              primary="Email Address"
              secondary={email}
            />

            <ListItemSecondaryAction>
              <Button
                onClick={handleEmailDialogOpen}
              >
                Change
              </Button>
            </ListItemSecondaryAction>
          </ListItem>

          <ListItem>
            <ListItemText
              primary="Phone"
              secondary={phone || "N/A"}
            />

            <ListItemSecondaryAction>
              <Button
                onClick={handlePhoneDialogOpen}
              >
                Change
              </Button>
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </Paper>
    </>
  );
};

export default View;
