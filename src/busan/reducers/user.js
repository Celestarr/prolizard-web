import UserActionTypes from "busan/constants/actionTypes/user";

const initialState = {};

export default (state = initialState, action) => {
  switch (action.type) {
    case UserActionTypes.CURRENT_USER_DATA_UPDATE_FAILED: {
      return {
        ...state,
        me: {
          ...state.me,
          error: action.payload,
          loading: false,
        },
      };
    }
    case UserActionTypes.CURRENT_USER_DATA_UPDATE_REQUESTED: {
      return {
        ...state,
        me: {
          ...state.me,
          loading: true,
        },
      };
    }
    case UserActionTypes.CURRENT_USER_DATA_UPDATE_SUCCEEDED: {
      return {
        ...state,
        me: {
          data: action.payload,
          error: null,
          loading: false,
        },
      };
    }
    // --
    case UserActionTypes.RETRIEVE_USER_DATA_FAILED: {
      const { err, username } = action.payload;

      return {
        ...state,
        [username]: {
          ...state[username],
          error: err,
          loading: false,
        },
      };
    }
    case UserActionTypes.RETRIEVE_USER_DATA_REQUESTED: {
      const { username } = action.payload;

      return {
        ...state,
        [username]: {
          ...state[username],
          loading: true,
        },
      };
    }
    case UserActionTypes.RETRIEVE_USER_DATA_SUCCEEDED:
    case UserActionTypes.SYNC_CURRENT_USER_DATA: {
      const { data, username } = action.payload;

      return {
        ...state,
        [username]: {
          data,
          error: null,
          loading: false,
        },
      };
    }
    // --
    case UserActionTypes.SIGN_OUT_USER_FAILED: {
      return {
        ...state,
        me: {
          ...state.me,
          error: action.payload,
          loading: false,
        },
      };
    }
    case UserActionTypes.SIGN_OUT_USER_REQUESTED: {
      return {
        ...state,
        me: {
          ...state.me,
          loading: true,
        },
      };
    }
    case UserActionTypes.SIGN_OUT_USER_SUCCEEDED: {
      const stateCopy = { ...state };

      delete stateCopy.me;

      return stateCopy;
    }
    default: return state;
  }
};
