/* eslint-disable no-unused-vars */
import APIService from "mibu/services/api";

import {
  onRetrieveUserDataFailure,
  onRetrieveUserDataRequest,
  onRetrieveUserDataSuccess,
} from "./user";

const APP_OFFLINE = "mibu/offline";
const APP_ONLINE = "mibu/online";
const APP_BOOTED = "mibu/booted";

export const appActions = {
  APP_OFFLINE,
  APP_ONLINE,
  APP_BOOTED,
};

export const onAppOffline = () => ({
  type: APP_OFFLINE,
});

export const onAppOnline = (err) => ({
  type: APP_ONLINE,
  payload: { err },
});

const onAppBoot = () => ({
  type: APP_BOOTED,
});

export const bootApp = () => (dispatch) => {
  const accessToken = localStorage.getItem("oauth2:access_token");

  if (accessToken) {
    dispatch(onRetrieveUserDataRequest("me"));

    APIService.User.retrieveUserProfile("me")
      .then((res) => {
        dispatch(onRetrieveUserDataSuccess("me", res));
      }, (err) => {
        dispatch(onRetrieveUserDataFailure("me", err));
      })
      .finally(() => {
        dispatch(onAppBoot());
      });
  } else {
    dispatch(onAppBoot());
  }
};
