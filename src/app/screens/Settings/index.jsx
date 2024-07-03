import {
  Container,
  Grid,
  List,
  ListItemText,
  ListSubheader,
  Paper,
  Typography,
} from "@mui/material";
import CompactGlobalFooter from "app/components/CompactGlobalFooter";
import GlobalSpinner from "app/components/GlobalSpinner";
import Routes from "app/constants/routes";
import { currentUserSelector } from "app/reducers/selectors";
import React from "react";
import { useSelector } from "react-redux";
import {
  Outlet,
  useLocation,
} from "react-router-dom";

import ListItemHelper from "./components/ListItemHelper";

function SettingsScreen() {
  const user = useSelector(currentUserSelector);
  const { pathname } = useLocation();

  if (!user) {
    return <GlobalSpinner />;
  }

  return (
    <Container
      sx={{
        paddingBottom: 4,
        paddingTop: 16,
      }}
    >
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
          <Paper>
            <List
              subheader={(
                <ListSubheader component="div" sx={{ lineHeight: "40px", paddingBottom: 1 }}>
                  <Typography variant="button">
                    Settings
                  </Typography>
                </ListSubheader>
              )}
              sx={{ paddingTop: 1 }}
            >
              <ListItemHelper
                to={Routes.SETTINGS_ACCOUNT}
                url={pathname}
              >
                <ListItemText
                  primary="Account"
                />
              </ListItemHelper>

              <ListItemHelper
                to={Routes.SETTINGS_PREFERENCES}
                url={pathname}
              >
                <ListItemText
                  primary="Preferences"
                />
              </ListItemHelper>

              {/* <ListItemHelper
                to={Routes.SETTINGS_SECURITY}
                url={pathname}
              >
                <ListItemText
                  primary="Security"
                />
              </ListItemHelper>

              <ListItemHelper
                to={Routes.SETTINGS_PRIVACY}
                url={pathname}
              >
                <ListItemText
                  primary="Privacy"
                />
              </ListItemHelper>

              <ListItemHelper
                to={Routes.SETTINGS_NOTIFICATIONS}
                url={pathname}
              >
                <ListItemText
                  primary="Notifications"
                />
              </ListItemHelper> */}
            </List>
          </Paper>
        </Grid>
        <Grid
          item
          md={6}
          sm={6}
          xs={12}
        >
          <Outlet />
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
}

export default SettingsScreen;
