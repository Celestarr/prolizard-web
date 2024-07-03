/* eslint-disable arrow-body-style */
/* eslint-disable jsx-a11y/anchor-is-valid */

import { Box, Paper, useTheme } from "@mui/material";
import * as classes from "app/styles/classes";
// import { styled } from "@mui/material/styles";
// import routes from "app/constants/routes";
// import AppSettings from "app/settings";
import React from "react";
import { Helmet } from "react-helmet-async";
import { Outlet } from "react-router-dom";

// const Copyright = () => {
//   const currentYear = new Date().getFullYear();
//   return (
//     <Typography variant="body2" color="textSecondary" align="center">
//       &copy;
//       {" "}
//       {currentYear}
//       {" "}
//       <Link to={routes.HOME}>
//         {AppSettings.APP_NAME}
//       </Link>
//       .
//       {" "}
//       All rights reserved.
//     </Typography>
//   );
// };

function AuthContainer({ pageTitle }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        ...classes.Container,
        ...classes.Column,
        ...classes.FlexGrow,
        minHeight: "100vh",
      }}
    >
      <Helmet title={pageTitle} />

      <Box
        sx={{
          ...classes.Container,
          ...classes.Column,
          ...classes.FlexGrow,
        }}
      >
        <Box
          sx={{
            ...classes.Container,
            ...classes.Row,
            ...classes.FlexAll,
            justifyContent: "center",
            minWidth: 0,
            minHeight: "100%",
          }}
        >
          <Box
            sx={{
              ...classes.Container,
              ...classes.Column,
              ...classes.FlexGrow,
              paddingTop: 4,
              paddingLeft: 1,
              paddingBottom: 4,
              paddingRight: 1,
              justifyContent: "center",
              maxWidth: theme.spacing(70),
            }}
          >
            <Paper
              sx={{
                paddingTop: 4,
                paddingLeft: 4,
                paddingBottom: 4,
                paddingRight: 4,
              }}
            >
              <Outlet />
            </Paper>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default AuthContainer;
