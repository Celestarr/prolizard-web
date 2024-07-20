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
  useBulkDeletePublicationMutation,
  useCreatePublicationMutation,
  useGetPublicationModelConfigQuery,
  useGetPublicationsQuery,
  useUpdateCertificationMutation,
  useUpdatePublicationMutation,
} from "app/services/user-profiles";
import moment from "moment";
import React from "react";

import ProfileSectionModelView from "./ProfileSectionModelView";

interface PublicationSectionProps {
  isEditable: boolean;
}

export default function PublicationSection({
  isEditable,
}: PublicationSectionProps) {
  return (
    <ProfileSectionModelView
      bulkDeleteMutation={useBulkDeletePublicationMutation}
      createMutation={useCreatePublicationMutation}
      getListQuery={useGetPublicationsQuery}
      getModelConfigQuery={useGetPublicationModelConfigQuery}
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
              key={record.id as string}
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
                        {record.title as string}
                      </Link>
                    ) : record.title as string}
                  </Typography>
                  <Typography variant="body2">
                    Published by
                    {" "}
                    {record.publisher as string}
                  </Typography>
                  {record.publication_date && (
                    <Typography variant="caption">
                      {moment(record.publication_date as string).format("MMMM YYYY")}
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
      updateMutation={useUpdatePublicationMutation}
    />
  );
}
