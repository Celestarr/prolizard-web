import { Grid, Link, Typography } from "@mui/material";
import AppSettings from "mibu/settings";
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

const CompactGlobalFooter = () => (
  <Grid
    container
    justify="center"
    spacing={2}
  >
    {links.map((link) => (
      <Grid item key={link.label}>
        <Link
          component={RouterLink}
          to={link.location}
        >
          {link.label}
        </Link>
      </Grid>
    ))}
    <Grid item xs={12}>
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

export default CompactGlobalFooter;
