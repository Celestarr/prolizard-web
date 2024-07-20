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
    getUserProfileModelConfig: build.query<ModelConfig, void>({
      query: () => `${URL_PATH}/model-config`,
      providesTags: (_item, _err) => [{ type: TAG, id: "profile-model-config" }],
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
    updateUserProfile: build.mutation<ModelInstance, Partial<ModelInstance>>({
      query(data) {
        const { id, ...body } = data;
        return {
          url: `${URL_PATH}/me/`,
          method: "PATCH",
          body,
        };
      },
      invalidatesTags: () => [{ type: TAG, id: "me" }],
    }),
  }),
});

const ACADEMIC_RECORD_URL_PATH = `${URL_PATH}/sections/academic-records`;

export const academicRecordApi = api.injectEndpoints({
  endpoints: (build) => ({
    bulkDeleteAcademicRecord: build.mutation<BulkDeleteResponse, number[]>({
      query: (ids) => ({
        url: `${ACADEMIC_RECORD_URL_PATH}/bulk-delete/`,
        method: "POST",
        body: { ids },
      }),
      invalidatesTags: [{ type: TAG, id: "LIST" }],
    }),
    createAcademicRecord: build.mutation<ModelInstance, Partial<ModelInstance>>({
      query: (body) => ({
        url: `${ACADEMIC_RECORD_URL_PATH}/`,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: TAG, id: "LIST" }],
    }),
    deleteAcademicRecord: build.mutation<{ success: boolean; id: number }, number>({
      query(id) {
        return {
          url: `${ACADEMIC_RECORD_URL_PATH}/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: (item) => [{ type: TAG, id: item?.id }],
    }),
    getAcademicRecord: build.query<ModelInstance, number>({
      query: (id) => `${ACADEMIC_RECORD_URL_PATH}/${id}`,
      providesTags: (_item, _err, id) => [{ type: TAG, id }],
    }),
    getAcademicRecordModelConfig: build.query<ModelConfig, void>({
      query: () => `${ACADEMIC_RECORD_URL_PATH}/model-config`,
      providesTags: (_item, _err) => [{ type: TAG, id: "academic-record-model-config" }],
    }),
    getAcademicRecords: build.query<PaginatedResponse<ModelInstance>, PaginatedRequestQuery>({
      query: ({
        page,
        pageSize,
        query,
        sortModel,
      }) => ({
        url: (
          `${ACADEMIC_RECORD_URL_PATH}?page=${page + 1}&page_size=${pageSize}`
          + `${transformSortModelToQueryString(sortModel)}`
          + `${query ? `&search=${query}` : ""}`
        ),
      }),
      providesTags: (result) => (typeof result !== "undefined" ? [
        ...result.results.map(({ id }) => ({ type: TAG, id: id as number }) as const),
        { type: TAG, id: "LIST" },
      ] : []),
    }),
    updateAcademicRecord: build.mutation<ModelInstance, Partial<ModelInstance>>({
      query(data) {
        const { id, ...body } = data;
        return {
          url: `${ACADEMIC_RECORD_URL_PATH}/${id}/`,
          method: "PATCH",
          body,
        };
      },
      invalidatesTags: (item) => [{ type: TAG, id: item?.id as number }],
    }),
  }),
});

const CERTIFICATION_URL_PATH = `${URL_PATH}/sections/certifications`;

export const certificationApi = api.injectEndpoints({
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
      providesTags: (_item, _err) => [{ type: TAG, id: "certification-model-config" }],
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

const HONOR_URL_PATH = `${URL_PATH}/sections/honors-or-awards`;

export const honorApi = api.injectEndpoints({
  endpoints: (build) => ({
    bulkDeleteHonor: build.mutation<BulkDeleteResponse, number[]>({
      query: (ids) => ({
        url: `${HONOR_URL_PATH}/bulk-delete/`,
        method: "POST",
        body: { ids },
      }),
      invalidatesTags: [{ type: TAG, id: "LIST" }],
    }),
    createHonor: build.mutation<ModelInstance, Partial<ModelInstance>>({
      query: (body) => ({
        url: `${HONOR_URL_PATH}/`,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: TAG, id: "LIST" }],
    }),
    deleteHonor: build.mutation<{ success: boolean; id: number }, number>({
      query(id) {
        return {
          url: `${HONOR_URL_PATH}/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: (item) => [{ type: TAG, id: item?.id }],
    }),
    getHonor: build.query<ModelInstance, number>({
      query: (id) => `${HONOR_URL_PATH}/${id}`,
      providesTags: (_item, _err, id) => [{ type: TAG, id }],
    }),
    getHonorModelConfig: build.query<ModelConfig, void>({
      query: () => `${HONOR_URL_PATH}/model-config`,
      providesTags: (_item, _err) => [{ type: TAG, id: "honor-model-config" }],
    }),
    getHonors: build.query<PaginatedResponse<ModelInstance>, PaginatedRequestQuery>({
      query: ({
        page,
        pageSize,
        query,
        sortModel,
      }) => ({
        url: (
          `${HONOR_URL_PATH}?page=${page + 1}&page_size=${pageSize}`
          + `${transformSortModelToQueryString(sortModel)}`
          + `${query ? `&search=${query}` : ""}`
        ),
      }),
      providesTags: (result) => (typeof result !== "undefined" ? [
        ...result.results.map(({ id }) => ({ type: TAG, id: id as number }) as const),
        { type: TAG, id: "LIST" },
      ] : []),
    }),
    updateHonor: build.mutation<ModelInstance, Partial<ModelInstance>>({
      query(data) {
        const { id, ...body } = data;
        return {
          url: `${HONOR_URL_PATH}/${id}/`,
          method: "PATCH",
          body,
        };
      },
      invalidatesTags: (item) => [{ type: TAG, id: item?.id as number }],
    }),
  }),
});

const LANGUAGE_URL_PATH = `${URL_PATH}/sections/languages`;

export const languageApi = api.injectEndpoints({
  endpoints: (build) => ({
    bulkDeleteLanguage: build.mutation<BulkDeleteResponse, number[]>({
      query: (ids) => ({
        url: `${LANGUAGE_URL_PATH}/bulk-delete/`,
        method: "POST",
        body: { ids },
      }),
      invalidatesTags: [{ type: TAG, id: "LIST" }],
    }),
    createLanguage: build.mutation<ModelInstance, Partial<ModelInstance>>({
      query: (body) => ({
        url: `${LANGUAGE_URL_PATH}/`,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: TAG, id: "LIST" }],
    }),
    deleteLanguage: build.mutation<{ success: boolean; id: number }, number>({
      query(id) {
        return {
          url: `${LANGUAGE_URL_PATH}/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: (item) => [{ type: TAG, id: item?.id }],
    }),
    getLanguage: build.query<ModelInstance, number>({
      query: (id) => `${LANGUAGE_URL_PATH}/${id}`,
      providesTags: (_item, _err, id) => [{ type: TAG, id }],
    }),
    getLanguageModelConfig: build.query<ModelConfig, void>({
      query: () => `${LANGUAGE_URL_PATH}/model-config`,
      providesTags: (_item, _err) => [{ type: TAG, id: "language-model-config" }],
    }),
    getLanguages: build.query<PaginatedResponse<ModelInstance>, PaginatedRequestQuery>({
      query: ({
        page,
        pageSize,
        query,
        sortModel,
      }) => ({
        url: (
          `${LANGUAGE_URL_PATH}?page=${page + 1}&page_size=${pageSize}`
          + `${transformSortModelToQueryString(sortModel)}`
          + `${query ? `&search=${query}` : ""}`
        ),
      }),
      providesTags: (result) => (typeof result !== "undefined" ? [
        ...result.results.map(({ id }) => ({ type: TAG, id: id as number }) as const),
        { type: TAG, id: "LIST" },
      ] : []),
    }),
    updateLanguage: build.mutation<ModelInstance, Partial<ModelInstance>>({
      query(data) {
        const { id, ...body } = data;
        return {
          url: `${LANGUAGE_URL_PATH}/${id}/`,
          method: "PATCH",
          body,
        };
      },
      invalidatesTags: (item) => [{ type: TAG, id: item?.id as number }],
    }),
  }),
});

const PROJECT_URL_PATH = `${URL_PATH}/sections/projects`;

export const projectApi = api.injectEndpoints({
  endpoints: (build) => ({
    bulkDeleteProject: build.mutation<BulkDeleteResponse, number[]>({
      query: (ids) => ({
        url: `${PROJECT_URL_PATH}/bulk-delete/`,
        method: "POST",
        body: { ids },
      }),
      invalidatesTags: [{ type: TAG, id: "LIST" }],
    }),
    createProject: build.mutation<ModelInstance, Partial<ModelInstance>>({
      query: (body) => ({
        url: `${PROJECT_URL_PATH}/`,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: TAG, id: "LIST" }],
    }),
    deleteProject: build.mutation<{ success: boolean; id: number }, number>({
      query(id) {
        return {
          url: `${PROJECT_URL_PATH}/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: (item) => [{ type: TAG, id: item?.id }],
    }),
    getProject: build.query<ModelInstance, number>({
      query: (id) => `${PROJECT_URL_PATH}/${id}`,
      providesTags: (_item, _err, id) => [{ type: TAG, id }],
    }),
    getProjectModelConfig: build.query<ModelConfig, void>({
      query: () => `${PROJECT_URL_PATH}/model-config`,
      providesTags: (_item, _err) => [{ type: TAG, id: "project-model-config" }],
    }),
    getProjects: build.query<PaginatedResponse<ModelInstance>, PaginatedRequestQuery>({
      query: ({
        page,
        pageSize,
        query,
        sortModel,
      }) => ({
        url: (
          `${PROJECT_URL_PATH}?page=${page + 1}&page_size=${pageSize}`
          + `${transformSortModelToQueryString(sortModel)}`
          + `${query ? `&search=${query}` : ""}`
        ),
      }),
      providesTags: (result) => (typeof result !== "undefined" ? [
        ...result.results.map(({ id }) => ({ type: TAG, id: id as number }) as const),
        { type: TAG, id: "LIST" },
      ] : []),
    }),
    updateProject: build.mutation<ModelInstance, Partial<ModelInstance>>({
      query(data) {
        const { id, ...body } = data;
        return {
          url: `${PROJECT_URL_PATH}/${id}/`,
          method: "PATCH",
          body,
        };
      },
      invalidatesTags: (item) => [{ type: TAG, id: item?.id as number }],
    }),
  }),
});

const PUBLICATION_URL_PATH = `${URL_PATH}/sections/publications`;

export const publicationApi = api.injectEndpoints({
  endpoints: (build) => ({
    bulkDeletePublication: build.mutation<BulkDeleteResponse, number[]>({
      query: (ids) => ({
        url: `${PUBLICATION_URL_PATH}/bulk-delete/`,
        method: "POST",
        body: { ids },
      }),
      invalidatesTags: [{ type: TAG, id: "LIST" }],
    }),
    createPublication: build.mutation<ModelInstance, Partial<ModelInstance>>({
      query: (body) => ({
        url: `${PUBLICATION_URL_PATH}/`,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: TAG, id: "LIST" }],
    }),
    deletePublication: build.mutation<{ success: boolean; id: number }, number>({
      query(id) {
        return {
          url: `${PUBLICATION_URL_PATH}/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: (item) => [{ type: TAG, id: item?.id }],
    }),
    getPublication: build.query<ModelInstance, number>({
      query: (id) => `${PUBLICATION_URL_PATH}/${id}`,
      providesTags: (_item, _err, id) => [{ type: TAG, id }],
    }),
    getPublicationModelConfig: build.query<ModelConfig, void>({
      query: () => `${PUBLICATION_URL_PATH}/model-config`,
      providesTags: (_item, _err) => [{ type: TAG, id: "publication-model-config" }],
    }),
    getPublications: build.query<PaginatedResponse<ModelInstance>, PaginatedRequestQuery>({
      query: ({
        page,
        pageSize,
        query,
        sortModel,
      }) => ({
        url: (
          `${PUBLICATION_URL_PATH}?page=${page + 1}&page_size=${pageSize}`
          + `${transformSortModelToQueryString(sortModel)}`
          + `${query ? `&search=${query}` : ""}`
        ),
      }),
      providesTags: (result) => (typeof result !== "undefined" ? [
        ...result.results.map(({ id }) => ({ type: TAG, id: id as number }) as const),
        { type: TAG, id: "LIST" },
      ] : []),
    }),
    updatePublication: build.mutation<ModelInstance, Partial<ModelInstance>>({
      query(data) {
        const { id, ...body } = data;
        return {
          url: `${PUBLICATION_URL_PATH}/${id}/`,
          method: "PATCH",
          body,
        };
      },
      invalidatesTags: (item) => [{ type: TAG, id: item?.id as number }],
    }),
  }),
});

const SKILL_URL_PATH = `${URL_PATH}/sections/skills`;

export const skillApi = api.injectEndpoints({
  endpoints: (build) => ({
    bulkDeleteSkill: build.mutation<BulkDeleteResponse, number[]>({
      query: (ids) => ({
        url: `${SKILL_URL_PATH}/bulk-delete/`,
        method: "POST",
        body: { ids },
      }),
      invalidatesTags: [{ type: TAG, id: "LIST" }],
    }),
    createSkill: build.mutation<ModelInstance, Partial<ModelInstance>>({
      query: (body) => ({
        url: `${SKILL_URL_PATH}/`,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: TAG, id: "LIST" }],
    }),
    deleteSkill: build.mutation<{ success: boolean; id: number }, number>({
      query(id) {
        return {
          url: `${SKILL_URL_PATH}/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: (item) => [{ type: TAG, id: item?.id }],
    }),
    getSkill: build.query<ModelInstance, number>({
      query: (id) => `${SKILL_URL_PATH}/${id}`,
      providesTags: (_item, _err, id) => [{ type: TAG, id }],
    }),
    getSkillModelConfig: build.query<ModelConfig, void>({
      query: () => `${SKILL_URL_PATH}/model-config`,
      providesTags: (_item, _err) => [{ type: TAG, id: "skill-model-config" }],
    }),
    getSkills: build.query<PaginatedResponse<ModelInstance>, PaginatedRequestQuery>({
      query: ({
        page,
        pageSize,
        query,
        sortModel,
      }) => ({
        url: (
          `${SKILL_URL_PATH}?page=${page + 1}&page_size=${pageSize}`
          + `${transformSortModelToQueryString(sortModel)}`
          + `${query ? `&search=${query}` : ""}`
        ),
      }),
      providesTags: (result) => (typeof result !== "undefined" ? [
        ...result.results.map(({ id }) => ({ type: TAG, id: id as number }) as const),
        { type: TAG, id: "LIST" },
      ] : []),
    }),
    updateSkill: build.mutation<ModelInstance, Partial<ModelInstance>>({
      query(data) {
        const { id, ...body } = data;
        return {
          url: `${SKILL_URL_PATH}/${id}/`,
          method: "PATCH",
          body,
        };
      },
      invalidatesTags: (item) => [{ type: TAG, id: item?.id as number }],
    }),
  }),
});

const WEB_LINK_URL_PATH = `${URL_PATH}/sections/web-links`;

export const webLinkApi = api.injectEndpoints({
  endpoints: (build) => ({
    bulkDeleteWebLink: build.mutation<BulkDeleteResponse, number[]>({
      query: (ids) => ({
        url: `${WEB_LINK_URL_PATH}/bulk-delete/`,
        method: "POST",
        body: { ids },
      }),
      invalidatesTags: [{ type: TAG, id: "LIST" }],
    }),
    createWebLink: build.mutation<ModelInstance, Partial<ModelInstance>>({
      query: (body) => ({
        url: `${WEB_LINK_URL_PATH}/`,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: TAG, id: "LIST" }],
    }),
    deleteWebLink: build.mutation<{ success: boolean; id: number }, number>({
      query(id) {
        return {
          url: `${WEB_LINK_URL_PATH}/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: (item) => [{ type: TAG, id: item?.id }],
    }),
    getWebLink: build.query<ModelInstance, number>({
      query: (id) => `${WEB_LINK_URL_PATH}/${id}`,
      providesTags: (_item, _err, id) => [{ type: TAG, id }],
    }),
    getWebLinkModelConfig: build.query<ModelConfig, void>({
      query: () => `${WEB_LINK_URL_PATH}/model-config`,
      providesTags: (_item, _err) => [{ type: TAG, id: "web-link-model-config" }],
    }),
    getWebLinks: build.query<PaginatedResponse<ModelInstance>, PaginatedRequestQuery>({
      query: ({
        page,
        pageSize,
        query,
        sortModel,
      }) => ({
        url: (
          `${WEB_LINK_URL_PATH}?page=${page + 1}&page_size=${pageSize}`
          + `${transformSortModelToQueryString(sortModel)}`
          + `${query ? `&search=${query}` : ""}`
        ),
      }),
      providesTags: (result) => (typeof result !== "undefined" ? [
        ...result.results.map(({ id }) => ({ type: TAG, id: id as number }) as const),
        { type: TAG, id: "LIST" },
      ] : []),
    }),
    updateWebLink: build.mutation<ModelInstance, Partial<ModelInstance>>({
      query(data) {
        const { id, ...body } = data;
        return {
          url: `${WEB_LINK_URL_PATH}/${id}/`,
          method: "PATCH",
          body,
        };
      },
      invalidatesTags: (item) => [{ type: TAG, id: item?.id as number }],
    }),
  }),
});

const WORK_EXPERIENCE_URL_PATH = `${URL_PATH}/sections/work-experiences`;

export const workExperienceApi = api.injectEndpoints({
  endpoints: (build) => ({
    bulkDeleteWorkExperience: build.mutation<BulkDeleteResponse, number[]>({
      query: (ids) => ({
        url: `${WORK_EXPERIENCE_URL_PATH}/bulk-delete/`,
        method: "POST",
        body: { ids },
      }),
      invalidatesTags: [{ type: TAG, id: "LIST" }],
    }),
    createWorkExperience: build.mutation<ModelInstance, Partial<ModelInstance>>({
      query: (body) => ({
        url: `${WORK_EXPERIENCE_URL_PATH}/`,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: TAG, id: "LIST" }],
    }),
    deleteWorkExperience: build.mutation<{ success: boolean; id: number }, number>({
      query(id) {
        return {
          url: `${WORK_EXPERIENCE_URL_PATH}/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: (item) => [{ type: TAG, id: item?.id }],
    }),
    getWorkExperience: build.query<ModelInstance, number>({
      query: (id) => `${WORK_EXPERIENCE_URL_PATH}/${id}`,
      providesTags: (_item, _err, id) => [{ type: TAG, id }],
    }),
    getWorkExperienceModelConfig: build.query<ModelConfig, void>({
      query: () => `${WORK_EXPERIENCE_URL_PATH}/model-config`,
      providesTags: (_item, _err) => [{ type: TAG, id: "work-experience-model-config" }],
    }),
    getWorkExperiences: build.query<PaginatedResponse<ModelInstance>, PaginatedRequestQuery>({
      query: ({
        page,
        pageSize,
        query,
        sortModel,
      }) => ({
        url: (
          `${WORK_EXPERIENCE_URL_PATH}?page=${page + 1}&page_size=${pageSize}`
          + `${transformSortModelToQueryString(sortModel)}`
          + `${query ? `&search=${query}` : ""}`
        ),
      }),
      providesTags: (result) => (typeof result !== "undefined" ? [
        ...result.results.map(({ id }) => ({ type: TAG, id: id as number }) as const),
        { type: TAG, id: "LIST" },
      ] : []),
    }),
    updateWorkExperience: build.mutation<ModelInstance, Partial<ModelInstance>>({
      query(data) {
        const { id, ...body } = data;
        return {
          url: `${WORK_EXPERIENCE_URL_PATH}/${id}/`,
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
  useGetUserProfileModelConfigQuery,
  useLazyGetUserProfileByIdQuery,
  useUpdatePreferencesMutation,
  useUpdateUserProfileMutation,
} = userProfilesApi;

export const {
  useBulkDeleteAcademicRecordMutation,
  useCreateAcademicRecordMutation,
  useGetAcademicRecordModelConfigQuery,
  useGetAcademicRecordsQuery,
  useUpdateAcademicRecordMutation,
} = academicRecordApi;

export const {
  useBulkDeleteCertificationMutation,
  useCreateCertificationMutation,
  useGetCertificationModelConfigQuery,
  useGetCertificationsQuery,
  useUpdateCertificationMutation,
} = certificationApi;

export const {
  useBulkDeleteHonorMutation,
  useCreateHonorMutation,
  useGetHonorModelConfigQuery,
  useGetHonorsQuery,
  useUpdateHonorMutation,
} = honorApi;

export const {
  useBulkDeleteLanguageMutation,
  useCreateLanguageMutation,
  useGetLanguageModelConfigQuery,
  useGetLanguagesQuery,
  useUpdateLanguageMutation,
} = languageApi;

export const {
  useBulkDeleteProjectMutation,
  useCreateProjectMutation,
  useGetProjectModelConfigQuery,
  useGetProjectsQuery,
  useUpdateProjectMutation,
} = projectApi;

export const {
  useBulkDeletePublicationMutation,
  useCreatePublicationMutation,
  useGetPublicationModelConfigQuery,
  useGetPublicationsQuery,
  useUpdatePublicationMutation,
} = publicationApi;

export const {
  useBulkDeleteSkillMutation,
  useCreateSkillMutation,
  useGetSkillModelConfigQuery,
  useGetSkillsQuery,
  useUpdateSkillMutation,
} = skillApi;

export const {
  useBulkDeleteWebLinkMutation,
  useCreateWebLinkMutation,
  useGetWebLinkModelConfigQuery,
  useGetWebLinksQuery,
  useUpdateWebLinkMutation,
} = webLinkApi;

export const {
  useBulkDeleteWorkExperienceMutation,
  useCreateWorkExperienceMutation,
  useGetWorkExperienceModelConfigQuery,
  useGetWorkExperiencesQuery,
  useUpdateWorkExperienceMutation,
} = workExperienceApi;

export const {
  endpoints: { getUserProfileById },
} = userProfilesApi;
