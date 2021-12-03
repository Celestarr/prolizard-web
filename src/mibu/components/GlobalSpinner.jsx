import { CircularProgress, Grid } from "@mui/material";
import React from "react";

function GlobalSpinner() {
  return (
    <Grid
      container
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 9999,
      }}
      alignItems="center"
      justifyContent="center"
    >
      <Grid item>
        <CircularProgress color="primary" />
      </Grid>
    </Grid>
  );
}

export default GlobalSpinner;
