import Routes from "busan/constants/routes";

export default function makeProfileRoute(username) {
  return Routes.USER_PROFILE.replace(":username", username);
}
