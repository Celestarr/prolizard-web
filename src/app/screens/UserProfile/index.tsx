import {
  Box,
  Container,
  Divider,
  Grid,
  Paper,
} from "@mui/material";
import CompactGlobalFooter from "app/components/CompactGlobalFooter";
import GlobalSpinner from "app/components/GlobalSpinner";
import { useGetUserProfileByIdQuery } from "app/services/user-profiles";
import { useSnackbar } from "notistack";
import qs from "qs";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  useLocation,
  useParams,
} from "react-router-dom";

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

function ProfileSectionDivider() {
  return (
    <Box sx={{ marginY: 3 }}>
      <Divider />
    </Box>
  );
}

export default function UserProfileScreen() {
  const { enqueueSnackbar } = useSnackbar();
  // const theme = useTheme();
  const {
    data: user,
  } = useGetUserProfileByIdQuery("me");
  const { username: usernameQuery } = useParams();
  const {
    data: userProfile,
    error: fetchUserProfileError,
  } = useGetUserProfileByIdQuery(usernameQuery!, {
    skip: typeof usernameQuery !== "undefined" && user?.username !== usernameQuery,
  });
  const [isEditable, setIsEditable] = useState(false);
  const [editOnMount, setEditOnMount] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (user && userProfile) {
      setEditOnMount(!!qs.parse(location.search, { ignoreQueryPrefix: true }).edit);
    }
  }, [location, user, userProfile]);

  if (!user) {
    return <GlobalSpinner />;
  }

  if (fetchUserProfileError) {
    return <div>Error</div>;
  }

  const data = userProfile || user;

  const userFullName = `${data.first_name} ${data.last_name}`;

  return (
    <Grid
      container
      spacing={3}
    >
      <Helmet title={userFullName} />

      <ProfileCard
        editOnMount={editOnMount}
        enqueueSnackbar={enqueueSnackbar}
        isEditable={isEditable}
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
          <Grid container spacing={6}>
            <Grid
              item
              md={8}
              sm={8}
              xs={12}
            >
              <Paper sx={{ paddingX: 4, paddingY: 4 }}>
                <WorkExperienceSection
                  isEditable={isEditable}
                  records={data.work_experiences}
                />

                <ProfileSectionDivider />

                <AcademicRecordSection
                  isEditable={isEditable}
                  records={data.academic_records}
                />

                <ProfileSectionDivider />

                <SkillSection
                  isEditable={isEditable}
                  records={data.skills}
                />

                <ProfileSectionDivider />

                <LanguageSection
                  isEditable={isEditable}
                  records={data.languages}
                />

                <ProfileSectionDivider />

                <ProjectSection
                  isEditable={isEditable}
                  records={data.projects}
                />

                <ProfileSectionDivider />

                <PublicationSection
                  isEditable={isEditable}
                  records={data.publications}
                />

                <ProfileSectionDivider />

                <HonorOrAwardSection
                  isEditable={isEditable}
                  records={data.honors_or_awards}
                />

                <ProfileSectionDivider />

                <CertificationSection
                  isEditable={isEditable}
                  records={data.certifications}
                />

                <ProfileSectionDivider />

                <WebLinkSection
                  isEditable={isEditable}
                  records={data.web_links}
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
}
