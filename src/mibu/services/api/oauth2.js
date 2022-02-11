import AppSettings from "mibu/settings";
import makeRevokeTokenUrl from "mibu/utils/oauth/make-revoke-token-url";
import makeTokenUrl from "mibu/utils/oauth/make-token-url";

import BaseAPIService from "./base";

class OAuth2APIService extends BaseAPIService {
  requestAuthToken = async (code) => this.request("post", makeTokenUrl(), {
    client_id: AppSettings.OAUTH_CLIENT_ID,
    grant_type: "authorization_code",
    redirect_uri: new URL("/auth-callback", window.location.origin).href,
    code_verifier: localStorage.getItem("oauth2:code_verifier"),
    code,
    scope: "read write",
  }).then((res) => {
    localStorage.removeItem("oauth2:code_verifier");

    return res;
  })

  revokeAuthToken = async () => this.request("post", makeRevokeTokenUrl(), {
    client_id: AppSettings.OAUTH_CLIENT_ID,
    token: localStorage.getItem("oauth2:access_token"),
  }).then((res) => {
    localStorage.removeItem("oauth2:code_verifier");
    localStorage.removeItem("oauth2:access_token");
    localStorage.removeItem("oauth2:refresh_token");

    return res;
  })
}

export default OAuth2APIService;
