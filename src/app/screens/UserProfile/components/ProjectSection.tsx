import {
  School as SchoolIcon,
  Work as WorkIcon,
} from "@mui/icons-material";
import {
  Avatar,
  Button,
  Grid,
  Link,
  Typography,
} from "@mui/material";
import {
  useBulkDeleteProjectMutation,
  useCreateProjectMutation,
  useGetProjectModelConfigQuery,
  useGetProjectsQuery,
  useUpdateCertificationMutation,
  useUpdateProjectMutation,
} from "app/services/user-profiles";
import moment from "moment";
import React from "react";

import ProfileSectionModelView from "./ProfileSectionModelView";

interface ProjectSectionProps {
  isEditable: boolean;
}

export default function ProjectSection({
  isEditable,
}: ProjectSectionProps) {
  return (
    <ProfileSectionModelView
      bulkDeleteMutation={useBulkDeleteProjectMutation}
      createMutation={useCreateProjectMutation}
      getListQuery={useGetProjectsQuery}
      getModelConfigQuery={useGetProjectModelConfigQuery}
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
                    {record.url ? (
                      <Link
                        color="inherit"
                        href={record.url as string}
                        sx={{ textDecoration: "none" }}
                        target="_blank"
                      >
                        {record.name as string}
                      </Link>
                    ) : record.name as string}
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
      updateMutation={useUpdateProjectMutation}
    />
  );
}
