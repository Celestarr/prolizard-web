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
  useTheme,
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
import EditFormDialog from "app/components/ModelView/components/EditFormDialog";
import RemoveConfirmationDialog from "app/components/ModelView/components/RemoveConfirmationDialog";
import { currentUserSelector } from "app/reducers/selectors";
import {
  useGetUserProfileByIdQuery,
} from "app/services/user-profiles";
import { debounce } from "lodash";
import React, {
  ChangeEvent,
  JSX,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Helmet } from "react-helmet-async";
import { useSelector } from "react-redux";
import {
  BulkDeleteResponse,
  ModelConfig,
  ModelInstance,
  PaginatedRequestQuery,
  PaginatedResponse,
} from "types/apiTypes";

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

interface ProfileSectionModelViewProps {
  bulkDeleteMutation: TypedUseMutation<BulkDeleteResponse, number[], any>;
  createMutation: TypedUseMutation<ModelInstance, Partial<ModelInstance>, any>;
  getListQuery: TypedUseQuery<PaginatedResponse<ModelInstance>, PaginatedRequestQuery, any>;
  getModelConfigQuery: TypedUseQuery<ModelConfig, void, any>;
  isEditable: boolean;
  renderList: ({
    data,
    onEdit,
    onRemove,
  }: {
    data: PaginatedResponse<ModelInstance> | undefined;
    onEdit: (_instance: ModelInstance) => void;
    onRemove: (_instanceId: number) => void;
  }) => JSX.Element;
  updateMutation: TypedUseMutation<ModelInstance, Partial<ModelInstance>, any>;
}

export default function ProfileSectionModelView({
  bulkDeleteMutation,
  createMutation,
  getListQuery,
  getModelConfigQuery,
  isEditable,
  renderList,
  updateMutation,
}: ProfileSectionModelViewProps) {
  const theme = useTheme();
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
  const {
    data,
    isFetching,
    isLoading,
  } = getListQuery({
    page: 0,
    pageSize: 0,
    sortModel,
  });

  const handleBulkDelete = () => bulkDelete(selectionModel.map((x) => x as number));

  const openRemoveConfirmationDialog = (instanceId: number) => {
    setSelectionModel([instanceId]);
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

  const handleEditClick = (instance: ModelInstance) => {
    setDialogInfo({
      isFormDialogOpen: true,
      selectedRow: instance,
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
      <EditFormDialog
        createMutation={createMutation}
        getModelConfig={getModelConfigQuery}
        instanceValues={dialogInfo.selectedRow}
        isOpen={dialogInfo.isFormDialogOpen}
        onClose={closeFormDialog}
        updateMutation={updateMutation}
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
        <Box
          alignItems="center"
          display="flex"
          flexDirection="row"
          flexWrap="nowrap"
          sx={{ paddingBottom: 3 }}
        >
          <Box
            flexGrow={1}
          >
            <Typography color={theme.palette.primary.main} variant="h6">
              {modelConfig.verbose_name}
            </Typography>
          </Box>
          {isEditable && (
            <Box>
              <Button
                color="primary"
                variant="contained"
                size="small"
                onClick={handleNewClick}
              >
                Add
              </Button>
            </Box>
          )}
        </Box>
        {(data?.results.length === 0) ? (
          <Typography color="textSecondary" variant="body1">
            Nothing to show.
          </Typography>
        ) : (
          renderList({
            data,
            onEdit: handleEditClick,
            onRemove: openRemoveConfirmationDialog,
          })
        )}
      </Grid>
    </Grid>
  );
}
