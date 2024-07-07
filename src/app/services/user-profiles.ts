import { retry } from "@reduxjs/toolkit/query/react";

import { api, PaginatedResponse } from "./api";
import { Country, Gender } from "./common";

export interface AcademicRecord {
  id: number;
}

export interface Certification {
  id: number;
}

export interface HonorOrAward {
  id: number;
}

export interface Language {
  id: number;
}

export interface Project {
  id: number;
}

export interface Publication {
  id: number;
}

export interface Skill {
  id: number;
}

export interface WebLink {
  id: number;
}

export interface WorkExperience {
  id: number;
}

export interface UserProfile {
  about: null | string;
  academic_records: AcademicRecord[];
  address: null | string;
  certifications: Certification[];
  country: Country | null;
  date_of_birth: null | string;
  email: string;
  first_name: string;
  gender: Gender | null;
  headline: null | string;
  honors_or_awards: HonorOrAward[];
  id: number;
  joined_at: string;
  languages: Language[];
  last_name: string;
  projects: Project[];
  publications: Publication[];
  skills: Skill[];
  username: string;
  web_links: WebLink[];
  work_experiences: WorkExperience[];
}

const URL_PATH = "/profile";
const TAG = "user-profile";

export const userProfilesApi = api.injectEndpoints({
  endpoints: (build) => ({
    retrieveOne: build.query<UserProfile, number | string>({
      query: (id) => `${URL_PATH}/${id}`,
      providesTags: (_post, _err, id) => [{ type: TAG, id }],
    }),
  }),
});

export const {
  useLazyRetrieveOneQuery,
  useRetrieveOneQuery,
} = userProfilesApi;

export const {
  endpoints: { retrieveOne },
} = userProfilesApi;
