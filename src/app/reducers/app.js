import AppActionTypes from "app/constants/actionTypes/app";

const initialState = {
  booted: false,
  online: true,
  triggerSignIn: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case AppActionTypes.APP_BOOTED: {
      return {
        ...state,
        booted: true,
      };
    }
    case AppActionTypes.APP_OFFLINE: {
      return {
        ...state,
        online: false,
      };
    }
    case AppActionTypes.APP_ONLINE: {
      return {
        ...state,
        online: true,
      };
    }
    case AppActionTypes.APP_SIGN_IN_TRIGGERED: {
      return {
        ...state,
        triggerSignIn: true,
      };
    }
    default: return state;
  }
};
