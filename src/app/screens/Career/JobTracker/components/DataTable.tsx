/* eslint-disable import/no-extraneous-dependencies */
import {
  CircularProgress,
  Paper,
} from "@mui/material";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import { visuallyHidden } from "@mui/utils";
import { DataGrid, GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import { PaginatedResponse } from "app/services/api";
import { JobTracker } from "app/services/job-trackers";
import * as React from "react";
import { useState } from "react";

// function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
//   if (b[orderBy] < a[orderBy]) {
//     return -1;
//   }
//   if (b[orderBy] > a[orderBy]) {
//     return 1;
//   }
//   return 0;
// }

type Order = "asc" | "desc";

// function getComparator<Key extends keyof any>(
//   order: Order,
//   orderBy: Key,
// ): (
//   a: { [key in Key]: number | string },
//   b: { [key in Key]: number | string },
// ) => number {
//   return order === "desc"
//     ? (a, b) => descendingComparator(a, b, orderBy)
//     : (a, b) => -descendingComparator(a, b, orderBy);
// }

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
// function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
//   const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
//   stabilizedThis.sort((a, b) => {
//     const order = comparator(a[0], b[0]);
//     if (order !== 0) {
//       return order;
//     }
//     return a[1] - b[1];
//   });
//   return stabilizedThis.map((el) => el[0]);
// }

const columns: readonly GridColDef<JobTracker>[] = [
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
  data: PaginatedResponse<JobTracker> | undefined;
  isLoading: boolean;
  // selectedRows: number[];
  // setSelectedRows: (_rows: number[]) => void;
  paginationModel: GridPaginationModel;
  setPaginationModel: React.Dispatch<React.SetStateAction<{
      page: number;
      pageSize: number;
  }>>;
}

export default function DataTable({
  data,
  isLoading,
  // selectedRows,
  // setSelectedRows,
  paginationModel,
  setPaginationModel,
}: DataTableProps) {
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<keyof JobTracker>("id");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  return (
    <Box sx={{ width: "100%" }}>
      <DataGrid
        autoHeight
        rows={data?.results}
        columns={columns}
        paginationModel={paginationModel}
        paginationMode="server"
        rowCount={data?.count}
        loading={isLoading}
        pageSizeOptions={[10, 25, 50, 100]}
        onPaginationModelChange={setPaginationModel}
      />
    </Box>
  );
}
