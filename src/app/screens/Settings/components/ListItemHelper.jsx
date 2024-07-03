import { ListItem } from "@mui/material";
import React from "react";
import { Link as RouterLink } from "react-router-dom";

function ListItemHelper({
  children,
  to,
  url,
}) {
  return (
    <ListItem
      button
      component={RouterLink}
      selected={url.includes(to)}
      to={to}
    >
      {children}
    </ListItem>
  );
}

export default ListItemHelper;
