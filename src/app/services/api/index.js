import AuthAPIService from "./auth";
import CareerAPIService from "./career";
import CommonAPIService from "./common";
import OAuth2APIService from "./oauth2";
import UserAPIService from "./user";

export default {
  Auth: new AuthAPIService(),
  Career: new CareerAPIService(),
  Common: new CommonAPIService(),
  OAuth2: new OAuth2APIService(),
  User: new UserAPIService(),
};
