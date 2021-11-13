import getPropertyValue from "lodash/get";
import { createSelector } from "reselect";

export const appBootStateSelector = (state) => getPropertyValue(
  state,
  "app.booted",
  false,
);

export const metadataSelector = (state) => getPropertyValue(
  state,
  "meta.data",
  null,
);

export const metadataErrorStateSelector = (state) => getPropertyValue(
  state,
  "meta.error",
  null,
);

export const metadataLoadingStateSelector = (state) => getPropertyValue(
  state,
  "meta.loading",
  false,
);

export const currentUserSelector = (state) => getPropertyValue(state, "users.me.data", null);

export const currentUserErrorStateSelector = (state) => getPropertyValue(
  state,
  "users.me.error",
  null,
);

export const currentUserLoadingStateSelector = (state) => getPropertyValue(
  state,
  "users.me.loading",
  null,
);

export const signInStateSelector = createSelector(
  currentUserSelector,
  (user) => (!!user),
);

export default {
  appBootStateSelector,
  currentUserSelector,
  metadataSelector,
  signInStateSelector,
};
