import BaseAPIService from "./base";

class UserAPIService extends BaseAPIService {
  retrieveUserResume = async (username, setProgress) => {
    const { download_url: downloadUrl } = await this.request(
      "get",
      `/store/member-resume/${username}/`,
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
  }

  retrieveMetadata = async () => this.request("get", "/meta/")

  retrieveUserProfile = async (username) => this.request("get", `/members/${username}/`)

  updateCurrentUserProfile = async (payload) => this.request("patch", "/members/me/", payload)

  updateCurrentUserPreferences = async (payload) => this.request(
    "patch",
    "/members/preferences/",
    payload,
  )

  createAcademicRecord = async (payload) => this.request(
    "post",
    "/members/profile-sections/academic-records/",
    payload,
  )

  deleteAcademicRecord = async (id) => this.request(
    "delete",
    `/members/profile-sections/academic-records/${id}/`,
  )

  updateAcademicRecord = async (id, payload) => this.request(
    "patch",
    `/members/profile-sections/academic-records/${id}/`,
    payload,
  )

  createCertification = async (payload) => this.request(
    "post",
    "/members/profile-sections/certifications/",
    payload,
  )

  deleteCertification = async (id) => this.request(
    "delete",
    `/members/profile-sections/certifications/${id}/`,
  )

  updateCertification = async (id, payload) => this.request(
    "patch",
    `/members/profile-sections/certifications/${id}/`,
    payload,
  )

  createHonorOrAward = async (payload) => this.request(
    "post",
    "/members/profile-sections/honors-or-awards/",
    payload,
  )

  deleteHonorOrAward = async (id) => this.request(
    "delete",
    `/members/profile-sections/honors-or-awards/${id}/`,
  )

  updateHonorOrAward = async (id, payload) => this.request(
    "patch",
    `/members/profile-sections/honors-or-awards/${id}/`,
    payload,
  )

  createLanguage = async (payload) => this.request(
    "post",
    "/members/profile-sections/languages/",
    payload,
  )

  deleteLanguage = async (id) => this.request(
    "delete",
    `/members/profile-sections/languages/${id}/`,
  )

  updateLanguage = async (id, payload) => this.request(
    "patch",
    `/members/profile-sections/languages/${id}/`,
    payload,
  )

  createProject = async (payload) => this.request(
    "post",
    "/members/profile-sections/projects/",
    payload,
  )

  deleteProject = async (id) => this.request(
    "delete",
    `/members/profile-sections/projects/${id}/`,
  )

  updateProject = async (id, payload) => this.request(
    "patch",
    `/members/profile-sections/projects/${id}/`,
    payload,
  )

  createPublication = async (payload) => this.request(
    "post",
    "/members/profile-sections/publications/",
    payload,
  )

  deletePublication = async (id) => this.request(
    "delete",
    `/members/profile-sections/publications/${id}/`,
  )

  updatePublication = async (id, payload) => this.request(
    "patch",
    `/members/profile-sections/publications/${id}/`,
    payload,
  )

  createSkill = async (payload) => this.request(
    "post",
    "/members/profile-sections/skills/",
    payload,
  )

  deleteSkill = async (id) => this.request(
    "delete",
    `/members/profile-sections/skills/${id}/`,
  )

  updateSkill = async (id, payload) => this.request(
    "patch",
    `/members/profile-sections/skills/${id}/`,
    payload,
  )

  createWebLink = async (payload) => this.request(
    "post",
    "/members/profile-sections/web-links/",
    payload,
  )

  deleteWebLink = async (id) => this.request(
    "delete",
    `/members/profile-sections/web-links/${id}/`,
  )

  updateWebLink = async (id, payload) => this.request(
    "patch",
    `/members/profile-sections/web-links/${id}/`,
    payload,
  )

  createWorkExperience = async (payload) => this.request(
    "post",
    "/members/profile-sections/work-experiences/",
    payload,
  )

  deleteWorkExperience = async (id) => this.request(
    "delete",
    `/members/profile-sections/work-experiences/${id}/`,
  )

  updateWorkExperience = async (id, payload) => this.request(
    "patch",
    `/members/profile-sections/work-experiences/${id}/`,
    payload,
  )
}

export default UserAPIService;
