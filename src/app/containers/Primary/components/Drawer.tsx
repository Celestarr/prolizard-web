import {
  ContentPasteSearch,
  WorkHistory,
} from "@mui/icons-material";
import {
  Drawer as MuiDrawer,
  ListSubheader,
} from "@mui/material";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Routes from "app/constants/routes";
import { DRAWER_WIDTH } from "app/constants/ui.ts";
import * as React from "react";
import {
  // LinkProps as RouterLinkProps,
  NavLink as RouterLink,
} from "react-router-dom";

interface ListItemLinkProps {
  icon: React.ReactElement;
  label: string;
  to: string;
}

// const Link = React.forwardRef<HTMLAnchorElement, RouterLinkProps>(
//   // eslint-disable-next-line react/jsx-props-no-spreading
//   (itemProps, ref) => <RouterLink ref={ref} {...itemProps} role={undefined} />,
// );

function ListItemLink({
  icon,
  label,
  to,
}: ListItemLinkProps) {
  return (
    <RouterLink to={to} style={{ color: "unset", textDecoration: "unset" }}>
      {({ isActive }) => (
        <ListItem disablePadding>
          <ListItemButton selected={isActive}>
            {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
            <ListItemText primary={label} />
          </ListItemButton>
        </ListItem>
      )}
    </RouterLink>
  );
}

const drawerSections = [
  {
    title: "Career",
    items: [
      {
        icon: <WorkHistory />,
        label: "Job Tracker",
        to: Routes.CAREER_JOB_TRACKER,
      },
    ],
  },
  {
    title: "Reference Management",
    items: [
      {
        icon: <ContentPasteSearch />,
        label: "Article Search",
        to: Routes.RM_ARTICLE_SEARCH,
      },
    ],
  },
];

interface DrawerProps {
  handleDrawerClose: () => void;
  handleDrawerTransitionEnd: () => void;
  mobileOpen: boolean;
}

export default function Drawer({
  handleDrawerClose,
  handleDrawerTransitionEnd,
  mobileOpen,
}: DrawerProps) {
  const drawer = (
    <div>
      <Toolbar />
      <Box sx={{ overflow: "auto" }}>
        {drawerSections.map((item) => (
          <React.Fragment key={item.title}>
            <List>
              <ListSubheader>{item.title}</ListSubheader>
              {item.items.map((link) => (
                <ListItemLink
                  icon={link.icon}
                  key={link.label}
                  label={link.label}
                  to={link.to}
                />
              ))}
            </List>
            <Divider />
          </React.Fragment>
        ))}

        <List>
          {["All mail", "Trash", "Spam"].map((text) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </div>
  );

  return (
    <>
      <MuiDrawer
        variant="temporary"
        open={mobileOpen}
        onTransitionEnd={handleDrawerTransitionEnd}
        onClose={handleDrawerClose}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: DRAWER_WIDTH },
        }}
      >
        {drawer}
      </MuiDrawer>
      <MuiDrawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: DRAWER_WIDTH },
        }}
        open
      >
        {drawer}
      </MuiDrawer>
    </>
  );
}
