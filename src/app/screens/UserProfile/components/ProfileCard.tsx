import {
  Avatar,
  Button,
  Container,
  Divider,
  Grid,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import EditFormDialog from "app/components/ModelView/components/EditFormDialog";
import DummyAvatarImage from "app/images/dummy-avatar.png";
import {
  useGetUserProfileModelConfigQuery,
  useUpdateUserProfileMutation,
} from "app/services/user-profiles";
import cssImportantSuffixer from "app/utils/cssImportantSuffixer";
import getHighestEducationObject from "app/utils/getHighestEducationObject";
import getPreviousExperienceObject from "app/utils/getPreviousExperienceObject";
import makeLocationString from "app/utils/makeLocationString";
import makeUserHeadline from "app/utils/makeUserHeadline";
import moment, { Moment } from "moment";
import React, {
  useEffect,
  useState,
} from "react";
import {
  AcademicRecord,
  ModelInstance,
  UserProfile,
  WorkExperience,
} from "types/apiTypes";

interface ProfileCardProps {
  editOnMount: boolean;
  isEditable: boolean;
  user: UserProfile;
}

export default function ProfileCard({
  editOnMount,
  isEditable,
  user,
}: ProfileCardProps) {
  const [userFullName, setUserFullName] = useState<null | string>(null);
  const [userLocation, setUserLocation] = useState<null | string>(null);
  const [username, setUserUsername] = useState<null | string>(null);
  const [userHeadline, setUserHeadline] = useState<null | string>(null);
  const [userPreviousExperience, setUserPreviousExperience] = useState<null | WorkExperience>(null);
  const [userEducationHighlight, setUserEducationHighlight] = useState<null | AcademicRecord>(null);
  const [, setUserAbout] = useState<null | string>(null);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [dialogInfo, setDialogInfo] = useState<{
    selectedRow: ModelInstance | null;
    isFormDialogOpen: boolean;
  }>({
    selectedRow: null,
    isFormDialogOpen: false,
  });

  useEffect(() => {
    setUserUsername(user.username);
    setUserAbout(user.about);
    setUserFullName(`${user.first_name} ${user.last_name}`);
    setUserLocation(makeLocationString(user.address, user.country ? user.country.name : null));
    setUserHeadline(makeUserHeadline(user));
    setUserPreviousExperience(getPreviousExperienceObject(user.work_experiences));
    setUserEducationHighlight(getHighestEducationObject(user.academic_records));
  }, [user]);

  const handleEditDialogOpen = () => {
    setDialogInfo({
      isFormDialogOpen: true,
      selectedRow: user as unknown as ModelInstance,
    });
  };

  useEffect(() => {
    if (editOnMount) {
      handleEditDialogOpen();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const closeFormDialog = () => {
    setDialogInfo({
      isFormDialogOpen: false,
      selectedRow: null,
    });
  };

  return (
    <>
      <Grid
        item
        md={12}
        sx={{
          backgroundColor: theme.palette.primary[theme.palette.mode],
          paddingTop: cssImportantSuffixer(theme.spacing(12)),
        }}
      >
        <Container
          sx={{
            paddingBottom: 4,
            paddingTop: 6,
            position: "relative",
          }}
        >
          <Avatar
            src={DummyAvatarImage}
            sx={{
              border: 4,
              borderColor: theme.palette.background.default,
              bottom: theme.spacing(-6.25),
              width: theme.spacing(22),
              height: theme.spacing(22),
              position: "absolute",
              zIndex: 1,
            }}
            variant="rounded"
          />
          <Grid container sx={{ paddingLeft: 25 }}>
            <Grid
              item
              md={4}
              sx={{
                color: theme.palette.primary.contrastText,
              }}
            >
              <Typography variant="h6" component="div">
                {userFullName}
              </Typography>

              {userHeadline && (
                <Typography variant="body1" component="div">
                  {userHeadline}
                </Typography>
              )}

              {userLocation && (
                <Typography variant="subtitle2" component="div">
                  {userLocation}
                </Typography>
              )}
            </Grid>
            <Grid item md={8}>
              <Paper sx={{ paddingX: 2, paddingY: 1 }}>
                <Grid container>
                  <Grid item md={5}>
                    <Typography variant="subtitle2" component="div" color="primary">
                      Previous
                    </Typography>
                    <Typography variant="body1" component="div">
                      {userPreviousExperience && (
                        `${userPreviousExperience.job_title} at ${userPreviousExperience.company}`
                      )}
                      {!userPreviousExperience && "-"}
                    </Typography>
                  </Grid>
                  <Grid
                    alignItems="center"
                    container
                    item
                    justifyContent="center"
                    md={2}
                    spacing={0}
                  >
                    <Divider
                      orientation="vertical"
                      sx={{
                        borderColor: theme.palette.primary[theme.palette.mode],
                        borderWidth: 1,
                        height: "60%",
                      }}
                    />
                  </Grid>
                  <Grid item md={5}>
                    <Typography variant="subtitle2" component="div" color="primary">
                      Education
                    </Typography>
                    <Typography variant="body1" component="div">
                      {userEducationHighlight && (
                        `${userEducationHighlight.degree} from ${userEducationHighlight.school}`
                      )}
                      {!userEducationHighlight && "-"}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Grid>
      <Grid
        item
        md={12}
        sx={{
          backgroundColor: theme.palette.background.paper,
          boxShadow: theme.shadows[1],
          paddingTop: cssImportantSuffixer("0px"),
        }}
      >
        <Container
          sx={{
            paddingBottom: 2,
            paddingTop: 2,
          }}
        >
          <Grid
            container
            spacing={2}
            sx={{ paddingLeft: 25 }}
          >
            {isEditable && (
              <Grid item>
                <Button
                  color="primary"
                  onClick={handleEditDialogOpen}
                  variant="contained"
                  size="small"
                >
                  Edit Profile
                </Button>
              </Grid>
            )}
          </Grid>
        </Container>
      </Grid>

      <EditFormDialog
        createMutation={useUpdateUserProfileMutation}
        getModelConfig={useGetUserProfileModelConfigQuery}
        instanceValues={dialogInfo.selectedRow}
        isOpen={dialogInfo.isFormDialogOpen}
        onClose={closeFormDialog}
        updateMutation={useUpdateUserProfileMutation}
      />
    </>
  );
}
