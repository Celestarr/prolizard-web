import {
  CircularProgress,
  Paper,
} from "@mui/material";
import Box from "@mui/material/Box";
import {
  DataGrid,
  GridColDef,
  GridPaginationModel,
  GridRowParams,
  GridRowSelectionModel,
  GridSortModel,
} from "@mui/x-data-grid";
import { ModelInstance, PaginatedResponse } from "app/services/api";
import React, { useState } from "react";

const columns: readonly GridColDef<ModelInstance>[] = [
  {
    field: "id",
    flex: 1,
    headerName: "ID",
    minWidth: 30,
  },
  {
    field: "position_title",
    flex: 2,
    headerName: "Position",
    minWidth: 60,
  },
  {
    field: "company_name",
    flex: 2,
    headerName: "Company",
    minWidth: 70,
  },
  {
    field: "status",
    flex: 1,
    headerName: "Status",
    minWidth: 60,
  },
];

interface DataTableProps {
  data: PaginatedResponse<ModelInstance> | undefined;
  isLoading: boolean;
  onRowDoubleClick: (params: GridRowParams) => void;
  onSelectionModelChange: (_model: GridRowSelectionModel) => void;
  onSortModelChange: (_model: GridSortModel) => void;
  paginationModel: GridPaginationModel;
  selectionModel: GridRowSelectionModel;
  setPaginationModel: React.Dispatch<React.SetStateAction<{
      page: number;
      pageSize: number;
  }>>;
  // sortModel: GridSortModel;
}

export default function DataTable({
  data,
  isLoading,
  onRowDoubleClick,
  onSelectionModelChange,
  onSortModelChange,
  paginationModel,
  selectionModel,
  setPaginationModel,
  // sortModel,
}: DataTableProps) {
  return (
    <Box sx={{ width: "100%" }}>
      <DataGrid
        autoHeight
        checkboxSelection
        columns={columns}
        getRowId={(row) => row.id as number}
        loading={isLoading}
        onPaginationModelChange={setPaginationModel}
        onRowDoubleClick={onRowDoubleClick}
        onRowSelectionModelChange={onSelectionModelChange}
        onSortModelChange={onSortModelChange}
        pageSizeOptions={[10, 25, 50, 100]}
        paginationMode="server"
        paginationModel={paginationModel}
        rowCount={data?.count}
        rows={data?.results}
        rowSelectionModel={selectionModel}
        sortingMode="server"
      />
    </Box>
  );
}
