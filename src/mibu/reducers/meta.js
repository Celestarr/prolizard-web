import { metaActions } from "mibu/actions/meta";

const initialState = {};

export default (state = initialState, action) => {
  switch (action.type) {
    case metaActions.RETRIEVE_METADATA_FAILED: {
      const { err } = action.payload;

      return {
        ...state,
        error: err,
        loading: false,
      };
    }
    case metaActions.RETRIEVE_METADATA_REQUESTED: {
      return {
        ...state,
        loading: true,
      };
    }
    case metaActions.RETRIEVE_METADATA_SUCCEEDED: {
      const { data } = action.payload;

      return {
        data,
        error: null,
        loading: false,
      };
    }
    default: return state;
  }
};
