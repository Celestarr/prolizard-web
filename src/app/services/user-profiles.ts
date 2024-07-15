import {
  BulkDeleteResponse,
  ModelConfig,
  ModelInstance,
  PaginatedRequestQuery,
  PaginatedResponse,
  UserProfile,
} from "types/apiTypes";

import {
  api,
  transformSortModelToQueryString,
} from "./api";

const URL_PATH = "/profile";
const TAG = "user-profile";

export const userProfilesApi = api.injectEndpoints({
  endpoints: (build) => ({
    getUserProfileById: build.query<UserProfile, number | string>({
      query: (id) => `${URL_PATH}/${id}`,
      providesTags: (_item, _err, id) => [{ type: TAG, id }],
    }),
    updatePreferences: build.mutation<ModelInstance, Partial<ModelInstance>>({
      query(data) {
        const { id, ...body } = data;
        return {
          url: `${URL_PATH}/preferences/`,
          method: "PATCH",
          body,
        };
      },
      invalidatesTags: () => [{ type: TAG, id: "me" }],
    }),
  }),
});

const CERTIFICATION_URL_PATH = `${URL_PATH}/certifications`;

export const certificationsApi = api.injectEndpoints({
  endpoints: (build) => ({
    bulkDeleteCertification: build.mutation<BulkDeleteResponse, number[]>({
      query: (ids) => ({
        url: `${CERTIFICATION_URL_PATH}/bulk-delete/`,
        method: "POST",
        body: { ids },
      }),
      invalidatesTags: [{ type: TAG, id: "LIST" }],
    }),
    createCertification: build.mutation<ModelInstance, Partial<ModelInstance>>({
      query: (body) => ({
        url: `${CERTIFICATION_URL_PATH}/`,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: TAG, id: "LIST" }],
    }),
    deleteCertification: build.mutation<{ success: boolean; id: number }, number>({
      query(id) {
        return {
          url: `${CERTIFICATION_URL_PATH}/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: (item) => [{ type: TAG, id: item?.id }],
    }),
    getCertification: build.query<ModelInstance, number>({
      query: (id) => `${CERTIFICATION_URL_PATH}/${id}`,
      providesTags: (_item, _err, id) => [{ type: TAG, id }],
    }),
    getCertificationModelConfig: build.query<ModelConfig, void>({
      query: () => `${CERTIFICATION_URL_PATH}/model-config`,
      providesTags: (_item, _err) => [{ type: TAG, id: "model-config" }],
    }),
    getCertifications: build.query<PaginatedResponse<ModelInstance>, PaginatedRequestQuery>({
      query: ({
        page,
        pageSize,
        query,
        sortModel,
      }) => ({
        url: (
          `${CERTIFICATION_URL_PATH}?page=${page + 1}&page_size=${pageSize}`
          + `${transformSortModelToQueryString(sortModel)}`
          + `${query ? `&search=${query}` : ""}`
        ),
      }),
      providesTags: (result) => (typeof result !== "undefined" ? [
        ...result.results.map(({ id }) => ({ type: TAG, id: id as number }) as const),
        { type: TAG, id: "LIST" },
      ] : []),
    }),
    updateCertification: build.mutation<ModelInstance, Partial<ModelInstance>>({
      query(data) {
        const { id, ...body } = data;
        return {
          url: `${CERTIFICATION_URL_PATH}/${id}/`,
          method: "PATCH",
          body,
        };
      },
      invalidatesTags: (item) => [{ type: TAG, id: item?.id as number }],
    }),
  }),
});

export const {
  useGetUserProfileByIdQuery,
  useLazyGetUserProfileByIdQuery,
  useUpdatePreferencesMutation,
} = userProfilesApi;

export const {
  useBulkDeleteCertificationMutation,
  useCreateCertificationMutation,
  useGetCertificationModelConfigQuery,
  useGetCertificationsQuery,
  useUpdateCertificationMutation,
} = certificationsApi;

export const {
  endpoints: { getUserProfileById },
} = userProfilesApi;
