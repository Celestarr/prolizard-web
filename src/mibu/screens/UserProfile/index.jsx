/* eslint-disable react-hooks/exhaustive-deps */

import {
  // Avatar,
  Box,
  Container,
  Divider,
  Grid,
  Paper,
  // Paper,
  // useTheme,
} from "@mui/material";
// import { styled } from "@mui/material/styles";
import { syncCurrentUserData } from "mibu/actions/user";
import CompactGlobalFooter from "mibu/components/CompactGlobalFooter";
// import DummyAvatarImage from "mibu/images/dummy-avatar.png";
import { currentUserSelector, metadataSelector } from "mibu/reducers/selectors";
import { useSnackbar } from "notistack";
import qs from "qs";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import {
  useLocation,
  useParams,
} from "react-router-dom";

// import api from "mibu/utils/api";
import AcademicRecordSection from "./components/AcademicRecordSection";
import CertificationSection from "./components/CertificationSection";
import HonorOrAwardSection from "./components/HonorOrAwardSection";
import LanguageSection from "./components/LanguageSection";
import ProfileCard from "./components/ProfileCard";
import ProjectSection from "./components/ProjectSection";
import PublicationSection from "./components/PublicationSection";
import SkillSection from "./components/SkillSection";
import WebLinkSection from "./components/WebLinkSection";
import WorkExperienceSection from "./components/WorkExperienceSection";

const ProfileSectionDivider = () => (
  <Box sx={{ marginY: 3 }}>
    <Divider />
  </Box>
);

const UserProfileScreen = () => {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  // const theme = useTheme();
  const meta = useSelector(metadataSelector);
  const user = useSelector(currentUserSelector);
  const [data, setData] = useState(null);
  const [isEditable, setIsEditable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editOnMount, setEditOnMount] = useState(false);
  const { username } = useParams();
  const location = useLocation();

  useEffect(() => {
    if (data && (data.id === user.id) && (username === user.username)) {
      setData(user);
    } else {
      setIsLoading(true);
      setData(null);
      setIsEditable(false);

      if (username === user.username) {
        setData(user);
        setIsEditable(true);

        setEditOnMount(!!qs.parse(location.search, { ignoreQueryPrefix: true }).edit);
        setIsLoading(false);
      } else {
        // api.authed.getUserDataByUsername(username)
        //   .then((res) => {
        //     setData(res);
        //     setIsLoading(false);
        //     // return Promise.all([
        //     //   api.authed.getCountryChoices(),
        //     //   api.authed.getEmploymentTypeChoices(),
        //     //   api.authed.getGenderChoices(),
        //     //   api.authed.getLanguageProficiencyLevelChoices(),
        //     //   api.authed.getSkillProficiencyLevelChoices(),
        //     // ]);
        //   })
        //   // .then((res) => {
        //   //   setCountryChoices(res[0]);
        //   //   setEmploymentTypeChoices(res[1]);
        //   //   setGenderChoices(res[2]);
        //   //   setLanguageProficiencyLevelChoices(res[3]);
        //   //   setSkillProficiencyLevelChoices(res[4]);
        //   //   setIsLoading(false);
        //   // })
        //   .catch(() => {
        //     setIsLoading(false);
        //   });
      }
    }
  }, [location, user, username]);

  if (isLoading || !data) {
    return (
      <Box>
        Loading...
      </Box>
    );
  }

  // User info
  const {
    academic_records: academicRecords,
    certifications,
    honors_or_awards: honorsOrAwards,
    languages,
    projects,
    publications,
    skills,
    web_links: webLinks,
    work_experiences: workExperiences,
  } = data;

  const userFullName = `${user.first_name} ${user.last_name}`;

  return (
    <Grid
      container
      spacing={3}
    >
      <Helmet title={userFullName} />
      <ProfileCard
        countryChoices={meta.countries}
        editOnMount={editOnMount}
        enqueueSnackbar={enqueueSnackbar}
        genderChoices={meta.genders}
        isEditable={isEditable}
        syncCurrentUserData={(...args) => dispatch(syncCurrentUserData(...args))}
        user={data}
      />

      <Grid
        item
        md={12}
      >
        <Container
          sx={{
            paddingBottom: 4,
            paddingTop: 4,
          }}
        >
          <Grid container item md={12} spacing={6}>
            <Grid
              item
              md={8}
              sm={8}
              xs={12}
            >
              <Paper sx={{ paddingX: 4, paddingY: 4 }}>
                <WorkExperienceSection
                  employmentTypeChoices={meta.employment_types}
                  isEditable={isEditable}
                  syncCurrentUserData={(...args) => dispatch(syncCurrentUserData(...args))}
                  records={workExperiences}
                />

                <ProfileSectionDivider />

                <AcademicRecordSection
                  isEditable={isEditable}
                  syncCurrentUserData={(...args) => dispatch(syncCurrentUserData(...args))}
                  records={academicRecords}
                />

                <ProfileSectionDivider />

                <SkillSection
                  isEditable={isEditable}
                  syncCurrentUserData={(...args) => dispatch(syncCurrentUserData(...args))}
                  records={skills}
                  skillProficiencyLevelChoices={meta.skill_proficiency_levels}
                />

                <ProfileSectionDivider />

                <LanguageSection
                  isEditable={isEditable}
                  languageProficiencyLevelChoices={meta.language_proficiency_levels}
                  syncCurrentUserData={(...args) => dispatch(syncCurrentUserData(...args))}
                  records={languages}
                />

                <ProfileSectionDivider />

                <ProjectSection
                  isEditable={isEditable}
                  syncCurrentUserData={(...args) => dispatch(syncCurrentUserData(...args))}
                  records={projects}
                />

                <ProfileSectionDivider />

                <PublicationSection
                  isEditable={isEditable}
                  syncCurrentUserData={(...args) => dispatch(syncCurrentUserData(...args))}
                  records={publications}
                />

                <ProfileSectionDivider />

                <HonorOrAwardSection
                  isEditable={isEditable}
                  syncCurrentUserData={(...args) => dispatch(syncCurrentUserData(...args))}
                  records={honorsOrAwards}
                />

                <ProfileSectionDivider />

                <CertificationSection
                  isEditable={isEditable}
                  syncCurrentUserData={(...args) => dispatch(syncCurrentUserData(...args))}
                  records={certifications}
                />

                <ProfileSectionDivider />

                <WebLinkSection
                  isEditable={isEditable}
                  syncCurrentUserData={(...args) => dispatch(syncCurrentUserData(...args))}
                  records={webLinks}
                />
              </Paper>
            </Grid>
            <Grid
              item
              md={4}
              sm={4}
              xs={12}
            >
              <CompactGlobalFooter />
            </Grid>
          </Grid>
        </Container>
      </Grid>
    </Grid>
  );
};

export default UserProfileScreen;
