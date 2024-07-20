import {
  School as SchoolIcon,
} from "@mui/icons-material";
import {
  Avatar,
  Button,
  Grid,
  Typography,
} from "@mui/material";
import {
  useBulkDeleteAcademicRecordMutation,
  useCreateAcademicRecordMutation,
  useGetAcademicRecordModelConfigQuery,
  useGetAcademicRecordsQuery,
  useUpdateAcademicRecordMutation,
  useUpdateCertificationMutation,
} from "app/services/user-profiles";
import moment from "moment";
import React from "react";

import ProfileSectionModelView from "./ProfileSectionModelView";

interface AcademicRecordSectionProps {
  isEditable: boolean;
}

export default function AcademicRecordSection({
  isEditable,
}: AcademicRecordSectionProps) {
  return (
    <ProfileSectionModelView
      bulkDeleteMutation={useBulkDeleteAcademicRecordMutation}
      createMutation={useCreateAcademicRecordMutation}
      getListQuery={useGetAcademicRecordsQuery}
      getModelConfigQuery={useGetAcademicRecordModelConfigQuery}
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
                <Grid item md={1}>
                  <Avatar>
                    <SchoolIcon />
                  </Avatar>
                </Grid>
                <Grid item md>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: "bold" }}
                  >
                    {record.school as string}
                  </Typography>
                  <Typography variant="body2">
                    {record.degree as string}
                    {record.field_of_study ? (
                      <>
                        {", "}
                        {record.field_of_study}
                      </>
                    ) : null}
                  </Typography>
                  <Typography variant="caption">
                    {moment(record.start_date as string).format("MMMM YYYY")}
                    {" — "}
                    {record.end_date ? moment(record.end_date as string).format("MMMM YYYY") : "Present"}
                    {" ("}
                    {(record.end_date
                      ? moment(record.start_date as string).from(record.end_date as string, true)
                      : moment(record.start_date as string).fromNow(true)
                    )}
                    )
                  </Typography>
                  {!!record.description && (
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
      updateMutation={useUpdateAcademicRecordMutation}
    />
  );
}
