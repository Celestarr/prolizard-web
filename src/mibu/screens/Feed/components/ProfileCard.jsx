import {
  Avatar,
  Box,
  Paper,
  Typography,
} from "@mui/material";
import DummyAvatarImage from "mibu/images/dummy-avatar.png";
import React from "react";

const ProfileCard = ({
  user,
}) => {
  // User info
  const {
    first_name: firstName,
    headline,
    last_name: lastName,
  } = user;
  const fullName = `${firstName} ${lastName}`;

  return (
    <Paper>
      <Box>
        <Avatar src={DummyAvatarImage} />
        <Typography variant="h6">
          {fullName}
        </Typography>

        {headline && (
          <Typography variant="body2">{headline}</Typography>
        )}
      </Box>
    </Paper>
  );
};

export default ProfileCard;
