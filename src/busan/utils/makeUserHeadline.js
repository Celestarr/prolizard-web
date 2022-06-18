import getCurrentExperienceObject from "./getCurrentExperienceObject";
import getHighestEducationObject from "./getHighestEducationObject";

export default function makeUserHeadline(user) {
  const experienceObject = getCurrentExperienceObject(user.work_experiences);

  if (experienceObject) {
    return `${experienceObject.job_title} at ${experienceObject.company}`;
  }

  const highestEducationObject = getHighestEducationObject(user.academic_records);

  if (highestEducationObject) {
    return `${highestEducationObject.degree} from ${highestEducationObject.school}`;
  }

  return null;
}
