import {
  School as SchoolIcon,
  Work as WorkIcon,
} from "@mui/icons-material";
import {
  Avatar,
  Button,
  Grid,
  Typography,
} from "@mui/material";
import {
  useBulkDeleteAcademicRecordMutation,
  useBulkDeleteHonorMutation,
  useBulkDeleteWorkExperienceMutation,
  useCreateAcademicRecordMutation,
  useCreateHonorMutation,
  useCreateWorkExperienceMutation,
  useGetAcademicRecordModelConfigQuery,
  useGetAcademicRecordsQuery,
  useGetHonorModelConfigQuery,
  useGetHonorsQuery,
  useGetWorkExperienceModelConfigQuery,
  useGetWorkExperiencesQuery,
  useUpdateCertificationMutation,
  useUpdateHonorMutation,
} from "app/services/user-profiles";
import moment from "moment";
import React from "react";

import ProfileSectionModelView from "./ProfileSectionModelView";

interface HonorOrAwardSectionProps {
  isEditable: boolean;
}

export default function HonorOrAwardSection({
  isEditable,
}: HonorOrAwardSectionProps) {
  return (
    <ProfileSectionModelView
      bulkDeleteMutation={useBulkDeleteHonorMutation}
      createMutation={useCreateHonorMutation}
      getListQuery={useGetHonorsQuery}
      getModelConfigQuery={useGetHonorModelConfigQuery}
      isEditable={isEditable}
      renderList={({
        data,
        onEdit,
        onRemove,
      }) => (
        <Grid container spacing={3}>
          {data?.results.map((record) => (
            <Grid
              item
              md={12}
              key={record.id as number}
            >
              <Grid container spacing={2}>
                <Grid item md>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: "bold" }}
                  >
                    {record.title as string}
                  </Typography>
                  <Typography variant="body2">
                    Issued by
                    {" "}
                    {record.issuer as string}
                  </Typography>
                  {record.issue_date && (
                    <Typography variant="caption">
                      {moment(record.issue_date as string).format("MMMM YYYY")}
                    </Typography>
                  )}
                  {record.description && (
                    <Typography
                      variant="body1"
                      sx={{ paddingTop: 2, whiteSpace: "pre-line" }}
                    >
                      {record.description as string}
                    </Typography>
                  )}
                </Grid>
                {isEditable && (
                  <Grid item md="auto">
                    <Grid container spacing={1}>
                      <Grid item md>
                        <Button
                          onClick={() => {
                            onEdit(record);
                          }}
                          size="small"
                          variant="outlined"
                        >
                          Edit
                        </Button>
                      </Grid>
                      <Grid item md>
                        <Button
                          onClick={() => {
                            onRemove(record.id as number);
                          }}
                          size="small"
                          variant="outlined"
                          color="error"
                        >
                          Remove
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                )}
              </Grid>
            </Grid>
          ))}
        </Grid>
      )}
      updateMutation={useUpdateHonorMutation}
    />
  );
}
