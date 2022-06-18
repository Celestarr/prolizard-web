import {
  Button,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
} from "@mui/material";
import { syncCurrentUserData } from "busan/actions/user";
import { currentUserSelector } from "busan/reducers/selectors";
import APIService from "busan/services/api";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";

import ResumeTemplateChangeDialog from "./components/ResumeTemplateChangeDialog";

const PreferencesScreen = () => {
  const user = useSelector(currentUserSelector);
  const dispatch = useDispatch();
  const [resumeTemplateAlertBoxMargin, setResumeTemplateAlertBoxMargin] = useState(0);
  const [resumeTemplateDialogError, setResumeTemplateDialogError] = useState({
    message: null,
    show: false,
  });
  const [isResumeTemplateDialogLocked, setIsResumeTemplateDialogLocked] = useState(false);
  const [isResumeTemplateDialogOpen, setIsResumeTemplateDialogOpen] = useState(false);

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
    setIsResumeTemplateDialogOpen(true);
  };
  const handleResumeTemplateSubmit = (values, { setSubmitting }) => {
    setIsResumeTemplateDialogLocked(true);
    handleResumeTemplateErrorAlertClose();

    APIService.User.updateCurrentUserPreferences({
      resume_template: values.template,
    })
      .then((res) => {
        dispatch(syncCurrentUserData("preferences", res));
        setSubmitting(false);
        setIsResumeTemplateDialogLocked(false);
        setIsResumeTemplateDialogOpen(false);
      })
      .catch((err) => {
        setResumeTemplateDialogError({ message: err.message, show: true });
        setSubmitting(false);
        setIsResumeTemplateDialogLocked(false);
      });
  };

  const { preferences } = user;

  return (
    <>
      <Helmet title="Preferences" />

      <ResumeTemplateChangeDialog
        alertBoxMargin={resumeTemplateAlertBoxMargin}
        error={resumeTemplateDialogError}
        isOpen={isResumeTemplateDialogOpen}
        onAlertClose={handleResumeTemplateErrorAlertClose}
        onAlertCollapseEnter={handleResumeTemplateAlertCollapseEnter}
        onAlertCollapseExit={handleResumeTemplateAlertCollapseExit}
        onClose={handleResumeTemplateDialogClose}
        onSubmit={handleResumeTemplateSubmit}
        template={preferences.resume_template}
        templates={[]}
      />

      <Paper>
        <List>
          <ListItem>
            <ListItemText
              primary="Résumé Template"
              secondary={preferences.resume_template.name}
            />

            <ListItemSecondaryAction>
              <Button
                disabled={isResumeTemplateDialogOpen}
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

export default PreferencesScreen;
