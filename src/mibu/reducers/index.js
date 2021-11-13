import { combineReducers } from "redux";

import app from "./app";
import meta from "./meta";
import user from "./user";

export default combineReducers({
  app,
  meta,
  users: user,
});
