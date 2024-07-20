import {
  BulkDeleteResponse,
  ModelConfig,
  ModelInstance,
  PaginatedRequestQuery,
  PaginatedResponse,
} from "types/apiTypes";

import {
  api,
  transformSortModelToQueryString,
} from "./api";

const URL_PATH = "/rm";
const TAG = "reference-management";

export const referenceManagementApi = api.injectEndpoints({
  endpoints: (build) => ({
    searchArticles: build.query<PaginatedResponse<ModelInstance>, Partial<PaginatedRequestQuery>>({
      query: ({
        page,
        query,
        sortModel,
      }) => ({
        url: (
          `${URL_PATH}/articles/search?page=${page as number + 1}`
          + `${transformSortModelToQueryString(sortModel)}`
          + `${query ? `&query=${query}` : ""}`
        ),
      }),
      providesTags: (result) => (typeof result !== "undefined" ? [
        ...result.results.map(({ id }) => ({ type: TAG, id: id as string }) as const),
        { type: TAG, id: "LIST" },
      ] : []),
    }),
  }),
});

export const {
  useLazySearchArticlesQuery,
} = referenceManagementApi;
