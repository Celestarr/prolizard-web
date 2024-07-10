import {
  AppRegistration as AppRegistrationIcon,
  Cancel as CancelIcon,
  Close as CloseIcon,
  ContactMail as ContactMailIcon,
  Edit as EditIcon,
  LocalOffer as LocalOfferIcon,
} from "@mui/icons-material";
import { Chip } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import ModelView from "app/components/ModelView";
import { ModelInstance } from "app/services/api";
import {
  useBulkDeleteJobTrackerMutation,
  useCreateJobTrackerMutation,
  useGetJobTrackerModelConfigQuery,
  useGetJobTrackersQuery,
  useUpdateJobTrackerMutation,
} from "app/services/job-trackers";
import React, { JSX } from "react";

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
      flex: 3,
      headerName: "Position",
    },
    {
      field: "organization_name",
      filterable: false,
      flex: 3,
      headerName: "Organization",
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
