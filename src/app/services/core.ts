import { retry } from "@reduxjs/toolkit/query/react";

import {
  api,
  BulkDeleteResponse,
  CountryChoice,
  ModelConfig,
  ModelInstance,
  PaginatedRequestQuery,
  PaginatedResponse,
  transformSortModelToQueryString,
} from "./api";

const URL_PATH = "";
const TAG = "core";

export const core = api.injectEndpoints({
  endpoints: (build) => ({
    getCountryChoices: build.query<PaginatedResponse<CountryChoice>, void>({
      query: () => `${URL_PATH}/countries`,
      providesTags: (_res, _err) => [{ type: TAG, id: "COUNTRY_CHOICE_LIST" }],
    }),
  }),
});

export const {
  useGetCountryChoicesQuery,
} = core;
