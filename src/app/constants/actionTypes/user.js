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

const UserActionTypes = {
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

export default UserActionTypes;
