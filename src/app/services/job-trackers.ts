import { retry } from "@reduxjs/toolkit/query/react";

import {
  api,
  ModelConfig,
  PaginatedRequestQuery,
  PaginatedResponse,
} from "./api";

export interface JobTracker {
  company_name: string;
  application_date: null | string;
  application_deadline: null | string;
  id: number;
  interview_round: null | string;
  notes: null | string;
  position_title: string;
  status: string;
}

export interface User {
  first_name: string
  last_name: string
  email: string
  phone: string
}

const URL_PATH = "/career/job-trackers";
const TAG = "job-tracker";

export const jobTrackers = api.injectEndpoints({
  endpoints: (build) => ({
    createJobTracker: build.mutation<JobTracker, Partial<JobTracker>>({
      query: (body) => ({
        url: `${URL_PATH}/`,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: TAG, id: "LIST" }],
    }),
    deleteJobTracker: build.mutation<{ success: boolean; id: number }, number>({
      query(id) {
        return {
          url: `${URL_PATH}/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: (item) => [{ type: TAG, id: item?.id }],
    }),
    getJobTracker: build.query<JobTracker, number>({
      query: (id) => `${URL_PATH}/${id}`,
      providesTags: (_item, _err, id) => [{ type: TAG, id }],
    }),
    getJobTrackerModelConfig: build.query<ModelConfig, void>({
      query: () => `${URL_PATH}/model-config`,
      providesTags: (_item, _err) => [{ type: TAG, id: "model-config" }],
    }),
    getJobTrackers: build.query<PaginatedResponse<JobTracker>, PaginatedRequestQuery>({
      query: ({ page, pageSize }) => ({ url: `${URL_PATH}?page=${page + 1}&page_size=${pageSize}` }),
      providesTags: (result) => (typeof result !== "undefined" ? [
        ...result.results.map(({ id }) => ({ type: TAG, id }) as const),
        { type: TAG, id: "LIST" },
      ] : []),
    }),
    updateJobTracker: build.mutation<JobTracker, Partial<JobTracker>>({
      query(data) {
        const { id, ...body } = data;
        return {
          url: `${URL_PATH}/${id}/`,
          method: "PATCH",
          body,
        };
      },
      invalidatesTags: (item) => [{ type: TAG, id: item?.id }],
    }),
  }),
});

export const {
  useCreateJobTrackerMutation,
  useGetJobTrackerModelConfigQuery,
  useGetJobTrackersQuery,
  useUpdateJobTrackerMutation,
} = jobTrackers;

// export const {
//   endpoints: { retrieveAll },
// } = jobTrackers;
