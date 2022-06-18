import AppSettings from "busan/settings";

import {
  bufferToBase64UrlEncoded,
  createRandomString,
  // encode,
  sha256,
} from "./code-challenge-utils";

const makeAuthorizeUrl = async () => {
  const url = new URL("./authorize/", `${AppSettings.OAUTH_BASE_URL}/`);

  // const stateIn = encode(createRandomString());
  // const nonceIn = encode(createRandomString());
  const codeVerifier = createRandomString();
  const codeChallengeBuffer = await sha256(codeVerifier);
  const codeChallenge = bufferToBase64UrlEncoded(codeChallengeBuffer);

  localStorage.setItem("oauth2:code_verifier", codeVerifier);

  url.searchParams.append("client_id", AppSettings.OAUTH_CLIENT_ID);
  url.searchParams.append("response_type", "code");
  url.searchParams.append("redirect_uri", new URL("/auth-callback", window.location.origin).href);
  url.searchParams.append("code_challenge", codeChallenge);
  url.searchParams.append("code_challenge_method", "S256");
  url.searchParams.append("scope", "read write");

  return url.href;
};

export default makeAuthorizeUrl;
