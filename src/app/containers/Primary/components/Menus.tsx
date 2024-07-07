import {
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  SettingsBrightness as SettingsBrightnessIcon,
} from "@mui/icons-material";
import {
  Box,
  // Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import Routes from "app/constants/routes";
import makeProfileRoute from "app/utils/makeProfileRoute";
import classNames from "classnames";
import React, { MouseEvent } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";

function wrapHandleMyProfileClick(
  navigate: NavigateFunction,
  username: string,
  setAnchorEl: (_anchorEl: null) => void,
  handleMobileMenuClose: () => void,
) {
  return function handleMyProfileClick() {
    navigate(makeProfileRoute(username));
    setAnchorEl(null);
    handleMobileMenuClose();
  };
}

function wrapHandleSettingsClick(
  navigate: NavigateFunction,
  setAnchorEl: (_anchorEl: null) => void,
  handleMobileMenuClose: () => void,
) {
  return function handleSettingsClick() {
    navigate(Routes.SETTINGS);
    setAnchorEl(null);
    handleMobileMenuClose();
  };
}

interface DesktopMenuProps {
  anchorEl: Element | null;
  handleMenuClose: () => void;
  handleMobileMenuClose: () => void;
  isMenuOpen: boolean;
  menuId: string;
  onSignOut: () => void;
  onUIModeChange: (_uiMode: string) => void;
  setAnchorEl: (_anchorEl: Element | null) => void;
  uiMode: string;
  username: string;
}

export function DesktopMenu({
  anchorEl,
  handleMenuClose,
  handleMobileMenuClose,
  isMenuOpen,
  menuId,
  onSignOut,
  onUIModeChange,
  setAnchorEl,
  uiMode,
  username,
}: DesktopMenuProps) {
  const navigate = useNavigate();

  return (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <Box pb={2} pt={1} px={2}>
        <Typography mb={1} variant="subtitle1" component="div">Appearance</Typography>
        <ToggleButtonGroup
          exclusive
          size="small"
          aria-label="ui mode switch group"
          onChange={(_, value: string) => {
            if (value) {
              onUIModeChange(value);
            }
          }}
          value={uiMode}
        >
          <ToggleButton
            className={classNames("app-no-text-transform")}
            value="light"
            sx={{ paddingX: 2 }}
          >
            <LightModeIcon sx={{ fontSize: 14 }} />
            <Typography ml={1} variant="subtitle2">Light</Typography>
          </ToggleButton>
          <ToggleButton
            className={classNames("app-no-text-transform")}
            value="dark"
            sx={{ paddingX: 2 }}
          >
            <DarkModeIcon sx={{ fontSize: 14 }} />
            <Typography ml={1} variant="subtitle2">Dark</Typography>
          </ToggleButton>
          <ToggleButton
            className={classNames("app-no-text-transform")}
            value="system"
            sx={{ paddingX: 2 }}
          >
            <SettingsBrightnessIcon sx={{ fontSize: 14 }} />
            <Typography ml={1} variant="subtitle2">System</Typography>
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      {/* <Divider sx={{ marginBottom: 1 }} /> */}
      <MenuItem
        onClick={wrapHandleMyProfileClick(navigate, username, setAnchorEl, handleMobileMenuClose)}
      >
        <ListItemIcon>
          <PersonIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>My Profile</ListItemText>
      </MenuItem>
      <MenuItem
        onClick={wrapHandleSettingsClick(navigate, setAnchorEl, handleMobileMenuClose)}
      >
        <ListItemIcon>
          <SettingsIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Settings</ListItemText>
      </MenuItem>
      <MenuItem onClick={onSignOut}>
        <ListItemIcon>
          <LogoutIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Sign Out</ListItemText>
      </MenuItem>
    </Menu>
  );
}

interface MobileMenuProps {
  anchorEl: Element | null;
  handleMenuClose: () => void;
  // handleMobileMenuClose: string;
  handleProfileMenuOpen: (_event: MouseEvent<HTMLElement>) => void;
  isMenuOpen: boolean;
  menuId: string;
  // setAnchorEl: string;
  // username: string;
}

export function MobileMenu({
  anchorEl,
  handleMenuClose,
  // handleMobileMenuClose,
  handleProfileMenuOpen,
  isMenuOpen,
  menuId,
  // setAnchorEl,
  // username,
}: MobileMenuProps) {
  return (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <PersonIcon />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );
}
