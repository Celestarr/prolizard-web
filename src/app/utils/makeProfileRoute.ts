import Routes from "app/constants/routes";

export default function makeProfileRoute(username: string) {
  return Routes.USER_PROFILE.replace(":username", username);
}
