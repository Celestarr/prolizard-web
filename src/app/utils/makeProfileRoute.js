import Routes from "app/constants/routes";

export default function makeProfileRoute(username) {
  return Routes.USER_PROFILE.replace(":username", username);
}
