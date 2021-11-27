import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import MoreIcon from "@mui/icons-material/MoreVert";
import SearchIcon from "@mui/icons-material/Search";
import { Button } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import Link from "@mui/material/Link";
import { alpha, styled } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import classNames from "classnames";
import AppLogo from "mibu/images/myfolab-icon-310x310.png";
import APIService from "mibu/services/api";
import React, { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";

import Avatar from "./Avatar";
import { DesktopMenu, MobileMenu } from "./Menus";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

const Header = ({
  onSignOut,
  onSyncCurrentUserData,
  user,
}) => {
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
    });
  };

  const menuId = "primary-search-account-menu";
  const mobileMenuId = "primary-search-account-menu-mobile";

  return (
    <>
      <AppBar className="mibu-app-bar" position="fixed">
        <Container sx={{ paddingX: 0 }}>
          <Toolbar className="mibu-app-toolbar">
            <Link
              color="inherit"
              component={RouterLink}
              to="/"
            >
              <img alt="app-logo" className="mibu-app-logo" src={AppLogo} />
            </Link>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search"
                inputProps={{ "aria-label": "search" }}
              />
            </Search>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              <Button
                className={classNames("mibu-transparent-hover", "mibu-no-text-transform")}
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
};

export default Header;
