import BaseAPIService from "./base";

class UserAPIService extends BaseAPIService {
  retrieveUserResume = async (username, setProgress) => {
    const { download_url: downloadUrl } = await this.request(
      "get",
      `/storage/resume/${username}/`,
    );

    return this.request(
      "get",
      downloadUrl,
      {
        responseType: "blob",
        onDownloadProgress: (progressEvent) => {
          if (setProgress) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            );
            setProgress(percentCompleted);
          }
        },
        timeout: 0,
      },
    );
  };

  retrieveUserProfile = async (username) => this.request("get", `/profile/${username}/`);

  updateCurrentUserProfile = async (payload) => this.request("patch", "/profile/me/", payload);

  updateCurrentUserPreferences = async (payload) => this.request(
    "patch",
    "/profile/preferences/",
    payload,
  );

  createAcademicRecord = async (payload) => this.request(
    "post",
    "/profile/sections/academic-records/",
    payload,
  );

  deleteAcademicRecord = async (id) => this.request(
    "delete",
    `/profile/sections/academic-records/${id}/`,
  );

  updateAcademicRecord = async (id, payload) => this.request(
    "patch",
    `/profile/sections/academic-records/${id}/`,
    payload,
  );

  createCertification = async (payload) => this.request(
    "post",
    "/profile/sections/certifications/",
    payload,
  );

  deleteCertification = async (id) => this.request(
    "delete",
    `/profile/sections/certifications/${id}/`,
  );

  updateCertification = async (id, payload) => this.request(
    "patch",
    `/profile/sections/certifications/${id}/`,
    payload,
  );

  createHonorOrAward = async (payload) => this.request(
    "post",
    "/profile/sections/honors-or-awards/",
    payload,
  );

  deleteHonorOrAward = async (id) => this.request(
    "delete",
    `/profile/sections/honors-or-awards/${id}/`,
  );

  updateHonorOrAward = async (id, payload) => this.request(
    "patch",
    `/profile/sections/honors-or-awards/${id}/`,
    payload,
  );

  createLanguage = async (payload) => this.request(
    "post",
    "/profile/sections/languages/",
    payload,
  );

  deleteLanguage = async (id) => this.request(
    "delete",
    `/profile/sections/languages/${id}/`,
  );

  updateLanguage = async (id, payload) => this.request(
    "patch",
    `/profile/sections/languages/${id}/`,
    payload,
  );

  createProject = async (payload) => this.request(
    "post",
    "/profile/sections/projects/",
    payload,
  );

  deleteProject = async (id) => this.request(
    "delete",
    `/profile/sections/projects/${id}/`,
  );

  updateProject = async (id, payload) => this.request(
    "patch",
    `/profile/sections/projects/${id}/`,
    payload,
  );

  createPublication = async (payload) => this.request(
    "post",
    "/profile/sections/publications/",
    payload,
  );

  deletePublication = async (id) => this.request(
    "delete",
    `/profile/sections/publications/${id}/`,
  );

  updatePublication = async (id, payload) => this.request(
    "patch",
    `/profile/sections/publications/${id}/`,
    payload,
  );

  createSkill = async (payload) => this.request(
    "post",
    "/profile/sections/skills/",
    payload,
  );

  deleteSkill = async (id) => this.request(
    "delete",
    `/profile/sections/skills/${id}/`,
  );

  updateSkill = async (id, payload) => this.request(
    "patch",
    `/profile/sections/skills/${id}/`,
    payload,
  );

  createWebLink = async (payload) => this.request(
    "post",
    "/profile/sections/web-links/",
    payload,
  );

  deleteWebLink = async (id) => this.request(
    "delete",
    `/profile/sections/web-links/${id}/`,
  );

  updateWebLink = async (id, payload) => this.request(
    "patch",
    `/profile/sections/web-links/${id}/`,
    payload,
  );

  createWorkExperience = async (payload) => this.request(
    "post",
    "/profile/sections/work-experiences/",
    payload,
  );

  deleteWorkExperience = async (id) => this.request(
    "delete",
    `/profile/sections/work-experiences/${id}/`,
  );

  updateWorkExperience = async (id, payload) => this.request(
    "patch",
    `/profile/sections/work-experiences/${id}/`,
    payload,
  );
}

export default UserAPIService;
