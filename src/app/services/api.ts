import { GridSortModel } from "@mui/x-data-grid";
import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";
import AppSettings from "app/settings";
import { RootState } from "app/store";
import { User } from "oidc-client-ts";

export interface FormFieldConfig {
  choices?: string[][];
  help_text?: string;
  max_length?: number; // for string
  min_length?: number; // for string
  max_value?: number; // for string
  min_value?: number; // for numbers
  name: string;
  regex?: string;
  required: boolean;
  type: "date" | "datetime" | "email" | "integer" | "string" | "text";
  verbose_name: string;
}

export interface FormLayoutConfig {
  fields: string[];
  row: number;
  sizes: number[];
}

export interface ModelConfig {
  fields: FormFieldConfig[];
  layout: FormLayoutConfig[];
  name: string;
  verbose_name: string;
}

export interface BulkDeleteResponse {
  count?: number;
  message: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: null | string;
  previous: null | string;
  results: T[];
}

export interface PaginatedRequestQuery {
  page: number;
  pageSize: number;
  query?: string;
  sortModel?: GridSortModel;
}

export type ModelInstanceFieldValue = null | number | string;

export interface ModelInstance {
  [key: string]: ModelInstanceFieldValue | ModelInstance;
}

export function transformSortModelToQueryString(sortModel: GridSortModel | undefined): string {
  if (!sortModel || sortModel.length === 0) {
    return "";
  }

  const orderingParams = sortModel.map((sort) => {
    const prefix = sort.sort === "desc" ? "-" : "";
    return `${prefix}${sort.field}`;
  });

  return `&ordering=${orderingParams.join(",")}`;
}

function getUser() {
  const oidcStorage = localStorage.getItem(`oidc.user:${AppSettings.OAUTH_BASE_URL}:${AppSettings.OAUTH_CLIENT_ID}`);

  if (!oidcStorage) {
    return null;
  }

  return User.fromStorageString(oidcStorage);
}

// Create our baseQuery instance
const baseQuery = fetchBaseQuery({
  baseUrl: AppSettings.API_BASE_URL,
  prepareHeaders: (headers, _) => {
    const user = getUser();

    if (user) {
      headers.set("Authorization", `Bearer ${user.access_token}`);
    }

    return headers;
  },
});

const baseQueryWithRetry = retry(baseQuery, { maxRetries: 2 });

/**
 * Create a base API to inject endpoints into elsewhere.
 * Components using this API should import from the injected site,
 * in order to get the appropriate types,
 * and to ensure that the file injecting the endpoints is loaded
 */
export const api = createApi({
  /**
   * `reducerPath` is optional and will not be required by most users.
   * This is useful if you have multiple API definitions,
   * e.g. where each has a different domain, with no interaction between endpoints.
   * Otherwise, a single API definition should be used in order to support tag invalidation,
   * among other features
   */
  reducerPath: "primaryApi",
  /**
   * A bare bones base query would just be `baseQuery: fetchBaseQuery({ baseUrl: '/' })`
   */
  baseQuery: baseQueryWithRetry,
  /**
   * Tag types must be defined in the original API definition
   * for any tags that would be provided by injected endpoints
   */
  tagTypes: ["job-tracker", "user-profile"],
  /**
   * This api has endpoints injected in adjacent files,
   * which is why no endpoints are shown below.
   * If you want all endpoints defined in the same file, they could be included here instead
   */
  endpoints: () => ({}),
});

export const enhancedApi = api.enhanceEndpoints({
  endpoints: () => ({
    getPost: () => "test",
  }),
});
