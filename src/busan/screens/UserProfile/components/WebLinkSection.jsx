/* eslint-disable react/jsx-props-no-spreading */
import {
  Facebook as FacebookIcon,
  GitHub as GitHubIcon,
  Language as LanguageIcon,
  LinkedIn as LinkedInIcon,
  Reddit as RedditIcon,
  Twitter as TwitterIcon,
  YouTube as YouTubeIcon,
} from "@mui/icons-material";
import {
  Alert,
  Timeline,
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
} from "@mui/material";
import APIService from "busan/services/api";
import getWebLinkType from "busan/utils/getWebLinkType";
import isEmpty from "busan/utils/isEmpty";
import React from "react";
import * as Yup from "yup";

import GenericSection from "./GenericSection";

const Schema = Yup.object({
  href: Yup.string().required("Link address is required."),
  label: Yup.string().notRequired(),
});

const defaultInitialValues = {
  label: "",
  href: "",
};

const linkTypeIconMap = {
  facebook: FacebookIcon,
  github: GitHubIcon,
  linkedin: LinkedInIcon,
  reddit: RedditIcon,
  twitter: TwitterIcon,
  youtube: YouTubeIcon,
};

const getLinkIconComponent = (link) => (linkTypeIconMap[getWebLinkType(link)] || LanguageIcon);

const WebLinkSection = ({
  isEditable,
  syncCurrentUserData,
  records,
}) => {
  const nothingToShow = !records.length;

  const transformPayload = (values) => {
    const payload = {
      label: !isEmpty(values.label) ? values.label : null,
      href: values.href,
    };

    return payload;
  };

  return (
    <GenericSection
      isModifiable={isEditable}
      modifyButtonColor="primary"
      modifyButtonTitle="Add"
      nothingToShow={nothingToShow}
      sectionTitle="Web Link"
      createSvc={APIService.User.createWebLink}
      deleteSvc={APIService.User.deleteWebLink}
      updateSvc={APIService.User.updateWebLink}
      syncCurrentUserData={syncCurrentUserData}
      formSchema={Schema}
      sectionScope="webLinks"
      transformPayload={transformPayload}
      getFormInitialValues={(addMode, currentRecord) => (
        addMode ? defaultInitialValues
          : ({
            href: currentRecord.href,
            label: currentRecord.label || "",
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
                error={!!(touched.label && errors.label)}
                fullWidth
                helperText={touched.label && errors.label ? errors.label : null}
                id="label"
                label="Link Text"
                margin="normal"
                name="label"
                onBlur={handleBlur}
                onChange={handleChange}
                placeholder="e.g. example.com"
                value={values.label}
                variant="outlined"
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
                autoFocus
                error={!!(touched.href && errors.href)}
                fullWidth
                helperText={touched.href && errors.href ? errors.href : null}
                id="href"
                label="Link Address"
                margin="normal"
                name="href"
                onBlur={handleBlur}
                onChange={handleChange}
                placeholder="e.g. https://www.example.com"
                required
                value={values.href}
                variant="outlined"
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
          {records.map((record) => {
            const IconComponent = getLinkIconComponent(record.href);

            return (
              <TimelineItem
                key={record.id}
              >
                <TimelineContent>
                  <Box
                    alignItems="center"
                    display="flex"
                    flexDirection="row"
                  >
                    <IconComponent />
                    <Link
                      href={record.href}
                      target="_blank"
                    >
                      {record.label || record.href}
                    </Link>
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
                </TimelineContent>
              </TimelineItem>
            );
          })}
        </Timeline>
      )}
    </GenericSection>
  );
};

export default WebLinkSection;
