import snakeCase from "lodash/snakeCase";
import APIService from "mibu/services/api";
import capitalizeFirstLetter from "mibu/utils/string/capitalizeFirstLetter";

const CURRENT_USER_DATA_UPDATE_REQUESTED = "@users/me/update/requested";
const CURRENT_USER_DATA_UPDATE_FAILED = "@users/me/update/failed";
const CURRENT_USER_DATA_UPDATE_SUCCEEDED = "@users/me/update/succeeded";
const SIGN_OUT_USER_REQUESTED = "@users/me/signOut/requested";
const SIGN_OUT_USER_FAILED = "@users/me/signOut/failed";
const SIGN_OUT_USER_SUCCEEDED = "@users/me/signOut/succeeded";
const RETRIEVE_USER_DATA_REQUESTED = "@users/retrieve/requested";
const RETRIEVE_USER_DATA_FAILED = "@users/retrieve/failed";
const RETRIEVE_USER_DATA_SUCCEEDED = "@users/retrieve/succeeded";
const SYNC_CURRENT_USER_DATA = "@users/me/sync";

export const userActions = {
  CURRENT_USER_DATA_UPDATE_REQUESTED,
  CURRENT_USER_DATA_UPDATE_FAILED,
  CURRENT_USER_DATA_UPDATE_SUCCEEDED,
  SIGN_OUT_USER_REQUESTED,
  SIGN_OUT_USER_FAILED,
  SIGN_OUT_USER_SUCCEEDED,
  RETRIEVE_USER_DATA_REQUESTED,
  RETRIEVE_USER_DATA_FAILED,
  RETRIEVE_USER_DATA_SUCCEEDED,
  SYNC_CURRENT_USER_DATA,
};

const onUpdateCurrentUserDataRequest = () => ({
  type: CURRENT_USER_DATA_UPDATE_REQUESTED,
});

const onUpdateCurrentUserDataFailure = (err) => ({
  type: CURRENT_USER_DATA_UPDATE_FAILED,
  payload: err,
});

const onUpdateCurrentUserDataSuccess = (data) => ({
  type: CURRENT_USER_DATA_UPDATE_SUCCEEDED,
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
  type: RETRIEVE_USER_DATA_REQUESTED,
  payload: { username },
});

export const onRetrieveUserDataFailure = (username, err) => ({
  type: RETRIEVE_USER_DATA_FAILED,
  payload: { err, username },
});

export const onRetrieveUserDataSuccess = (username, data) => ({
  type: RETRIEVE_USER_DATA_SUCCEEDED,
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

  dispatch({ type: SYNC_CURRENT_USER_DATA, payload: { data: currentData, username: "me" } });
};

export const onSignOutUserRequest = () => ({
  type: SIGN_OUT_USER_REQUESTED,
});

export const onSignOutUserFailure = (err) => ({
  type: SIGN_OUT_USER_FAILED,
  payload: { err },
});

export const onSignOutUserSuccess = () => ({
  type: SIGN_OUT_USER_SUCCEEDED,
});

export const signUserOut = (callbacks) => (dispatch) => {
  dispatch(onSignOutUserRequest());

  APIService.Auth.signOut()
    .then((res) => {
      dispatch(onSignOutUserSuccess());

      if (callbacks && callbacks.onSuccess) {
        callbacks.onSuccess(res);
      }
    })
    .catch((err) => {
      dispatch(onSignOutUserFailure(err));

      if (callbacks && callbacks.onError) {
        callbacks.onError(err);
      }
    });
};
