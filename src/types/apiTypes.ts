import {
  GridSortModel,
} from "@mui/x-data-grid";

export interface AcademicRecord {
  degree: string;
  id: number;
  school: string;
}

export interface Certification {
  id: number;
}

export interface Country {
  id: number;
  iso_3166_1_alpha_2_code: string;
  iso_3166_1_alpha_3_code: string;
  name: string;
}

export interface FormFieldConfig {
  choices?: string[][];
  help_text?: string;
  max_length?: number; // for string
  min_length?: number; // for string
  max_value?: number; // for string
  min_value?: number; // for numbers
  name: string;
  regex?: string;
  related_model?: "Country";
  required: boolean;
  type: "date" | "datetime" | "email" | "integer" | "related" | "string" | "text";
  verbose_name: string;
}

export interface FormLayoutConfig {
  fields: string[];
  row: number;
  sizes: number[];
}

export interface GenericResponse {
  message: string;
}

export interface BulkDeleteResponse extends GenericResponse {
  count?: number;
}

export interface HonorOrAward {
  id: number;
}

export interface Language {
  id: number;
}

export interface ModelConfig {
  fields: FormFieldConfig[];
  layout: FormLayoutConfig[];
  name: string;
  verbose_name: string;
}

export type ModelInstanceFieldValue = Country | null | number | string | undefined;

export interface ModelInstance {
  country?: Country | null;
  [key: string]: ModelInstanceFieldValue | ModelInstance;
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

export interface ArticleSearchRequestQuery extends PaginatedRequestQuery {
  sorting: string;
  yearMax: number;
  yearMin: number;
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

export interface UserPreference {
  ui_mode: "DARK" | "LIGHT" | "SYSTEM";
}

export interface WebLink {
  id: number;
}

export interface WorkExperience {
  company: string;
  id: number;
  job_title: string;
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
  gender: "FEMALE" | "MALE" | "OTHER" | null;
  headline: null | string;
  honors_or_awards: HonorOrAward[];
  id: number;
  joined_at: string;
  languages: Language[];
  last_name: string;
  preferences?: UserPreference;
  projects: Project[];
  publications: Publication[];
  skills: Skill[];
  username: string;
  web_links: WebLink[];
  work_experiences: WorkExperience[];
}
