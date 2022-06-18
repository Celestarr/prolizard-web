import {
  Grid,
  Link,
  Typography,
  useTheme,
} from "@mui/material";
import AppSettings from "busan/settings";
// import cssImportantSuffixer from "busan/utils/cssImportantSuffixer";
import React from "react";
import { Link as RouterLink } from "react-router-dom";

const links = [
  {
    location: "/help",
    label: "Help",
  },
  {
    location: "/about",
    label: "About",
  },
  {
    location: "/careers",
    label: "Careers",
  },
  {
    location: "/advertise",
    label: "Advertise",
  },
  {
    location: "/blog",
    label: "Blog",
  },
  {
    location: "/terms",
    label: "Terms",
  },
  {
    location: "/privacy",
    label: "Privacy Policy",
  },
];

const CompactGlobalFooter = () => {
  const theme = useTheme();

  return (
    <Grid
      container
      justifyContent="center"
      spacing={1}
    >
      {links.map((link) => (
        <Grid item key={link.label}>
          <Link
            variant="subtitle2"
            component={RouterLink}
            to={link.location}
            sx={{
              color: theme.palette.text.disabled,
              textDecorationColor: theme.palette.text.disabled,
              // textDecoration: "none",
            }}
          >
            {link.label}
          </Link>
        </Grid>
      ))}
      <Grid item xs={12} sx={{ marginTop: 0.5 }}>
        <Typography
          align="center"
          color="textSecondary"
          component="div"
          variant="caption"
        >
          &copy;
          {" "}
          2021
          {" "}
          {AppSettings.APP_NAME}
          . All rights reserved.
        </Typography>
      </Grid>
    </Grid>
  );
};

export default CompactGlobalFooter;
