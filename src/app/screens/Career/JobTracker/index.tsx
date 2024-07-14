import {
  AppRegistration as AppRegistrationIcon,
  Cancel as CancelIcon,
  Close as CloseIcon,
  ContactMail as ContactMailIcon,
  Edit as EditIcon,
  Info as InfoIcon,
  LocalOffer as LocalOfferIcon,
} from "@mui/icons-material";
import {
  Box,
  ButtonGroup,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import { GridActionsCellItem, GridColDef, GridRowParams } from "@mui/x-data-grid";
import EmptyCell from "app/components/EmptyCell";
import ModelView from "app/components/ModelView";
import {
  useBulkDeleteJobTrackerMutation,
  useCreateJobTrackerMutation,
  useGetJobTrackerModelConfigQuery,
  useGetJobTrackersQuery,
  useUpdateJobTrackerMutation,
} from "app/services/job-trackers";
import React, { JSX } from "react";
import { Country, ModelInstance } from "types/apiTypes";

const STATUS_COLOR_MAP: {
  [key: string]: "error" | "default" | "primary" | "secondary" | "info" | "success" | "warning"
} = {
  accepted_offer: "success",
  applied: "info",
  draft: "default",
  interviewing: "primary",
  no_response: "secondary",
  offer_stage: "warning",
  rejected_applicant: "error",
  rejected_organization: "error",
};

const STATUS_ICON_MAP: {
  [key: string]: JSX.Element
} = {
  accepted_offer: <AppRegistrationIcon />,
  applied: <AppRegistrationIcon />,
  draft: <EditIcon />,
  interviewing: <ContactMailIcon />,
  no_response: <CloseIcon />,
  offer_stage: <LocalOfferIcon />,
  rejected_applicant: <CancelIcon />,
  rejected_organization: <CancelIcon />,
};

export default function JobTrackerScreen() {
  const { data } = useGetJobTrackerModelConfigQuery();

  const columns: GridColDef<ModelInstance>[] = [
    {
      field: "id",
      filterable: false,
      flex: 1,
      headerName: "ID",
    },
    {
      field: "position_title",
      filterable: false,
      flex: 4,
      headerName: "Position",
    },
    {
      field: "organization_name",
      filterable: false,
      flex: 3,
      headerName: "Organization",
    },
    {
      field: "country",
      filterable: false,
      flex: 2,
      headerName: "Country",
      // eslint-disable-next-line arrow-body-style
      renderCell: (params) => {
        if (!params.value) {
          return <EmptyCell />;
        }

        const value = params.value as Country;

        return (
          <>
            <span className={`fi fi-${value.iso_3166_1_alpha_2_code.toLowerCase()} fis`} />
            <Box component="span" sx={{ ml: 1 }}>
              {value.name}
            </Box>
          </>
        );
      },
    },
    {
      field: "interview_round",
      filterable: false,
      flex: 2,
      headerName: "Interview Round",
      // eslint-disable-next-line arrow-body-style
      renderCell: (params) => {
        if (!params.value) {
          return <EmptyCell />;
        }

        const value = params.value as string;

        return (<span>{value}</span>);
      },
      sortable: false,
    },
    {
      field: "status",
      filterable: false,
      flex: 2,
      headerName: "Status",
      renderCell: (params) => {
        const fieldConfig = data?.fields.find((x) => x.name === "status");
        const displayValue = fieldConfig
          ? ((fieldConfig.choices as string[][]).find((x) => x[0] === params.value) as string[])[1]
          : params.value;

        return (
          <Chip
            color={STATUS_COLOR_MAP[params.value]}
            icon={STATUS_ICON_MAP[params.value]}
            label={displayValue}
          />
        );
      },
    },
    {
      field: "notes",
      filterable: false,
      flex: 1.5,
      headerName: "",
      // eslint-disable-next-line arrow-body-style
      renderCell: (params) => {
        const handleClick = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
          params.api.publishEvent("rowDoubleClick", params.api.getRowParams(params.id), event);
        };

        return (
          <Box
            sx={{
              height: "100%",
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ButtonGroup
              variant="outlined"
            >
              <Tooltip
                arrow
                title={params.value ? (
                  <div style={{ whiteSpace: "pre-line" }}>
                    {params.value}
                  </div>
                ) : null}
              >
                <IconButton>
                  <InfoIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <IconButton onClick={handleClick}>
                <EditIcon fontSize="small" />
              </IconButton>
            </ButtonGroup>
          </Box>
        );
      },
      sortable: false,
    },
  ];

  return (
    <ModelView
      bulkDeleteMutation={useBulkDeleteJobTrackerMutation}
      columns={columns}
      createMutation={useCreateJobTrackerMutation}
      getListQuery={useGetJobTrackersQuery}
      getModelConfigQuery={useGetJobTrackerModelConfigQuery}
      updateMutation={useUpdateJobTrackerMutation}
    />
  );
}
