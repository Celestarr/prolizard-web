import AppSettings from "app/settings";

const makeTokenUrl = () => {
  const url = new URL("./token/", `${AppSettings.OAUTH_BASE_URL}/`);

  // url.searchParams.append("client_id", AppSettings.OAUTH_CLIENT_ID);
  // url.searchParams.append("grant_type", "authorization_code");
  // url.searchParams.append("redirect_uri", );
  // url.searchParams.append("code_verifier", "12345");
  // url.searchParams.append("code", code);
  // url.searchParams.append("scope", "read write");

  return url.href;
};

export default makeTokenUrl;
