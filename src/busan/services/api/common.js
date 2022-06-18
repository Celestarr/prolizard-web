import BaseAPIService from "./base";

class CommonAPIService extends BaseAPIService {
  retrieveCountries = async () => this.request(
    "get",
    "/countries/",
  )

  retrieveEmploymentTypes = async () => this.request(
    "get",
    "/employment-types/",
  )

  retrieveGenders = async () => this.request(
    "get",
    "/genders/",
  )

  retrieveLanguageProficiencyLevels = async () => this.request(
    "get",
    "/language-proficiency-levels/",
  )

  retrieveSkillProficiencyLevels = async () => this.request(
    "get",
    "/skill-proficiency-levels/",
  )
}

export default CommonAPIService;
