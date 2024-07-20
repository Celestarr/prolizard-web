import {
  School as SchoolIcon,
  Work as WorkIcon,
} from "@mui/icons-material";
import {
  Avatar,
  Button,
  Chip,
  Grid,
  Link,
  Typography,
} from "@mui/material";
import {
  useBulkDeletePublicationMutation,
  useBulkDeleteSkillMutation,
  useCreatePublicationMutation,
  useCreateSkillMutation,
  useGetPublicationModelConfigQuery,
  useGetPublicationsQuery,
  useGetSkillModelConfigQuery,
  useGetSkillsQuery,
  useUpdateCertificationMutation,
  useUpdatePublicationMutation,
  useUpdateSkillMutation,
} from "app/services/user-profiles";
import moment from "moment";
import React from "react";

import ProfileSectionModelView from "./ProfileSectionModelView";

interface SkillSectionProps {
  isEditable: boolean;
}

export default function SkillSection({
  isEditable,
}: SkillSectionProps) {
  return (
    <ProfileSectionModelView
      bulkDeleteMutation={useBulkDeleteSkillMutation}
      createMutation={useCreateSkillMutation}
      getListQuery={useGetSkillsQuery}
      getModelConfigQuery={useGetSkillModelConfigQuery}
      isEditable={isEditable}
      renderList={({
        data,
        onEdit,
        onRemove,
      }) => (
        <Grid container spacing={3}>
          {data?.results.map((record) => (
            <Grid key={record.id as number} item>
              <Chip
                label={record.name as string}
                onClick={() => {
                  onEdit(record);
                }}
                onDelete={() => {
                  onRemove(record.id as number);
                }}
              />
            </Grid>
          ))}
        </Grid>
      )}
      updateMutation={useUpdateSkillMutation}
    />
  );
}
