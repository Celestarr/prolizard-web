import UserActionTypes from "busan/constants/actionTypes/user";
import APIService from "busan/services/api";
import capitalizeFirstLetter from "busan/utils/string/capitalizeFirstLetter";
import snakeCase from "lodash/snakeCase";

const onUpdateCurrentUserDataRequest = () => ({
  type: UserActionTypes.CURRENT_USER_DATA_UPDATE_REQUESTED,
});

const onUpdateCurrentUserDataFailure = (err) => ({
  type: UserActionTypes.CURRENT_USER_DATA_UPDATE_FAILED,
  payload: err,
});

const onUpdateCurrentUserDataSuccess = (data) => ({
  type: UserActionTypes.CURRENT_USER_DATA_UPDATE_SUCCEEDED,
  payload: data,
});

export const updateCurrentUserData = ({
  callbacks,
  scope,
  serviceArgs,
}) => (dispatch, getState) => {
  let svc;
  let responseTransformer;

  const scopeParts = scope.split(".");
  const scopeName = scopeParts[0];
  const scopeAction = scopeParts.length > 1 ? scopeParts[1] : null;

  dispatch(onUpdateCurrentUserDataRequest());

  if (scopeName === "") {
    svc = APIService.User.updateCurrentUserProfile(...serviceArgs);
    responseTransformer = (res) => res;
  } else if (scopeName === "preferences") {
    svc = APIService.User.updateCurrentUserProfile(...serviceArgs);
    responseTransformer = (res) => res;
  } else {
    const scopeNameSnaked = snakeCase(scopeName);
    const currentData = { ...getState().users.me.data };

    if (scopeAction === "create") {
      responseTransformer = (res) => {
        currentData[scopeNameSnaked].push(res);

        return currentData;
      };
    } else if (scopeAction === "update") {
      responseTransformer = (res) => {
        currentData[scopeNameSnaked] = currentData[scopeNameSnaked].map((x) => {
          if (res.id === x.id) {
            return res;
          }

          return x;
        });

        return currentData;
      };
    } else if (scopeAction === "delete") {
      responseTransformer = (res) => {
        currentData[scopeNameSnaked] = currentData[scopeNameSnaked].filter((x) => {
          if (res === x.id) {
            return false;
          }

          return true;
        });

        return currentData;
      };
    }

    svc = APIService.User[
      `${scopeAction}${capitalizeFirstLetter(scopeName.substr(0, scopeName.length - 1))}`
    ](...serviceArgs);
  }

  svc
    .then((res) => {
      dispatch(onUpdateCurrentUserDataSuccess(responseTransformer(res)));

      if (callbacks && callbacks.onSuccess) {
        callbacks.onSuccess(res);
      }
    })
    .catch((err) => {
      dispatch(onUpdateCurrentUserDataFailure(err));

      if (callbacks && callbacks.onError) {
        callbacks.onError(err);
      }
    })
    .finally(() => {
      if (callbacks && callbacks.onCompletion) {
        callbacks.onCompletion();
      }
    });
};

export const onRetrieveUserDataRequest = (username) => ({
  type: UserActionTypes.RETRIEVE_USER_DATA_REQUESTED,
  payload: { username },
});

export const onRetrieveUserDataFailure = (username, err) => ({
  type: UserActionTypes.RETRIEVE_USER_DATA_FAILED,
  payload: { err, username },
});

export const onRetrieveUserDataSuccess = (username, data) => ({
  type: UserActionTypes.RETRIEVE_USER_DATA_SUCCEEDED,
  payload: { data, username },
});

export const retrieveUserData = (username) => (dispatch) => {
  dispatch(onRetrieveUserDataRequest(username));

  APIService.User.retrieveUserProfile(username)
    .then((res) => {
      dispatch(onRetrieveUserDataSuccess(username, res));
    })
    .catch((err) => {
      dispatch(onRetrieveUserDataFailure(username, err));
    });
};

export const syncCurrentUserData = (scope, data) => (dispatch, getState) => {
  const scopeParts = scope.split(".");
  const scopeName = scopeParts[0];
  const scopeAction = scopeParts.length > 1 ? scopeParts[1] : null;
  const currentData = { ...getState().users.me.data };

  if (scopeName === "profile") {
    Object.keys(data).forEach((key) => {
      currentData[key] = data[key];
    });
  } else if (scopeName === "preferences") {
    Object.keys(data).forEach((key) => {
      currentData.preferences[key] = data[key];
    });
  } else {
    const scopeNameSnaked = snakeCase(scopeName);

    if (scopeAction === "create") {
      currentData[scopeNameSnaked].push(data);
    } else if (scopeAction === "update") {
      currentData[scopeNameSnaked] = currentData[scopeNameSnaked].map((x) => {
        if (data.id === x.id) {
          return data;
        }

        return x;
      });
    } else if (scopeAction === "delete") {
      currentData[scopeNameSnaked] = currentData[scopeNameSnaked].filter((x) => {
        if (data === x.id) {
          return false;
        }

        return true;
      });
    }
  }

  dispatch({
    type: UserActionTypes.SYNC_CURRENT_USER_DATA,
    payload: { data: currentData, username: "me" },
  });
};

export const onSignOutUserRequest = () => ({
  type: UserActionTypes.SIGN_OUT_USER_REQUESTED,
});

export const onSignOutUserFailure = (err) => ({
  type: UserActionTypes.SIGN_OUT_USER_FAILED,
  payload: { err },
});

export const onSignOutUserSuccess = () => ({
  type: UserActionTypes.SIGN_OUT_USER_SUCCEEDED,
});

export const signUserOut = (opts) => (dispatch) => {
  dispatch(onSignOutUserRequest());

  APIService.OAuth2.revokeAuthToken()
    .then((res) => {
      if (!opts.noDispatchOnSuccess) {
        dispatch(onSignOutUserSuccess());
      }

      if (opts && opts.onSuccess) {
        opts.onSuccess(res);
      }
    })
    .catch((err) => {
      dispatch(onSignOutUserFailure(err));

      if (opts && opts.onError) {
        opts.onError(err);
      }
    });
};
