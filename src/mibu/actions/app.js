import APIService from "mibu/services/api";

import {
  onRetrieveMetadataFailure,
  onRetrieveMetadataRequest,
  onRetrieveMetadataSuccess,
} from "./meta";
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
  dispatch(onRetrieveUserDataRequest("me"));

  APIService.User.retrieveUserProfile("me")
    .then((res) => {
      dispatch(onRetrieveUserDataSuccess("me", res));
      dispatch(onRetrieveMetadataRequest());

      return APIService.Common.retrieveMetadata();
    }, (err) => {
      dispatch(onRetrieveUserDataFailure("me", err));
    })
    .then((res) => {
      dispatch(onRetrieveMetadataSuccess(res));
    }, (err) => {
      dispatch(onRetrieveMetadataFailure(err));
    })
    .finally(() => {
      dispatch(onAppBoot());
    });

  //   dispatch(retrieveUserProfile("me", {
  //   onSuccess: () => {
  //     dispatch(retrieveMetadata({
  //       onCompletion: () => {
  //         dispatch(makeAppBootstrapped());
  //       },
  //     }));
  //   },
  //   onError: () => {
  //     dispatch(makeAppBootstrapped());
  //   },
  // }));
};
