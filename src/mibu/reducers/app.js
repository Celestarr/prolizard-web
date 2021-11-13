import { appActions } from "mibu/actions/app";

const initialState = {
  booted: false,
  online: true,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case appActions.APP_BOOTED: {
      return {
        ...state,
        booted: true,
      };
    }
    case appActions.APP_OFFLINE: {
      return {
        ...state,
        online: false,
      };
    }
    case appActions.APP_ONLINE: {
      return {
        ...state,
        online: true,
      };
    }
    default: return state;
  }
};
