/* eslint-disable no-unused-vars */
import APIService from "busan/services/api";

import {
  onRetrieveUserDataFailure,
  onRetrieveUserDataRequest,
  onRetrieveUserDataSuccess,
} from "./user";

const APP_OFFLINE = "busan/offline";
const APP_ONLINE = "busan/online";
const APP_BOOTED = "busan/booted";

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

export const bootApp = (isAuthenticated) => (dispatch) => {
  if (isAuthenticated) {
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
