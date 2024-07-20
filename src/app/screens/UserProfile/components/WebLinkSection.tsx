import {
  Facebook as FacebookIcon,
  GitHub as GitHubIcon,
  Language as LanguageIcon,
  LinkedIn as LinkedInIcon,
  Reddit as RedditIcon,
  Twitter as TwitterIcon,
  YouTube as YouTubeIcon,
} from "@mui/icons-material";
import {
  Timeline,
  TimelineContent,
  TimelineItem,
} from "@mui/lab";
import {
  Avatar,
  Box,
  Button,
  Grid,
  Link,
  Typography,
} from "@mui/material";
import {
  useBulkDeleteWebLinkMutation,
  useCreateWebLinkMutation,
  useGetWebLinkModelConfigQuery,
  useGetWebLinksQuery,
  useUpdateWebLinkMutation,
} from "app/services/user-profiles";
import getWebLinkType from "app/utils/getWebLinkType";
import moment from "moment";
import React, { JSX } from "react";

import ProfileSectionModelView from "./ProfileSectionModelView";

const linkTypeIconMap: {[key: string]: any} = {
  facebook: FacebookIcon,
  github: GitHubIcon,
  linkedin: LinkedInIcon,
  reddit: RedditIcon,
  twitter: TwitterIcon,
  youtube: YouTubeIcon,
};

const getLinkIconComponent = (link: string) => (linkTypeIconMap[getWebLinkType(link) as string] || LanguageIcon);

interface WebLinkSectionProps {
  isEditable: boolean;
}

export default function WebLinkSection({
  isEditable,
}: WebLinkSectionProps) {
  return (
    <ProfileSectionModelView
      bulkDeleteMutation={useBulkDeleteWebLinkMutation}
      createMutation={useCreateWebLinkMutation}
      getListQuery={useGetWebLinksQuery}
      getModelConfigQuery={useGetWebLinkModelConfigQuery}
      isEditable={isEditable}
      renderList={({
        data,
        onEdit,
        onRemove,
      }) => (
        <Timeline>
          {data?.results.map((record) => {
            const IconComponent = getLinkIconComponent(record.href as string);

            return (
              <TimelineItem
                key={record.id as number}
              >
                <TimelineContent>
                  <Box
                    alignItems="center"
                    display="flex"
                    flexDirection="row"
                  >
                    <IconComponent />
                    <Link
                      href={record.href as string}
                      target="_blank"
                    >
                      {(record.label || record.href) as string}
                    </Link>
                    {isEditable && (
                      <Box ml="auto">
                        <Button
                          onClick={() => {
                            onEdit(record);
                          }}
                        >
                          Remove
                        </Button>
                        <Button
                          onClick={() => {
                            onRemove(record.id as number);
                          }}
                        >
                          Edit
                        </Button>
                      </Box>
                    )}
                  </Box>
                </TimelineContent>
              </TimelineItem>
            );
          })}
        </Timeline>
      )}
      updateMutation={useUpdateWebLinkMutation}
    />
  );
}
