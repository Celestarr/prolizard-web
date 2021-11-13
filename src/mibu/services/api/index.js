import AuthAPIService from "./auth";
import CommonAPIService from "./common";
import UserAPIService from "./user";

export default {
  Auth: new AuthAPIService(),
  Common: new CommonAPIService(),
  User: new UserAPIService(),
};
