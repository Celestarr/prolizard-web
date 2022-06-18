import {
  Container,
  Grid,
  Typography,
  useTheme,
} from "@mui/material";
import cssImportantSuffixer from "busan/utils/cssImportantSuffixer";
import React from "react";

const OverviewCard = () => {
  const theme = useTheme();

  // User info
  // const {
  //   first_name: firstName,
  //   headline,
  //   last_name: lastName,
  // } = user;
  // const fullName = `${firstName} ${lastName}`;

  return (
    <>
      <Grid
        item
        md={12}
        sx={{
          backgroundColor: theme.palette.primary[theme.palette.mode],
          paddingTop: cssImportantSuffixer(theme.spacing(12)),
        }}
      >
        <Container
          sx={{
            paddingBottom: 4,
            paddingTop: 5,
            position: "relative",
          }}
        >
          <Grid container spacing={6}>
            <Grid
              item
              md={8}
              sm={8}
              xs={12}
              sx={{
                color: theme.palette.primary.contrastText,
              }}
            >
              &nbsp;
            </Grid>
            <Grid
              item
              md={4}
              sm={4}
              xs={12}
              sx={{
                color: theme.palette.primary.contrastText,
              }}
            >
              <Typography variant="h5" component="div" sx={{ fontWeight: 700 }}>
                0
              </Typography>
              <Typography variant="body1" component="div">
                People viewed your profile in last 7 days
              </Typography>

              <Typography variant="h5" component="div" sx={{ fontWeight: 700, marginTop: 2 }}>
                36
              </Typography>
              <Typography variant="body1" component="div">
                Connections
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Grid>
    </>
  );
};

export default OverviewCard;
