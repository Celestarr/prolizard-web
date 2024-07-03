import AppActionTypes from "app/constants/actionTypes/app";
import APIService from "app/services/api";

import {
  onRetrieveUserDataFailure,
  onRetrieveUserDataRequest,
  onRetrieveUserDataSuccess,
} from "./user";

export const onAppOffline = () => ({
  type: AppActionTypes.APP_OFFLINE,
});

export const onAppOnline = (err) => ({
  type: AppActionTypes.APP_ONLINE,
  payload: { err },
});

const onAppBoot = () => ({
  type: AppActionTypes.APP_BOOTED,
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

export const onAppSignInTrigger = () => ({
  type: AppActionTypes.APP_SIGN_IN_TRIGGERED,
});
