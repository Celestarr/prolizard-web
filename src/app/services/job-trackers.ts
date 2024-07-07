import { retry } from "@reduxjs/toolkit/query/react";

import { api, PaginatedRequestQuery, PaginatedResponse } from "./api";

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
    retrieveAll: build.query<PaginatedResponse<JobTracker>, PaginatedRequestQuery>({
      query: ({ page, pageSize }) => ({ url: `${URL_PATH}?page=${page}&page_size=${pageSize}` }),
      providesTags: (result) => (typeof result !== "undefined" ? [
        ...result.results.map(({ id }) => ({ type: TAG, id }) as const),
        { type: TAG, id: "LIST" },
      ] : []),
    }),
    createOne: build.mutation<JobTracker, Partial<JobTracker>>({
      query: (body) => ({
        url: `${URL_PATH}/`,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: TAG, id: "LIST" }],
    }),
    retrieveOne: build.query<JobTracker, number>({
      query: (id) => `${URL_PATH}/${id}`,
      providesTags: (_post, _err, id) => [{ type: TAG, id }],
    }),
    updateOne: build.mutation<JobTracker, Partial<JobTracker>>({
      query(data) {
        const { id, ...body } = data;
        return {
          url: `${URL_PATH}/${id}`,
          method: "PUT",
          body,
        };
      },
      invalidatesTags: (post) => [{ type: TAG, id: post?.id }],
    }),
    deleteOne: build.mutation<{ success: boolean; id: number }, number>({
      query(id) {
        return {
          url: `${URL_PATH}/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: (post) => [{ type: TAG, id: post?.id }],
    }),
  }),
});

export const {
  useRetrieveAllQuery,
} = jobTrackers;

export const {
  endpoints: { retrieveAll },
} = jobTrackers;
