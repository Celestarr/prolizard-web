import { Typography } from "@mui/material";
import React from "react";

export default function EmptyCell() {
  return (
    <Typography component="span" sx={{ color: (theme) => theme.palette.text.disabled }}>
      —
    </Typography>
  );
}
