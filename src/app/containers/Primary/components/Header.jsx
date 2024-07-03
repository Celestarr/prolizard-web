import {
  Menu as MenuIcon,
} from "@mui/icons-material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import MoreIcon from "@mui/icons-material/MoreVert";
import { Button } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { DRAWER_WIDTH } from "app/constants/ui.ts";
import AppLogo from "app/images/myfolab-icon-310x310.png";
import APIService from "app/services/api";
import AppSettings from "app/settings";
import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";

import Avatar from "./Avatar";
import { DesktopMenu, MobileMenu } from "./Menus";

function Header({
  handleDrawerToggle,
  onSignOut,
  onSyncCurrentUserData,
  user,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const [, setIsUIModeUpdating] = useState(false);
  const [, setIsSigningOut] = useState(false);
  const [uiMode, setUIMode] = useState("light");

  useEffect(() => {
    if (uiMode !== user.preferences.ui_mode) {
      setUIMode(user.preferences.ui_mode);
    }
  }, [uiMode, user]);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  // User info
  const {
    first_name: firstName,
    last_name: lastName,
    username,
  } = user;

  const fullName = `${firstName} ${lastName}`;

  const handleUIModeChange = (_uiMode) => {
    setIsUIModeUpdating(true);

    const payload = { ui_mode: _uiMode };

    onSyncCurrentUserData("preferences", payload);

    APIService.User.updateCurrentUserPreferences(payload)
      .then((res) => {
        onSyncCurrentUserData("preferences", res);
        setIsUIModeUpdating(false);
      })
      .catch((err) => {
        console.log(err.message);

        // Set it back to what it was before request.
        onSyncCurrentUserData("preferences", { ui_mode: uiMode });
        setIsUIModeUpdating(false);
      });
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleSignOutClick = () => {
    setIsSigningOut(true);
    onSignOut({
      onError: () => {
        setIsSigningOut(false);
      },
      onSuccess: () => {
        window.location.href = new URL("logout/", `${AppSettings.IDENTITY_BASE_URL}/`).href;
      },
      noDispatchOnSuccess: true,
    });
  };

  const menuId = "primary-search-account-menu";
  const mobileMenuId = "primary-search-account-menu-mobile";

  return (
    <>
      <AppBar
        className="app-app-bar"
        position="fixed"
        sx={{
          // width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { sm: `${DRAWER_WIDTH}px` },
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Container maxWidth={false} sx={{ paddingX: 0 }}>
          <Toolbar className="app-app-toolbar">
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <Link
              color="inherit"
              component={RouterLink}
              to="/"
            >
              <img alt="app-logo" className="app-app-logo" src={AppLogo} />
            </Link>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              <Button
                className={classNames("app-transparent-hover", "app-no-text-transform")}
                size="large"
                edge="end"
                sx={{ maxWidth: "220px", paddingRight: 0 }}
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
                startIcon={<Avatar fullName={fullName} />}
                endIcon={isMenuOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              >
                <Typography noWrap>{fullName}</Typography>
              </Button>
            </Box>
            <Box sx={{ display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <MobileMenu
        anchorEl={mobileMoreAnchorEl}
        menuId={mobileMenuId}
        handleMenuClose={handleMobileMenuClose}
        handleProfileMenuOpen={handleProfileMenuOpen}
        isMenuOpen={isMobileMenuOpen}
      />
      <DesktopMenu
        anchorEl={anchorEl}
        menuId={menuId}
        handleMenuClose={handleMenuClose}
        handleMobileMenuClose={handleMobileMenuClose}
        handleProfileMenuOpen={handleProfileMenuOpen}
        isMenuOpen={isMenuOpen}
        onSignOut={handleSignOutClick}
        onUIModeChange={handleUIModeChange}
        setAnchorEl={setAnchorEl}
        uiMode={uiMode}
        username={username}
      />
    </>
  );
}

export default Header;
