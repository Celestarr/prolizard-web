import axios from "axios";
import AppSettings from "mibu/settings";

class BaseAPIService {
  static _axios = null;

  constructor() {
    BaseAPIService.init();
    this._axios = BaseAPIService._axios;
  }

  get = (url, config) => this._axios.get(url, config)

  delete = (url, config) => this._axios.delete(url, config)

  patch = (url, data, config) => this._axios.patch(url, data, config)

  post = (url, data, config) => this._axios.post(url, data, config)

  request = async (method, url, ...args) => {
    try {
      const res = await this[method](url, ...args);
      return res.data;
    } catch (err) {
      return BaseAPIService.handleError(err);
    }
  }

  static handleError(err) {
    let errorMessage;

    if (!err.response) {
      errorMessage = "Server is unreachable. Check your connection.";
    } else {
      const { data } = err.response;
      errorMessage = data && data.message
        ? `${data.message}`
        : "Something went wrong.";
    }

    const error = new Error(errorMessage);
    error.message = errorMessage;
    error.code = "api_error";

    throw error;
  }

  static init() {
    if (!BaseAPIService._axios) {
      BaseAPIService._axios = axios.create({
        baseURL: AppSettings.API_BASE_URL,
        headers: {
          "X-Requested-With": "XMLHttpRequest",
        },
        xsrfCookieName: "csrftoken",
        xsrfHeaderName: "X-CSRFToken",
        withCredentials: true,
      });

      BaseAPIService.registerInterceptors(BaseAPIService._axios);
    }
  }

  static registerInterceptors($axios) {
    $axios.interceptors.request.use((config) => {
      // eslint-disable-next-line no-param-reassign
      config.headers = {
        ...config.headers,
      };

      return config;
    }, undefined);

    // eslint-disable-next-line arrow-body-style
    $axios.interceptors.response.use(undefined, async (err) => {
      // const { response: errResponse } = err;

      // if (errResponse.status === 401) {
      //   store.dispatch(signUserOut());
      // }

      return Promise.reject(err);
    });
  }
}

export default BaseAPIService;
