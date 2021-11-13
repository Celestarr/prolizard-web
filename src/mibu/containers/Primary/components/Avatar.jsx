/* eslint-disable react/jsx-props-no-spreading */

import MuiAvatar from "@mui/material/Avatar";
import { styled } from "@mui/material/styles";
import generateAvatarPropsFromFullName from "mibu/utils/generateAvatarPropsFromFullName";
import React from "react";

const AppBarAvatar = styled(MuiAvatar)(() => ({
  height: 30,
  width: 30,
}));

export default function Avatar({ fullName, profilePhotoUrl }) {
  if (!profilePhotoUrl) {
    return (
      <AppBarAvatar
        className="mibu-app-bar-avatar"
        {...generateAvatarPropsFromFullName(fullName)}
      />
    );
  }
  return (
    <AppBarAvatar
      alt={fullName}
      className="mibu-app-bar-avatar"
      src={profilePhotoUrl}
    />
  );
}
