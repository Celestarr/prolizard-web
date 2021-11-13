import { userActions } from "mibu/actions/user";

const initialState = {};

export default (state = initialState, action) => {
  switch (action.type) {
    case userActions.CURRENT_USER_DATA_UPDATE_FAILED: {
      return {
        ...state,
        me: {
          ...state.me,
          error: action.payload,
          loading: false,
        },
      };
    }
    case userActions.CURRENT_USER_DATA_UPDATE_REQUESTED: {
      return {
        ...state,
        me: {
          ...state.me,
          loading: true,
        },
      };
    }
    case userActions.CURRENT_USER_DATA_UPDATE_SUCCEEDED: {
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
    case userActions.RETRIEVE_USER_DATA_FAILED: {
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
    case userActions.RETRIEVE_USER_DATA_REQUESTED: {
      const { username } = action.payload;

      return {
        ...state,
        [username]: {
          ...state[username],
          loading: true,
        },
      };
    }
    case userActions.RETRIEVE_USER_DATA_SUCCEEDED:
    case userActions.SYNC_CURRENT_USER_DATA: {
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
    case userActions.SIGN_OUT_USER_FAILED: {
      return {
        ...state,
        me: {
          ...state.me,
          error: action.payload,
          loading: false,
        },
      };
    }
    case userActions.SIGN_OUT_USER_REQUESTED: {
      return {
        ...state,
        me: {
          ...state.me,
          loading: true,
        },
      };
    }
    case userActions.SIGN_OUT_USER_SUCCEEDED: {
      const stateCopy = { ...state };

      delete stateCopy.me;

      return stateCopy;
    }
    default: return state;
  }
};
