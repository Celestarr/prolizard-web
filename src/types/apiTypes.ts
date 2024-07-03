export interface IPaginatedResponse<T> {
  count: number;
  next: number;
  previous: number;
  results: T[];
}

export interface IJobTracker {
  company_name: string;
  application_date: null | string;
  application_deadline: null | string;
  id: number;
  interview_round: null | string;
  notes: null | string;
  position_title: string;
  status: string;
}
