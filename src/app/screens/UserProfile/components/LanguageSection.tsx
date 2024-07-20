import {
  Chip,
  Grid,
  useTheme,
} from "@mui/material";
import {
  useBulkDeleteLanguageMutation,
  useCreateLanguageMutation,
  useGetLanguageModelConfigQuery,
  useGetLanguagesQuery,
  useUpdateLanguageMutation,
} from "app/services/user-profiles";
import React from "react";

import ProfileSectionModelView from "./ProfileSectionModelView";

interface LanguageSectionProps {
  isEditable: boolean;
}

export default function LanguageSection({
  isEditable,
}: LanguageSectionProps) {
  const theme = useTheme();

  return (
    <ProfileSectionModelView
      bulkDeleteMutation={useBulkDeleteLanguageMutation}
      createMutation={useCreateLanguageMutation}
      getListQuery={useGetLanguagesQuery}
      getModelConfigQuery={useGetLanguageModelConfigQuery}
      isEditable={isEditable}
      renderList={({
        data,
        onEdit,
        onRemove,
      }) => (
        <Grid container spacing={3}>
          {data?.results.map((record) => (
            <Chip
              key={record.id as number}
              label={record.name as string}
              onClick={() => {
                onEdit(record);
              }}
              sx={{
                marginLeft: theme.spacing(1),
                marginRight: theme.spacing(1),
              }}
              onDelete={() => {
                onRemove(record.id as number);
              }}
            />
          ))}
        </Grid>
      )}
      updateMutation={useUpdateLanguageMutation}
    />
  );
}
