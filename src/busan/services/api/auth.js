import BaseAPIService from "./base";

class AuthAPIService extends BaseAPIService {
  signIn = async (payload) => this.request("post", "/profile/sign-in/", payload)

  signUp = async (payload) => this.request("post", "/profile/sign-up/", payload)

  signOut = async () => this.request("post", "/profile/sign-out/")
}

export default AuthAPIService;
