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
import {
  GridColDef,
  GridRowParams,
  GridRowSelectionModel,
  GridSortModel,
} from "@mui/x-data-grid";
import { TypedUseMutation, TypedUseQuery } from "@reduxjs/toolkit/query/react";
import GlobalSpinner from "app/components/GlobalSpinner";
import { currentUserSelector } from "app/reducers/selectors";
import {
  BulkDeleteResponse,
  ModelConfig,
  ModelInstance,
  PaginatedRequestQuery,
  PaginatedResponse,
} from "app/services/api";
import {
  useGetUserProfileByIdQuery,
} from "app/services/user-profiles";
import { debounce } from "lodash";
import React, {
  ChangeEvent, useCallback, useEffect, useState,
} from "react";
import { Helmet } from "react-helmet-async";
import { useSelector } from "react-redux";

import DataTable from "./components/DataTable";
import EditFormDialog from "./components/EditFormDialog";
import RemoveConfirmationDialog from "./components/RemoveConfirmationDialog";

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

interface ModelViewProps {
  bulkDeleteMutation: TypedUseMutation<BulkDeleteResponse, number[], any>;
  columns: GridColDef<ModelInstance>[];
  createMutation: TypedUseMutation<ModelInstance, Partial<ModelInstance>, any>;
  getListQuery: TypedUseQuery<PaginatedResponse<ModelInstance>, PaginatedRequestQuery, any>;
  getModelConfigQuery: TypedUseQuery<ModelConfig, void, any>;
  updateMutation: TypedUseMutation<ModelInstance, Partial<ModelInstance>, any>;
}

export default function ModelView({
  bulkDeleteMutation,
  columns,
  createMutation,
  getListQuery,
  getModelConfigQuery,
  updateMutation,
}: ModelViewProps) {
  const [bulkDelete] = bulkDeleteMutation();
  const { data: user, isLoading: isUserLoading } = useGetUserProfileByIdQuery("me");
  const [dialogInfo, setDialogInfo] = useState<{
    selectedRow: ModelInstance | null;
    isFormDialogOpen: boolean;
  }>({
    selectedRow: null,
    isFormDialogOpen: false,
  });
  const {
    data: modelConfig,
  } = getModelConfigQuery();
  const [isRemoveConfirmationDialogOpen, setIsRemoveConfirmationDialogOpen] = useState(false);
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>([]);
  const [searchInputValue, setSearchInputValue] = useState<string | undefined>("");
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const {
    data,
    isFetching,
    isLoading,
  } = getListQuery({
    page: paginationModel.page,
    pageSize: paginationModel.pageSize,
    query: searchInputValue,
    sortModel,
  });

  const debouncedSearchQuerySet = useCallback(
    debounce((value: string) => {
      if (value.length) {
        setSearchInputValue(value);
      } else {
        setSearchInputValue(undefined);
      }
    }, 500),
    [],
  );

  const handleSearchInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    // setSearchInputValue(newValue);
    debouncedSearchQuerySet(newValue);
  };

  const handleBulkDelete = () => bulkDelete(selectionModel.map((x) => x as number));

  const openRemoveConfirmationDialog = () => {
    setIsRemoveConfirmationDialogOpen(true);
  };

  const closeRemoveConfirmationDialog = () => {
    setIsRemoveConfirmationDialogOpen(false);
  };

  const handleSelectionModelChange = (newSelectionModel: GridRowSelectionModel) => {
    setSelectionModel(newSelectionModel);
  };

  const handleSortModelChange = (newSortModel: GridSortModel) => {
    setSortModel(newSortModel);
  };

  const closeFormDialog = () => {
    setDialogInfo({
      isFormDialogOpen: false,
      selectedRow: null,
    });
  };

  const handleRowDoubleClick = (params: GridRowParams) => {
    setDialogInfo({
      isFormDialogOpen: true,
      selectedRow: params.row as ModelInstance,
    });
  };

  const handleNewClick = () => {
    setDialogInfo({
      isFormDialogOpen: true,
      selectedRow: null,
    });
  };

  if (isLoading || isUserLoading) {
    return <GlobalSpinner />;
  }

  if (!modelConfig) {
    return null;
  }

  return (
    <Grid
      container
      spacing={3}
    >
      <Helmet title={modelConfig.verbose_name} />

      <EditFormDialog
        createModelInstance={createMutation}
        getModelConfig={getModelConfigQuery}
        instanceValues={dialogInfo.selectedRow}
        isOpen={dialogInfo.isFormDialogOpen}
        onClose={closeFormDialog}
        updateModelInstance={updateMutation}
      />

      <RemoveConfirmationDialog
        isOpen={isRemoveConfirmationDialogOpen}
        modelName={modelConfig.verbose_name}
        onClose={closeRemoveConfirmationDialog}
        onConfirm={handleBulkDelete}
        selectedCount={selectionModel.length}
      />

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
                {modelConfig.verbose_name}
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
                      inputProps={{ "aria-label": "search" }}
                      onChange={handleSearchInputChange}
                      placeholder="Search…"
                    />
                  </Search>
                </Grid>
                <Grid item>
                  <Button
                    component="label"
                    onClick={handleNewClick}
                    variant="contained"
                    startIcon={<AddIcon />}
                  >
                    New
                  </Button>
                </Grid>
                {selectionModel.length ? (
                  <Grid item>
                    <Button
                      color="error"
                      component="label"
                      onClick={openRemoveConfirmationDialog}
                      variant="contained"
                      startIcon={<DeleteIcon />}
                    >
                      Remove
                      {` (${selectionModel.length})`}
                    </Button>
                  </Grid>
                ) : null}
              </Grid>
            </Grid>
          </Grid>

          <Box sx={{ pt: 4 }}>
            <DataTable
              columns={columns}
              data={data}
              isLoading={isFetching}
              onRowDoubleClick={handleRowDoubleClick}
              onSelectionModelChange={handleSelectionModelChange}
              onSortModelChange={handleSortModelChange}
              paginationModel={paginationModel}
              selectionModel={selectionModel}
              setPaginationModel={setPaginationModel}
            />
          </Box>
        </Container>
      </Grid>
    </Grid>
  );
}
