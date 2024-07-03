/* eslint-disable react/no-array-index-key */

import {
  Container,
  Grid,
  Paper,
} from "@mui/material";
import CompactGlobalFooter from "app/components/CompactGlobalFooter";
import GlobalSpinner from "app/components/GlobalSpinner";
import { currentUserSelector } from "app/reducers/selectors";
import React from "react";
import { Helmet } from "react-helmet-async";
import { useSelector } from "react-redux";

import OverviewCard from "./components/OverviewCard";

function FeedScreen() {
  const user = useSelector(currentUserSelector);

  if (!user) {
    return <GlobalSpinner />;
  }

  return (
    <Grid
      container
      spacing={3}
    >
      <Helmet title="Feed" />

      <OverviewCard />

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
              sx={{
                position: "relative",
              }}
            >
              <Grid
                container
                spacing={4}
                sx={{
                  paddingBottom: 4,
                  position: "absolute",
                  top: -164,
                  left: 48,
                  right: 0,
                  width: "calc(100% - 16px)",
                }}
              >
                {(new Array(10).fill(0)).map((item, idx) => (
                  <Grid item key={`${item}-${idx}`} md={12}>
                    <Paper
                      sx={{
                        paddingX: 4,
                        paddingY: 4,
                      }}
                    >
                      Feed post
                    </Paper>
                  </Grid>
                ))}
              </Grid>
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

export default FeedScreen;
