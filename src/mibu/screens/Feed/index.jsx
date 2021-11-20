import {
  Alert,
  AlertTitle,
  Container,
  Grid,
} from "@mui/material";
import CompactGlobalFooter from "mibu/components/CompactGlobalFooter";
import { currentUserSelector } from "mibu/reducers/selectors";
import AppSettings from "mibu/settings";
import React from "react";
import { Helmet } from "react-helmet-async";
import { useSelector } from "react-redux";

import ProfileCard from "./components/ProfileCard";

const FeedScreen = () => {
  const user = useSelector(currentUserSelector);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <Container
      sx={{
        paddingBottom: 4,
        paddingTop: 16,
      }}
    >
      <Helmet title="Feed" />
      <Grid
        container
        spacing={3}
      >
        <Grid
          item
          md={3}
          sm={3}
          xs={12}
        >
          <ProfileCard
            user={user}
          />
        </Grid>
        <Grid
          item
          md={6}
          sm={6}
          xs={12}
        >
          <Alert severity="info">
            <AlertTitle>Hello</AlertTitle>
            Welcome to
            {" "}
            {AppSettings.APP_NAME}
            {". "}
          </Alert>
        </Grid>
        <Grid
          item
          md={3}
          sm={3}
          xs={12}
        >
          <CompactGlobalFooter />
        </Grid>
      </Grid>
    </Container>
  );
};

export default FeedScreen;
