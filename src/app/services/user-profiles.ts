import {
  ModelInstance,
  UserProfile,
} from "types/apiTypes";

import {
  api,
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

export const {
  useGetUserProfileByIdQuery,
  useLazyGetUserProfileByIdQuery,
  useUpdatePreferencesMutation,
} = userProfilesApi;

export const {
  endpoints: { getUserProfileById },
} = userProfilesApi;
