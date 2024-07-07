/* eslint-disable react/no-array-index-key */

import {
  Add as AddIcon,
  DeleteOutline as DeleteIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Container,
  Grid,
  InputBase,
  Typography,
} from "@mui/material";
import { alpha, styled } from "@mui/material/styles";
import GlobalSpinner from "app/components/GlobalSpinner";
import { currentUserSelector } from "app/reducers/selectors";
import {
  useRetrieveAllQuery as useRetrieveAllJobTrackersQuery,
} from "app/services/job-trackers";
import {
  useRetrieveOneQuery as useRetrieveOneUserProfileQuery,
} from "app/services/user-profiles";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useSelector } from "react-redux";

import DataTable from "./components/DataTable";
// import EditDialog from "./components/EditDialog";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
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
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

export default function JobTrackerScreen() {
  const { data: user, isLoading: isUserLoading } = useRetrieveOneUserProfileQuery("me");
  const [selectedRows, setSelectedRows] = React.useState<number[]>([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(true);
  const [paginationModel, setPaginationModel] = useState({
    page: 1,
    pageSize: 10,
  });
  const { data, isLoading } = useRetrieveAllJobTrackersQuery({
    page: paginationModel.page,
    pageSize: paginationModel.pageSize,
  });

  const closeEditDialog = () => {
    setIsEditDialogOpen(false);
  };

  const reloadPage = () => {};

  if (isLoading || isUserLoading) {
    return <GlobalSpinner />;
  }

  return (
    <Grid
      container
      spacing={3}
    >
      <Helmet title="Job Tracker" />

      {/* <EditDialog
        isOpen={isEditDialogOpen}
        onClose={closeEditDialog}
        onEditSuccess={reloadPage}
      /> */}

      <Grid
        item
        md={12}
      >
        <Container
          sx={{
            py: 4,
          }}
        >
          <Grid container spacing={6}>
            <Grid
              flexGrow={1}
              item
            >
              <Typography variant="h4">
                Job Tracker
              </Typography>
            </Grid>
            <Grid
              item
            >
              <Grid container spacing={2}>
                <Grid item>
                  <Search>
                    <SearchIconWrapper>
                      <SearchIcon />
                    </SearchIconWrapper>
                    <StyledInputBase
                      placeholder="Search…"
                      inputProps={{ "aria-label": "search" }}
                    />
                  </Search>
                </Grid>
                <Grid item>
                  <Button
                    component="label"
                    variant="contained"
                    tabIndex={-1}
                    startIcon={<AddIcon />}
                  >
                    New
                  </Button>
                </Grid>
                {selectedRows.length ? (
                  <Grid item>
                    <Button
                      color="error"
                      component="label"
                      variant="contained"
                      tabIndex={-1}
                      startIcon={<DeleteIcon />}
                    >
                      Remove
                      {` (${selectedRows.length})`}
                    </Button>
                  </Grid>
                ) : null}
              </Grid>
            </Grid>
          </Grid>

          <Box sx={{ pt: 4 }}>
            <DataTable
              data={data}
              isLoading={isLoading}
              paginationModel={paginationModel}
              setPaginationModel={setPaginationModel}
            />
          </Box>
        </Container>
      </Grid>
    </Grid>
  );
}
