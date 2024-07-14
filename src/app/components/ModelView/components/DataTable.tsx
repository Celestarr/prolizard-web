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
import React, { useState } from "react";
import { ModelInstance, PaginatedResponse } from "types/apiTypes";

interface DataTableProps {
  columns: GridColDef<ModelInstance>[];
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
}

export default function DataTable({
  columns,
  data,
  isLoading,
  onRowDoubleClick,
  onSelectionModelChange,
  onSortModelChange,
  paginationModel,
  selectionModel,
  setPaginationModel,
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
        onCellClick={(params, event) => {
          if (params.field === "notes") {
            // eslint-disable-next-line no-param-reassign
            event.stopPropagation();
            console.log("here");
          }
        }}
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
