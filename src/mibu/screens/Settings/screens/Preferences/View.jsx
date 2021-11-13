/* eslint-disable no-unused-vars */
import {
  Button,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
} from "@mui/material";
import APIService from "mibu/services/api";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";

// import api from "mibu/utils/api";
import PortfolioTemplateChangeDialog from "./components/PortfolioTemplateChangeDialog";
import ResumeTemplateChangeDialog from "./components/ResumeTemplateChangeDialog";

const View = ({
  // onUpdateUserData,
  onUserPreferencesUpdate,
  user: {
    preferences: {
      ui_mode: uiMode,
      portfolio_template: portfolioTemplate,
      resume_template: resumeTemplate,
    },
  },
}) => {
  const [isDarkModeToggling, setIsDarkModeToggling] = useState(false);

  const [portfolioTemplateAlertBoxMargin, setPortfolioTemplateAlertBoxMargin] = useState(0);
  const [portfolioTemplateDialogError, setPortfolioTemplateDialogError] = useState({
    message: null,
    show: false,
  });
  const [isPortfolioTemplateDialogLocked, setIsPortfolioTemplateDialogLocked] = useState(false);
  const [isPortfolioTemplateDialogOpen, setIsPortfolioTemplateDialogOpen] = useState(false);
  const [portfolioTemplates, setPortfolioTemplates] = useState(null);

  const [resumeTemplateAlertBoxMargin, setResumeTemplateAlertBoxMargin] = useState(0);
  const [resumeTemplateDialogError, setResumeTemplateDialogError] = useState({
    message: null,
    show: false,
  });
  const [isResumeTemplateDialogLocked, setIsResumeTemplateDialogLocked] = useState(false);
  const [isResumeTemplateDialogOpen, setIsResumeTemplateDialogOpen] = useState(false);
  const [resumeTemplates, setResumeTemplates] = useState(null);

  useEffect(() => {
    if (portfolioTemplates) {
      // Open portfolio template change dialog after fetching
      // templates.
      setIsPortfolioTemplateDialogOpen(true);
    }
  }, [portfolioTemplates]);

  useEffect(() => {
    if (resumeTemplates) {
      // Open resume template change dialog after fetching
      // templates.
      setIsResumeTemplateDialogOpen(true);
    }
  }, [resumeTemplates]);

  const handleDarkModeToggle = () => {
    APIService.User.updateCurrentUserProfile({ ui_mode: uiMode })
      .then((res) => {
        onUserPreferencesUpdate(res);
        setIsDarkModeToggling(false);
      })
      .catch((err) => {
        console.log(err.message);
        setIsDarkModeToggling(false);
      });
  };

  const handlePortfolioTemplateAlertCollapseEnter = () => {
    setPortfolioTemplateAlertBoxMargin(2);
  };
  const handlePortfolioTemplateAlertCollapseExit = () => {
    setPortfolioTemplateAlertBoxMargin(0);
  };
  const handlePortfolioTemplateErrorAlertClose = () => {
    setPortfolioTemplateDialogError({ ...portfolioTemplateDialogError, show: false });
    setPortfolioTemplateAlertBoxMargin(0);
  };
  const handlePortfolioTemplateDialogClose = () => {
    if (!isPortfolioTemplateDialogLocked) {
      handlePortfolioTemplateErrorAlertClose();
      setIsPortfolioTemplateDialogOpen(false);
    }
  };
  const handlePortfolioTemplateDialogOpen = () => {
    if (!portfolioTemplates) {
      // api.authed.getPortfolioTemplates()
      //   .then((res) => {
      //     setPortfolioTemplates(res);
      //   })
      //   .catch((err) => {
      //     console.log(err.message);
      //   });
    } else {
      setIsPortfolioTemplateDialogOpen(true);
    }
  };
  const handlePortfolioTemplateSubmit = (values, { setSubmitting }) => {
    setIsPortfolioTemplateDialogLocked(true);
    handlePortfolioTemplateErrorAlertClose();

    // api.authed.updateUserPreferences({
    //   portfolio_template: values.template,
    // })
    //   .then((res) => {
    //     onUserPreferencesUpdate(res);
    //     setSubmitting(false);
    //     setIsPortfolioTemplateDialogLocked(false);
    //     setIsPortfolioTemplateDialogOpen(false);
    //   })
    //   .catch((err) => {
    //     setPortfolioTemplateDialogError({ message: err.message, show: true });
    //     setSubmitting(false);
    //     setIsPortfolioTemplateDialogLocked(false);
    //   });
  };

  const handleResumeTemplateAlertCollapseEnter = () => {
    setResumeTemplateAlertBoxMargin(2);
  };
  const handleResumeTemplateAlertCollapseExit = () => {
    setResumeTemplateAlertBoxMargin(0);
  };
  const handleResumeTemplateErrorAlertClose = () => {
    setResumeTemplateDialogError({ ...resumeTemplateDialogError, show: false });
    setResumeTemplateAlertBoxMargin(0);
  };
  const handleResumeTemplateDialogClose = () => {
    if (!isResumeTemplateDialogLocked) {
      handleResumeTemplateErrorAlertClose();
      setIsResumeTemplateDialogOpen(false);
    }
  };
  const handleResumeTemplateDialogOpen = () => {
    if (!resumeTemplates) {
      // api.authed.getResumeTemplates()
      //   .then((res) => {
      //     setResumeTemplates(res);
      //   })
      //   .catch((err) => {
      //     console.log(err.message);
      //   });
    } else {
      setIsResumeTemplateDialogOpen(true);
    }
  };
  const handleResumeTemplateSubmit = (values, { setSubmitting }) => {
    setIsResumeTemplateDialogLocked(true);
    handleResumeTemplateErrorAlertClose();

    // api.authed.updateUserPreferences({
    //   resume_template: values.template,
    // })
    //   .then((res) => {
    //     onUserPreferencesUpdate(res);
    //     setSubmitting(false);
    //     setIsResumeTemplateDialogLocked(false);
    //     setIsResumeTemplateDialogOpen(false);
    //   })
    //   .catch((err) => {
    //     setResumeTemplateDialogError({ message: err.message, show: true });
    //     setSubmitting(false);
    //     setIsResumeTemplateDialogLocked(false);
    //   });
  };

  return (
    <>
      <Helmet title="Preferences" />

      <PortfolioTemplateChangeDialog
        alertBoxMargin={portfolioTemplateAlertBoxMargin}
        error={portfolioTemplateDialogError}
        isOpen={isPortfolioTemplateDialogOpen}
        onAlertClose={handlePortfolioTemplateErrorAlertClose}
        onAlertCollapseEnter={handlePortfolioTemplateAlertCollapseEnter}
        onAlertCollapseExit={handlePortfolioTemplateAlertCollapseExit}
        onClose={handlePortfolioTemplateDialogClose}
        onSubmit={handlePortfolioTemplateSubmit}
        template={portfolioTemplate}
        templates={portfolioTemplates}
      />

      <ResumeTemplateChangeDialog
        alertBoxMargin={resumeTemplateAlertBoxMargin}
        error={resumeTemplateDialogError}
        isOpen={isResumeTemplateDialogOpen}
        onAlertClose={handleResumeTemplateErrorAlertClose}
        onAlertCollapseEnter={handleResumeTemplateAlertCollapseEnter}
        onAlertCollapseExit={handleResumeTemplateAlertCollapseExit}
        onClose={handleResumeTemplateDialogClose}
        onSubmit={handleResumeTemplateSubmit}
        template={resumeTemplate}
        templates={resumeTemplates}
      />

      <Paper>
        <List>
          <ListItem>
            <ListItemText
              primary="Dark Mode"
              secondary={`Dark UI theme. Currently ${uiMode ? "active" : "inactive"}.`}
            />

            <ListItemSecondaryAction>
              <Button
                disabled={isDarkModeToggling}
                onClick={handleDarkModeToggle}
              >
                Turn
                {" "}
                {uiMode ? "off" : "on"}
              </Button>
            </ListItemSecondaryAction>
          </ListItem>

          <ListItem>
            <ListItemText
              primary="Portfolio Template"
              secondary={portfolioTemplate.name}
            />

            <ListItemSecondaryAction>
              <Button
                onClick={handlePortfolioTemplateDialogOpen}
              >
                Change
              </Button>
            </ListItemSecondaryAction>
          </ListItem>

          <ListItem>
            <ListItemText
              primary="Résumé Template"
              secondary={resumeTemplate.name}
            />

            <ListItemSecondaryAction>
              <Button
                disabled={!!resumeTemplates && isResumeTemplateDialogOpen}
                onClick={handleResumeTemplateDialogOpen}
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
