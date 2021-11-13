import BaseAPIService from "./base";

class AuthAPIService extends BaseAPIService {
  signIn = async (payload) => this.request("post", "/members/sign-in/", payload)

  signUp = async (payload) => this.request("post", "/members/sign-up/", payload)

  signOut = async () => this.request("post", "/members/sign-out/")
}

export default AuthAPIService;
