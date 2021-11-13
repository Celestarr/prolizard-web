import BaseAPIService from "./base";

class CommonAPIService extends BaseAPIService {
  retrieveMetadata = async () => this.request("get", "/meta/")
}

export default CommonAPIService;
