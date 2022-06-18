/* eslint-disable react/jsx-props-no-spreading */

import MuiAvatar from "@mui/material/Avatar";
import { styled } from "@mui/material/styles";
import generateAvatarPropsFromFullName from "busan/utils/generateAvatarPropsFromFullName";
import React from "react";

const AppBarAvatar = styled(MuiAvatar)(() => ({
  height: 30,
  width: 30,
}));

export default function Avatar({ fullName, profilePhotoUrl }) {
  if (!profilePhotoUrl) {
    return (
      <AppBarAvatar
        className="busan-app-bar-avatar"
        {...generateAvatarPropsFromFullName(fullName)}
      />
    );
  }
  return (
    <AppBarAvatar
      alt={fullName}
      className="busan-app-bar-avatar"
      src={profilePhotoUrl}
    />
  );
}
