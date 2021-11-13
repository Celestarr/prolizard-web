import Routes from "mibu/constants/routes";

export default function makeProfileRoute(username) {
  return Routes.USER_PROFILE.replace(":username", username);
}
