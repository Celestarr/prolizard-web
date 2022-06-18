import { ListItem } from "@mui/material";
import React from "react";
import { Link as RouterLink } from "react-router-dom";

const ListItemHelper = ({
  children,
  to,
  url,
}) => (
  <ListItem
    button
    component={RouterLink}
    selected={url.includes(to)}
    to={to}
  >
    {children}
  </ListItem>
);

export default ListItemHelper;
