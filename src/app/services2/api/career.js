import BaseAPIService from "./base";

class CareerAPIService extends BaseAPIService {
  // ** Job Tracker **
  createJobTracker = async (payload) => this.request(
    "post",
    "/career/job-trackers/",
    payload,
  );

  deleteJobTracker = async (id) => this.request(
    "delete",
    `/career/job-trackers/${id}/`,
  );

  retrieveJobTrackers = async () => this.request("get", "/career/job-trackers");

  updateJobTracker = async (id, payload) => this.request("patch", `/career/job-trackers/${id}`, payload);
}

export default CareerAPIService;
