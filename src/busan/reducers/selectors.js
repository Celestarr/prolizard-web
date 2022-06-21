import getPropertyValue from "lodash/get";
import { createSelector } from "reselect";

export const appBootStateSelector = (state) => getPropertyValue(
  state,
  "app.booted",
  false,
);

export const appSignInTriggerStateSelector = (state) => getPropertyValue(
  state,
  "app.triggerSignIn",
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
  signInStateSelector,
};
