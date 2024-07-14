import {
  Country,
  PaginatedResponse,
} from "types/apiTypes";

import {
  api,
  transformSortModelToQueryString,
} from "./api";

const URL_PATH = "";
const TAG = "core";

export const core = api.injectEndpoints({
  endpoints: (build) => ({
    getCountryChoices: build.query<PaginatedResponse<Country>, void>({
      query: () => `${URL_PATH}/countries`,
      providesTags: (_res, _err) => [{ type: TAG, id: "COUNTRY_CHOICE_LIST" }],
    }),
  }),
});

export const {
  useGetCountryChoicesQuery,
} = core;
