import axios from "axios";
import AppActionTypes from "busan/constants/actionTypes/app";
import AppSettings from "busan/settings";
import store from "busan/store";
import { User } from "oidc-client-ts";

const _getUser = () => {
  const oidcStorage = sessionStorage.getItem(
    `oidc.user:${AppSettings.OAUTH_BASE_URL}:${AppSettings.OAUTH_CLIENT_ID}`,
  );
  if (!oidcStorage) {
    return null;
  }

  return User.fromStorageString(oidcStorage);
};

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
        // withCredentials: true,
      });

      BaseAPIService.registerInterceptors(BaseAPIService._axios);
    }
  }

  static registerInterceptors($axios) {
    $axios.interceptors.request.use((config) => {
      const extraHeaders = {};

      const isExternalUrl = config.url.startsWith("http://") || config.url.startsWith("https://");

      if (!isExternalUrl) {
        const user = _getUser();

        if (user) {
          extraHeaders.Authorization = `Bearer ${user.access_token}`;
        }
      }

      // eslint-disable-next-line no-param-reassign
      config.headers = {
        ...config.headers,
        ...extraHeaders,
      };

      return config;
    }, undefined);

    // eslint-disable-next-line arrow-body-style
    $axios.interceptors.response.use(undefined, async (err) => {
      const { response: errResponse } = err;

      if (errResponse.status === 401) {
        store.dispatch({ type: AppActionTypes.APP_SIGN_IN_TRIGGERED });
      }

      return Promise.reject(err);
    });
  }
}

export default BaseAPIService;
