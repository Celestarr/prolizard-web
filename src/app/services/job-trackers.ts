import { retry } from "@reduxjs/toolkit/query/react";

import {
  api,
  ModelConfig,
  ModelInstance,
  PaginatedRequestQuery,
  PaginatedResponse,
  transformSortModelToQueryString,
} from "./api";

const URL_PATH = "/career/job-trackers";
const TAG = "job-tracker";

export const jobTrackers = api.injectEndpoints({
  endpoints: (build) => ({
    bulkDeleteJobTracker: build.mutation<{ success: boolean; id: number }, number[]>({
      query: (ids) => ({
        url: `${URL_PATH}/bulk-delete/`,
        method: "POST",
        body: { ids },
      }),
      invalidatesTags: [{ type: TAG, id: "LIST" }],
    }),
    createJobTracker: build.mutation<ModelInstance, Partial<ModelInstance>>({
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
    getJobTracker: build.query<ModelInstance, number>({
      query: (id) => `${URL_PATH}/${id}`,
      providesTags: (_item, _err, id) => [{ type: TAG, id }],
    }),
    getJobTrackerModelConfig: build.query<ModelConfig, void>({
      query: () => `${URL_PATH}/model-config`,
      providesTags: (_item, _err) => [{ type: TAG, id: "model-config" }],
    }),
    getJobTrackers: build.query<PaginatedResponse<ModelInstance>, PaginatedRequestQuery>({
      query: ({ page, pageSize, sortModel }) => ({
        url: `${URL_PATH}?page=${page + 1}&page_size=${pageSize}&${transformSortModelToQueryString(sortModel)}`,
      }),
      providesTags: (result) => (typeof result !== "undefined" ? [
        ...result.results.map(({ id }) => ({ type: TAG, id: id as number }) as const),
        { type: TAG, id: "LIST" },
      ] : []),
    }),
    updateJobTracker: build.mutation<ModelInstance, Partial<ModelInstance>>({
      query(data) {
        const { id, ...body } = data;
        return {
          url: `${URL_PATH}/${id}/`,
          method: "PATCH",
          body,
        };
      },
      invalidatesTags: (item) => [{ type: TAG, id: item?.id as number }],
    }),
  }),
});

export const {
  useBulkDeleteJobTrackerMutation,
  useCreateJobTrackerMutation,
  useGetJobTrackerModelConfigQuery,
  useGetJobTrackersQuery,
  useUpdateJobTrackerMutation,
} = jobTrackers;

// export const {
//   endpoints: { retrieveAll },
// } = jobTrackers;
